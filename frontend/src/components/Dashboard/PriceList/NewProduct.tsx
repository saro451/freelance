import { useDisclosure } from "@mantine/hooks";
import { Center, Modal, Text, TextInput } from "@mantine/core";
import { useState, FormEvent, useEffect } from "react";
import axiosInstance from "@/api/axios/axios";
import { useRouter } from "next/navigation";
import { IconCirclePlus } from "@tabler/icons-react";
import { showNotification } from "@/utils/showNotification";
import classes from "./newproduct.module.css";
import { Add, GreenAdd } from "@/icons/Add";

interface FormData {
  article_number: string | null;
  name: string | null;
  price: string | null;
  in_price: string | null;
  description: string | null;
  in_stock: string | null;
  unit: string | null;
}

export default function NewProduct({
  translatedData,
  setItems,
  text,
  py,
  height,
  user,
  px,
  reloadAPI,
  setIsSearching,
}: any) {
  const [opened, { close, open }] = useDisclosure(false);
  const [productData, setProductData] = useState<FormData>({
    article_number: null,
    name: null,
    price: null,
    in_price: null,
    description: null,
    in_stock: null,
    unit: null,
  });
  const [error, setError] = useState<Record<string, string>>({});
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProductData((prev) => ({ ...prev, [name]: value }));
    setError((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post("/products", productData);
      if (response.status === 200) {
        console.log("Success");
        setIsSearching(true);
        close();
        showNotification(response);
        setProductData({
          article_number: null,
          name: null,
          price: null,
          in_price: null,
          description: null,
          in_stock: null,
          unit: null,
        });
        reloadAPI();
        setIsSearching(false);
      }
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.detail) {
        setError({ ...error.response.data.detail });
        setIsSearching(false);
        showNotification(error.response);
      } else {
        setError({});
        setIsSearching(false);
      }
    }
  };

  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        radius={"xl"}
        size={"lg"}
        centered
        className="demoModalWork"
        styles={{
          header: {
            backgroundColor: "white",
          },
          body: { backgroundColor: "white" },
          close: {
            color: "#47baef",
            background: "none",
          },
        }}
      >
        <Center>
          <Text fw={700} size={"32px"} c={"red"}>
            {translatedData?.price_list?.new_product}
          </Text>
        </Center>
        <form className="px-8" onSubmit={handleSubmit} noValidate>
          {user?.advanced_mode === true && user?.price_list_mode === "full" ? (
            <>
              <TextInput
                label={translatedData?.price_list?.article_number}
                pt={30}
                name="article_number"
                placeholder={
                  translatedData?.price_list?.article_number_placeholder
                }
                radius={"xl"}
                onChange={handleChange}
                value={productData.article_number ?? ""}
                styles={{
                  input: {
                    background: "none",
                    border: "1px solid #ccc",
                    color: "black",
                  },
                  label: {
                    color: "#000",
                  },
                }}
              />
              {error.article_number && (
                <span className="text-red-500 text-sm px-2 mt-1">
                  {error.article_number}
                </span>
              )}
            </>
          ) : (
            <></>
          )}
          <TextInput
            label={translatedData?.price_list?.product_or_service}
            name="name"
            placeholder={
              translatedData?.price_list?.product_service_placeholder
            }
            radius={"xl"}
            mt={"md"}
            onChange={handleChange}
            value={productData.name ?? ""}
            styles={{
              input: {
                background: "none",
                border: "1px solid #ccc",
                color: "black",
              },
              label: {
                color: "#000",
              },
            }}
          />
          {error.name && (
            <span className="text-red-500 text-sm px-2 mt-1">{error.name}</span>
          )}

          <TextInput
            label={translatedData?.price_list?.in_price}
            type="number"
            name="in_price"
            placeholder={translatedData?.price_list?.in_price_placeholder}
            radius={"xl"}
            mt={"md"}
            onChange={handleChange}
            value={productData.in_price ?? ""}
            styles={{
              input: {
                background: "none",
                border: "1px solid #ccc",
                color: "black",
              },
              label: {
                color: "#000",
              },
            }}
          />
          {error.in_price && (
            <span className="text-red-500 text-sm px-2 mt-1">
              {error.in_price}
            </span>
          )}

          <TextInput
            label={translatedData?.price_list?.price}
            type="number"
            name="price"
            placeholder={translatedData?.price_list?.price_placeholder}
            radius={"xl"}
            mt={"md"}
            onChange={handleChange}
            value={productData.price ?? ""}
            styles={{
              input: {
                background: "none",
                border: "1px solid #ccc",
                color: "black",
              },
              label: {
                color: "#000",
              },
            }}
          />
          {error.price && (
            <span className="text-red-500 text-sm px-2 mt-1">
              {error.price}
            </span>
          )}

          <TextInput
            label={translatedData?.price_list?.in_stock}
            type="number"
            name="in_stock"
            placeholder={translatedData?.price_list?.in_stock_placeholder}
            radius={"xl"}
            mt={"md"}
            onChange={handleChange}
            value={productData.in_stock ?? ""}
            styles={{
              input: {
                background: "none",
                border: "1px solid #ccc",
                color: "black",
              },
              label: {
                color: "#000",
              },
            }}
          />
          {error.in_stock && (
            <span className="text-red-500 text-sm px-2 mt-1">
              {error.in_stock}
            </span>
          )}

          {(user?.advanced_mode === true && user?.price_list_mode === "unit") ||
          (user?.advanced_mode === true && user?.price_list_mode === "full") ? (
            <>
              <TextInput
                label={translatedData?.price_list?.unit}
                name="unit"
                placeholder={translatedData?.price_list?.unit_placeholder}
                radius={"xl"}
                mt={"md"}
                onChange={handleChange}
                value={productData.unit ?? ""}
                styles={{
                  input: {
                    background: "none",
                    border: "1px solid #ccc",
                    color: "black",
                  },
                  label: {
                    color: "#000",
                  },
                }}
              />
              {error.unit && (
                <span className="text-red-500 text-sm px-2 mt-1">
                  {error.unit}
                </span>
              )}
            </>
          ) : (
            <></>
          )}

          <TextInput
            label={translatedData?.price_list?.description}
            name="description"
            placeholder={translatedData?.price_list?.description_placeholder}
            radius={"xl"}
            mt={"md"}
            onChange={handleChange}
            value={productData.description ?? ""}
            styles={{
              input: {
                background: "none",
                border: "1px solid #ccc",
                color: "black",
              },
              label: {
                color: "#000",
              },
            }}
          />
          {error.description && (
            <span className="text-red-500 text-sm px-2 mt-1">
              {error.description}
            </span>
          )}

          <Center className="mt-8">
            <button className="px-8 py-2 bg-[#0f7ee9] text-white rounded-[40px] hover:bg-[#1469ba] duration-500">
              {translatedData?.price_list?.save}
            </button>
          </Center>
        </form>
        <Center mt={"xl"}>
          <button className="pb-6 text-[#0f7ee9] font-bold" onClick={close}>
            {translatedData?.price_list?.close}
          </button>
        </Center>
      </Modal>
      <div
        onClick={open}
        className={`flex gap-2 place-content-between btn-text-price px-${px} py-${py} rounded-xl shadow-md text-[#808080] ${height} cursor-pointer`}
        style={{ zIndex: 10 }}
      >
        <button className="text-[#1A1A1A] mb-text">{text}</button>
        {/* <IconCirclePlus
          style={{
            width: "1.5rem",
            height: "1.5rem",
            fontWeight: "900",
            background: "#14eb89",
            borderRadius: "50%",
            color: "#fff",
            marginTop: "0px",
          }}
        /> */}

        <GreenAdd />
      </div>
    </>
  );
}
