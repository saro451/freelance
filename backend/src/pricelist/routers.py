import json
from typing import List

from fastapi import APIRouter, Depends, HTTPException, Request, status
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from sqlmodel import Session, or_

from src.database import db_main, db_org, db_redis_document
from src.database.language.utils import get_language_dict
from src.database.main.models import OrgSetting
from src.utils.authentication import authenticate_user
from src.utils.response import Success

from .models import Product
from .schemas import ChangePriceListMode, ProductOrderBy, ProductSearchType
from .utils import get_product_unique_id, raise_if_edit_conflict

router = APIRouter(dependencies=[Depends(authenticate_user())])
templates = Jinja2Templates(directory="../templates/products")


@router.get(
    "/products", response_model=List[Product], description="Get list of products"
)
def products(
    request: Request,
    db: Session = Depends(db_main),
    db_org: Session = Depends(db_org),
    title: str = None,
    article: str = None,
    search_type: ProductSearchType = ProductSearchType.ALL,
    offset: int = 0,
):
    mode = (
        db.query(OrgSetting.price_list_mode)
        .filter(OrgSetting.org_id == request.state.user.org_id)
        .scalar()
    )
    order_by = ProductOrderBy.get(request.cookies.get("pricelist_order"), mode=mode)

    product_list = (
        db_org.query(Product)
        .filter(
            True
            if not title
            else or_(
                Product.name.ilike(f"%{title}%"),
                Product.description.ilike(f"%{title}%"),
            )
            if search_type == search_type.ALL
            else or_(
                Product.name.ilike(f"{title}%"),
            )
        )
        .filter(
            or_(
                Product.article_number.ilike(
                    f"%{article}%" if search_type == search_type.ALL else f"{article}%"
                )
            )
            if article
            else True
        )
        .order_by(order_by)
        .offset(offset * 50)
        .limit(50)
        .all()
    )

    if not product_list and (title or article):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="no_results")

    return product_list


@router.post("/products", description="Add a new product", response_model=Success)
def add_product(
    product: Product,
    db_org: Session = Depends(db_org),
):
    # Set ID and unique_id to None if it is set
    product.id = None
    product.unique_id = None

    db_org.add(product)
    db_org.commit()

    return Success(status="product_added", message="The product has been added.")


@router.patch(
    "/products/mode", description="Update mode of price list", response_model=Success
)
def update_advanced_mode(
    request: Request, data: ChangePriceListMode, db: Session = Depends(db_main)
):
    org_settings = (
        db.query(OrgSetting)
        .filter(OrgSetting.org_id == request.state.user.org_id)
        .first()
    )

    if not org_settings.advanced_mode:
        raise HTTPException(status_code=404, detail="advanced_mode_disabled")

    org_settings.price_list_mode = data.price_list_mode
    db.add(org_settings)
    db.commit()

    return Success(status="advanced_mode_updated")


@router.get("/products/pdf", description="Get HTML content of all products")
def download_product_lists(
    request: Request,
    db: Session = Depends(db_main),
    db_org: Session = Depends(db_org),
):
    mode = (
        db.query(OrgSetting.price_list_mode)
        .filter(OrgSetting.org_id == request.state.user.org_id)
        .scalar()
    )
    order_by = ProductOrderBy.get(
        request.cookies.get("pricelist_order"),
        mode=mode,
    )

    string = get_language_dict("printouts_strings", "english", True).get("pricelist")
    product_list = db_org.query(Product).order_by(order_by).all()

    if not product_list:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="no_product_to_print"
        )

    context = {
        "request": request,
        "items": product_list,
        "string": string,
        "mode": mode,
    }

    pricelist_template = templates.get_template("price_list.html")
    html = pricelist_template.render(context)

    return HTMLResponse(html)


@router.get("/products/{product_id}/edit/start", description="Start editing a product")
def start_product_edit(
    request: Request, product_id: int, db_org: Session = Depends(db_org)
):
    user_id = request.state.user.id
    unique_id = raise_if_edit_conflict(db_org, product_id, user_id)

    value = {"user_id": request.state.user.id, "name": request.state.user.name}
    db_redis_document.setex(unique_id, 300, json.dumps(value))

    return Success()


@router.patch(
    "/products/{product_id}", description="Update a product", response_model=Success
)
def update_product(
    request: Request,
    data: Product,
    product_id: int,
    db_org: Session = Depends(db_org),
):
    # Checking if product is being edited by another user
    user_id = request.state.user.id
    unique_id = raise_if_edit_conflict(db_org, product_id, user_id)

    product = db_org.get(Product, product_id)

    if not product:
        raise HTTPException(status_code=404, detail="product_not_found")

    # Set ID and unique_id to None if it is set
    delattr(data, "id")
    delattr(data, "unique_id")

    for key, value in data.dict(exclude_unset=True).items():
        setattr(product, key, value)

    db_org.add(product)
    db_org.commit()

    db_redis_document.delete(unique_id)

    return Success(status="product_updated")


@router.get(
    "/products/{product_id}/edit/cancel", description="Cancel editing a product"
)
def cancel_product_edit(product_id: int, db_org: Session = Depends(db_org)):
    unique_id = get_product_unique_id(db_org, product_id)

    db_redis_document.delete(unique_id)

    return Success(status="product_edit_cancelled")


@router.delete(
    "/products/{product_id}", description="Delete a product", response_model=Success
)
def delete_product(
    request: Request,
    product_id: int,
    db_org: Session = Depends(db_org),
):
    # If product is being edited by another user
    user_id = request.state.user.id
    raise_if_edit_conflict(db_org, product_id, user_id)

    product = db_org.get(Product, product_id)

    if product:
        db_org.delete(product)
        db_org.commit()

    return Success(status="product_deleted", message="The product has been deleted.")
