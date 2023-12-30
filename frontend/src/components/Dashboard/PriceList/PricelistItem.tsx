import ComponentLoader from "@/components/Loader/ComponentLoader";
import InfiniteScroll from "react-infinite-scroll-component";
import ItemMenu from "./ItemMenu";
import MobileItemMenu from "./MobileItemMenu";
import { Text } from "@mantine/core";

export default function PricelistItem({
  user,
  fetchMoreData,
  hasMore,
  items,
  translatedData,
  setItems,
  setIsSearching,
  reloadAPI,
  setProductData,
  productData,
}: any) {
  return (
    <InfiniteScroll
      dataLength={items.length}
      next={fetchMoreData}
      hasMore={hasMore}
      loader={<ComponentLoader />}
      scrollThreshold={0.5}
      refreshFunction={fetchMoreData}
      scrollableTarget="scrollableDiv"
      endMessage={
        <p style={{ textAlign: "center", marginTop: "8px" }}>
          {hasMore ? "Loading..." : ""}
        </p>
      }
    >
      {items.map((el: any) => (
        <section className="flex gap-2 " key={el.id}>
          <div
            className={`${
              user?.price_list_mode == "ordinary" ? "grid-9-ord" : "grid-9"
            } gap-2 mt-2 w-[100%] text-[#1A1A1A] text-sm`}
          >
            {user?.advanced_mode === true &&
            user?.price_list_mode === "full" ? (
              <div className="col-span-1 border border-solid border-[#adcce9] rounded-[20px] py-[6px] px-2 show-mb-dis ">
                <Text className="call-pricelist-height">
                  {el.article_number}
                </Text>
              </div>
            ) : (
              <> </>
            )}
            <div
              className={`${
                !user?.advanced_mode ||
                user?.advanced_mode === false ||
                user?.price_list_mode === "ordinary"
                  ? "col-span-2 lg:col-span-3 md:col-span-3 xl:col-span-3"
                  : "col-span-2"
              } py-[6px] border border-solid border-[#adcce9] rounded-[20px] px-2 `}
            >
              <Text className="call-pricelist-height">{el.name}</Text>
            </div>
            <div className="col-span-1 border border-solid border-[#adcce9] rounded-[20px] px-2 py-[6px] show-mb-dis ">
              <Text className="call-pricelist-height">{el.in_price}</Text>
            </div>
            <div
              style={{ maxHeight: "50px", overflowY: "auto" }}
              className="col-span-1 border border-solid border-[#adcce9] rounded-[20px] px-2 py-[6px]"
            >
              <Text className="call-pricelist-height">{el.price}</Text>
            </div>
            <div className="col-span-1 border border-solid border-[#adcce9] rounded-[20px] px-2 py-[6px] show-mb-dis">
              <Text className="call-pricelist-height"> {el.in_stock}</Text>
            </div>
            {(user?.advanced_mode === true &&
              user?.price_list_mode === "unit") ||
            (user?.advanced_mode === true &&
              user?.price_list_mode === "full") ? (
              <div className="col-span-1 border border-solid border-[#adcce9] rounded-[20px] px-2 py-[6px] show-mb-dis ">
                <Text className="call-pricelist-height">{el.unit}</Text>
              </div>
            ) : (
              <></>
            )}
            <div
              className={`${
                !user?.advanced_mode ||
                user?.advanced_mode === false ||
                user?.price_list_mode === "ordinary" ||
                user?.price_list_mode === "unit"
                  ? "col-span-3"
                  : "col-span-2"
              } show-mb-dis border border-solid border-[#adcce9] rounded-[20px] px-2  py-[6px] `}
            >
              <Text className="call-pricelist-height">{el.description}</Text>
            </div>
          </div>
          <div className="mt-4 item-menu-pc">
            <ItemMenu
              translatedData={translatedData}
              el={el}
              setItems={setItems}
              items={items}
              user={user}
              reloadAPI={reloadAPI}
              setIsSearching={setIsSearching}
              setProductData={setProductData}
              productData={productData}
            />
          </div>
          <div className="mt-4 mobile-item-menu">
            <MobileItemMenu
              translatedData={translatedData}
              el={el}
              setItems={setItems}
              items={items}
              user={user}
              reloadAPI={reloadAPI}
              setIsSearching={setIsSearching}
            />
          </div>
        </section>
      ))}
    </InfiniteScroll>
  );
}
