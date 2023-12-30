"use client";
import {
  AdvancedMode,
  ComponentLoader,
  DashNav,
  Loader,
  MenuBar,
  NewProduct,
  PricelistItem,
  SearchItems,
  Sorting,
} from "@/components";
import { FormEvent, useEffect, useRef, useState } from "react";
import "./index.css";
import { Language } from "@/lib/Language";
import axiosInstance from "@/api/axios/axios";
import axios, { AxiosResponse } from "axios";
import { useAuth } from "@/context/AuthProvider";
import { IconPrinter } from "@tabler/icons-react";
import { Anchor, Center } from "@mantine/core";
import { useRouter } from "next/navigation";
import { showNotification } from "@/utils/showNotification";

interface SearchItems {
  searchTerm: string;
  searchKey: string;
  searchType: string;
}

interface formData {
  article_number: string | null;
  name: string | null;
  price: string | null;
  in_price: string | null;
  description: string | null;
  in_stock: string | null;
  unit: string | null;
}

export default function Page() {
  const translatedData = Language();
  const [items, setItems] = useState<any>([]);
  const { user, isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [index, setIndex] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const router = useRouter();
  const scrollableDivRef = useRef<HTMLDivElement | null>(null);
  const [productData, setProductData] = useState<formData>({
    article_number: null,
    name: null,
    price: null,
    in_price: null,
    description: null,
    in_stock: null,
    unit: null,
  });

  const [searchItem, setSearchItems] = useState<SearchItems>({
    searchTerm: "",
    searchKey: "",
    searchType: "",
  });
  const [searchActive, setSearchActive] = useState<boolean>(false);
  const [searchOffset, setSearchOffset] = useState<any>(1);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    } else {
      return;
    }
  }, [isAuthenticated, router]);

  const reloadAPI = async () => {
    if (!searchActive) {
      try {
        const response = await axiosInstance.get(`/products?offset=0`);
        setItems(response.data);
        setIsSearching(false);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    }
    if (searchActive) {
      try {
        const response = await axiosInstance.get(
          `/products?${searchItem?.searchTerm}=${
            searchItem?.searchKey
          }&search_type=${searchItem?.searchType}&offset=${"0"}`
        );
        setItems(response.data);
        setIsSearching(false);
        setIsLoading(false);
      } catch (error: any) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    reloadAPI();
  }, []);

  const fetchMoreData = () => {
    if (!searchActive) {
      axiosInstance
        .get(`/products?offset=${index}`)
        .then((res) => {
          setItems((prevItems: any) => [...prevItems, ...res.data]);
          setIndex((prevIndex) => prevIndex + 1);
          res.data.length > 0 ? setHasMore(true) : setHasMore(false);
        })
        .catch((err) => showNotification(err.response));
    }

    if (searchActive) {
      axiosInstance
        .get(
          `/products?${searchItem?.searchTerm}=${searchItem?.searchKey}&search_type=${searchItem?.searchType}&offset=${searchOffset}`
        )
        .then((res) => {
          setItems((prevItems: any) => [...prevItems, ...res.data]);
          setSearchOffset((prevIndex: any) => prevIndex + 1);
          res.data.length > 0 ? setHasMore(true) : setHasMore(false);
        })
        .catch((err) => showNotification(err.response));
    }
  };

  const handleSearch = async (
    searchKey: string,
    searchTerm: string,
    searchType: string
  ) => {
    setSearchItems({
      searchKey: searchKey,
      searchTerm: searchTerm,
      searchType: searchType,
    });
    setIsSearching(true);
    try {
      const response = await axiosInstance.get(
        `/products?${searchTerm}=${searchKey}&search_type=${searchType}&offset=0`
      );
      setItems(response.data);
      setIsSearching(false);
      setSearchActive(true);
    } catch (error: any) {
      showNotification(error.response);
      console.log(error.response.data.error);
      setIsSearching(false);
    }
    setIndex((prevIndex) => prevIndex + 1);
  };

  const handlePrint = async (e: FormEvent) => {
    e.preventDefault();
    const pdfUrl =
      "https://online.123fakturere.no/api/v1/products/pdf?output=pdf";
    window.open(pdfUrl, "_blank");

    // router.push(
    //   `https://online.123fakturere.no/api/v1/products/pdf?output=pdf`
    // );
  };

  return (
    <section>
      <DashNav />
      <section
        className="w-12/12 m-auto flex gap-5"
        style={{
          height: "90vh",
          overflow: "hidden",
        }}
      >
        <div className="menu-side-bar">
          <MenuBar />
        </div>
        {isLoading ? (
          <Loader />
        ) : (
          <>
            {items.length === 0 ? (
              <Center w={400} h={100} className="m-auto min-h-screen">
                <section className=" text-[#1A1A1A] -mt-20 text-center ">
                  <Center>
                    <img src="/pricelist/add.svg" alt="add items" />
                  </Center>
                  <p className="my-6">
                    {translatedData?.price_list?.no_products}
                  </p>
                  <div className="w-[inherit] mt-2">
                    <NewProduct
                      translatedData={translatedData}
                      setItems={setItems}
                      text={translatedData?.price_list?.add_product_now}
                      py={"4"}
                      height={""}
                      px={"8"}
                      reloadAPI={reloadAPI}
                      setIsSearching={setIsSearching}
                    />
                  </div>
                </section>
              </Center>
            ) : (
              <section className="mt-10 main-price-list-container">
                <div className="prod-content">
                  <SearchItems
                    translatedData={translatedData}
                    user={user}
                    onSearch={handleSearch}
                    reloadAPI={reloadAPI}
                    setSearchActive={setSearchActive}
                    searchActive={searchActive}
                    setIsSearching={setIsSearching}
                  />
                  <div className="psd-2 flex gap-12 place-content-between">
                    <NewProduct
                      translatedData={translatedData}
                      setItems={setItems}
                      text={translatedData?.price_list?.new_product}
                      py={"2"}
                      height={"h-10"}
                      user={user}
                      px={"6"}
                      reloadAPI={reloadAPI}
                      setIsSearching={setIsSearching}
                    />

                    <div
                      className="flex gap-2 px-4 py-2 rounded-xl shadow-md text-[#808080] h-10 cursor-pointer btn-text-price"
                      onClick={handlePrint}
                    >
                      <button className="text-[#1A1A1A] mb-text">
                        {translatedData?.price_list?.print_list}
                      </button>

                      <IconPrinter
                        style={{
                          width: "1.5rem",
                          height: "1.5rem",
                          fontWeight: "900",
                          borderRadius: "50%",
                          color: "#66d6f2",
                          marginTop: "0px",
                        }}
                      />
                    </div>
                    {user?.advanced_mode === true ? (
                      <AdvancedMode
                        user={user}
                        translatedData={translatedData}
                      />
                    ) : (
                      <></>
                    )}
                  </div>
                </div>

                <section className="mt-8">
                  <div
                    className={`${
                      user?.price_list_mode == "ordinary"
                        ? "grid-9-ord"
                        : "grid-9"
                    }  w-[95%] text-[#1A1A1A] gap-5 pb-2`}
                  >
                    {user?.advanced_mode === true &&
                    user?.price_list_mode === "full" ? (
                      <div className="px-2 col-span-1 show-mb-dis">
                        <div className="flex place-content-between">
                          <p>{translatedData?.price_list?.article_number}</p>

                          {user?.advanced_mode === true &&
                          user?.price_list_mode === "full" ? (
                            <Sorting
                              sort="article_number"
                              reloadAPI={reloadAPI}
                              setIsSearching={setIsSearching}
                            />
                          ) : (
                            <></>
                          )}
                        </div>
                      </div>
                    ) : (
                      <></>
                    )}
                    <div
                      className={`${
                        !user?.advanced_mode ||
                        user?.advanced_mode === false ||
                        user?.price_list_mode === "ordinary"
                          ? "col-span-2 lg:col-span-3 md:col-span-3 xl:col-span-3 px-2"
                          : "col-span-2 px-1"
                      } `}
                    >
                      <div className="flex gap-5 ml-2">
                        <p>{translatedData?.price_list?.product_or_service}</p>
                        {user?.advanced_mode === true &&
                        user?.price_list_mode === "full" ? (
                          <Sorting
                            sort="name"
                            reloadAPI={reloadAPI}
                            setIsSearching={setIsSearching}
                          />
                        ) : (
                          <></>
                        )}
                      </div>
                    </div>
                    <div className="col-span-1 pl-6 show-mb-dis">
                      {translatedData?.price_list?.in_price}
                    </div>
                    <div className="col-span-1 ml-8">
                      {translatedData?.price_list?.price}
                    </div>
                    <div className="col-span-1 ml-8 show-mb-dis">
                      {translatedData?.price_list?.in_stock}
                    </div>
                    {(user?.advanced_mode === true &&
                      user?.price_list_mode === "unit") ||
                    (user?.advanced_mode === true &&
                      user?.price_list_mode === "full") ? (
                      <div className="px-2 ml-8 show-mb-dis">
                        {translatedData?.price_list?.unit}
                      </div>
                    ) : (
                      <></>
                    )}
                    <div
                      className={`${
                        !user?.advanced_mode ||
                        user?.advanced_mode === false ||
                        user?.price_list_mode === "ordinary"
                          ? "col-span-2 lg:col-span-3 md:col-span-3 xl:col-span-3 px-2"
                          : "col-span-2 px-1"
                      } px-2 ml-8 show-mb-dis`}
                    >
                      {translatedData?.price_list?.description}
                    </div>
                  </div>
                  {isSearching ? (
                    <ComponentLoader />
                  ) : (
                    <div
                      id="scrollableDiv"
                      ref={scrollableDivRef}
                      className={`scrollbarWidth ${
                        user?.advanced_mode === false ||
                        user?.price_list_mode === "ordinary"
                          ? "h-[93.5vh]"
                          : "h-[90vh]"
                      }`}
                    >
                      <PricelistItem
                        user={user}
                        fetchMoreData={fetchMoreData}
                        hasMore={hasMore}
                        items={items}
                        translatedData={translatedData}
                        setItems={setItems}
                        reloadAPI={reloadAPI}
                        setIsSearching={setIsSearching}
                        setProductData={setProductData}
                        productData={productData}
                      />
                    </div>
                  )}
                </section>
              </section>
            )}
          </>
        )}
      </section>
    </section>
  );
}
