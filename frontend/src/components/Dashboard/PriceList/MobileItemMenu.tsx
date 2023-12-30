import { useState, useEffect, FormEvent, useMemo } from "react";
import {
  Center,
  Menu,
  Modal,
  UnstyledButton,
  Text,
  TextInput,
  Group,
  MenuDivider,
} from "@mantine/core";
import { BsThreeDots } from "react-icons/bs";
import axiosInstance from "@/api/axios/axios";
import { useDisclosure } from "@mantine/hooks";
import axios, { AxiosResponse, CancelTokenSource } from "axios";
import { IconX, IconBrush, IconTrash } from "@tabler/icons-react";
import { showNotification } from "@/utils/showNotification";

interface formData {
  article_number: string | null;
  name: string | null;
  price: string | null;
  in_price: string | null;
  description: string | null;
  in_stock: string | null;
  unit: string | null;
}

export default function MobileItemMenu({
  translatedData,
  el,
  setItems,
  items,
  user,
  reloadAPI,
  setIsSearching,
}: any) {
  const [opened, { close, open }] = useDisclosure(false);
  const [productData, setProductData] = useState<formData>({
    article_number: null,
    name: null,
    price: null,
    in_price: null,
    description: null,
    in_stock: null,
    unit: null,
  });
  const [error, setError] = useState<Record<string, string>>({});
  const [product_state_id, setProduct_State_Id] = useState<any>();
  const [deleteConfirmationVisible, setDeleteConfirmationVisible] =
    useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProductData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDeleteConfirmation = () => {
    setDeleteConfirmationVisible(true);
  };

  const handleDelete = async (productId: any) => {
    setIsSearching(true);
    if (deleteConfirmationVisible) {
      try {
        const response = await axiosInstance.delete(`/products/${productId}`);
        setItems((prevItems: any) =>
          prevItems.filter((item: any) => item.id !== productId)
        );
        close();
        showNotification(response);
        setDeleteConfirmationVisible(false);
        reloadAPI();
      } catch (error: any) {
        showNotification(error.response);
        setDeleteConfirmationVisible(false);
        setIsSearching(false);
        close();
      }
    }
  };

  const endEdit = async () => {
    try {
      const response = await axiosInstance.get<any>(
        `/products/${product_state_id}/edit/cancel`
      );
      console.log("Canceled edit");
      if (response.status === 200) {
        close();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = (product_id: any) => {
    if (translatedData) {
      const currentItem = items.find((item: any) => item.id === el.id);
      const newProductData = {
        article_number: currentItem.article_number || null,
        name: currentItem.name || null,
        price: currentItem.price || null,
        in_price: currentItem.in_price || null,
        description: currentItem.description || null,
        in_stock: currentItem.in_stock || null,
        unit: currentItem.unit || null,
      };
      // setProductData({
      //   article_number: currentItem.article_number || null,
      //   name: currentItem.name || null,
      //   price: currentItem.price || null,
      //   in_price: currentItem.in_price || null,
      //   description: currentItem.description || null,
      //   in_stock: currentItem.in_stock || null,
      //   unit: currentItem.unit || null,
      // });
      setProductData(newProductData);
      setProduct_State_Id(product_id);
      const cancelTokenSource: CancelTokenSource = axios.CancelToken.source();

      const startEdit = async () => {
        try {
          const response: AxiosResponse<any> = await axiosInstance.get<any>(
            `/products/${product_id}/edit/start`,
            { cancelToken: cancelTokenSource.token }
          );
          console.log(response.status);
          if (response.status === 200) {
            open();
          } else {
            showNotification(response);
          }
        } catch (error: any) {
          showNotification(error.response);
        }
      };

      startEdit();

      return () => {
        cancelTokenSource.cancel("Request canceled by component unmount");
      };
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    try {
      const response = await axiosInstance.patch(
        `/products/${product_state_id}`,
        productData
      );
      console.log("Success");
      if (response.status == 200) {
        close();
        showNotification(response);
        // reloadAPI();
        window.location.reload();
      }
    } catch (error: any) {
      showNotification(error.response);
    }
  };

  const menuItems = useMemo(() => {
    return (
      <Menu shadow="lg" position="bottom" offset={4}>
        <Menu.Target>
          <UnstyledButton>
            <BsThreeDots size={22} className="text-[#0f7ee8] cursor-pointer" />
          </UnstyledButton>
        </Menu.Target>

        <Menu.Dropdown
          style={{
            background: "#fff",
            border: "1px solid #ccc",
          }}
          w={"100%"}
        >
          <Menu.Item closeMenuOnClick={false}>
            <div>
              <label>Product/Service</label>
            </div>
            <Text
              w={"100%"}
              h={"auto"}
              px={".65rem"}
              className="border border-solid rounded-xl "
            >
              {el.name}
            </Text>
          </Menu.Item>
          <Menu.Item closeMenuOnClick={false}>
            <div>
              <label>In Price</label>
            </div>
            <Text
              w={"100%"}
              h={"30px"}
              px={".65rem"}
              className="border border-solid rounded-xl "
            >
              {el.in_price}
            </Text>
          </Menu.Item>
          <Menu.Item closeMenuOnClick={false}>
            <div>
              <label>Price</label>
            </div>
            <Text
              w={"100%"}
              h={"30px"}
              px={".65rem"}
              className="border border-solid rounded-xl "
            >
              {el.price}
            </Text>
          </Menu.Item>
          <Menu.Item closeMenuOnClick={false}>
            <div>
              <label>In Stock</label>
            </div>
            <Text
              w={"100%"}
              h={"30px"}
              px={".65rem"}
              className="border border-solid rounded-xl "
            >
              {el.in_stock}
            </Text>
          </Menu.Item>
          <Menu.Item closeMenuOnClick={false}>
            <div>
              <label>Description</label>
            </div>
            <Text
              w={"100%"}
              h={"auto"}
              px={".65rem"}
              className="border border-solid rounded-xl "
            >
              {el.description}
            </Text>
          </Menu.Item>
          <Menu.Item
            className="hover:bg-[#eaeaea]"
            leftSection={
              <IconTrash
                style={{
                  width: "1.5rem",
                  height: "1.5rem",
                  fontWeight: "900",
                  color: "red",
                  marginTop: "1px",
                }}
              />
            }
            color="#333333"
            onClick={() => setDeleteConfirmationVisible(true)}
          >
            {translatedData?.price_list?.delete_product}
          </Menu.Item>
          <Menu.Item
            className="hover:bg-[#eaeaea]"
            leftSection={
              <IconBrush
                style={{
                  width: "1.5rem",
                  height: "1.5rem",
                  fontWeight: "900",
                  color: "#44bfff",
                  marginTop: "1px",
                }}
              />
            }
            color="#333333"
            onClick={() => handleEdit(el.id)}
          >
            {translatedData?.price_list?.edit_product}
          </Menu.Item>
          <Menu.Item
            className="hover:bg-[#eaeaea]"
            leftSection={
              <IconX
                style={{
                  width: "1.5rem",
                  height: "1.5rem",
                  fontWeight: "900",
                  color: "#000",
                }}
              />
            }
            color="#333333"
          >
            {translatedData?.price_list?.close}
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    );
  }, [el.id, translatedData]);

  return (
    <>
      <Modal
        opened={opened}
        onClose={endEdit}
        radius={"xl"}
        size={"lg"}
        overlayProps={{
          blur: 3,
        }}
        centered
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
        <Center mb={12}>
          <Text fw={700} size={"32px"} c={"red"}>
            {translatedData?.price_list?.edit_product}
          </Text>
        </Center>
        <form className="px-8" onSubmit={handleSubmit} noValidate>
          {user?.advanced_mode === true && user?.price_list_mode === "full" ? (
            <>
              <TextInput
                label={translatedData?.price_list?.article_number}
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
          <button className="pb-6 text-[#0f7ee9] font-bold" onClick={endEdit}>
            {translatedData?.price_list?.close}
          </button>
        </Center>
      </Modal>

      <Modal
        opened={deleteConfirmationVisible}
        onClose={() => setDeleteConfirmationVisible(false)}
        radius="xl"
        centered
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
          <Text fw={400} size={"48px"} c={"#0f7ee9"} className="text-center">
            {translatedData?.price_list?.are_you_sure}
          </Text>
        </Center>

        <Center mt={"xl"}>
          <Text className="text-center" c={"#000"}>
            {translatedData?.price_list?.delete_confirmation}
          </Text>
        </Center>

        <Center pb={"lg"}>
          <Group className="mt-10">
            <button
              className="px-10 py-2 bg-[#0f7ee9] text-white rounded-[40px] hover:bg-[#1469ba] duration-500"
              onClick={() => handleDelete(el.id)}
            >
              {translatedData?.price_list?.yes}
            </button>
            <button
              className="px-10 py-2 bg-[#0f7ee9] text-white rounded-[40px] ml-12 hover:bg-[#1469ba] duration-500"
              onClick={() => setDeleteConfirmationVisible(false)}
            >
              {translatedData?.price_list?.no}
            </button>
          </Group>
        </Center>
      </Modal>
      {menuItems}
    </>
  );
}
