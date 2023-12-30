import { useState, useEffect, FormEvent } from "react";
import { useDisclosure } from "@mantine/hooks";
import axiosInstance from "@/api/axios/axios";
import {
  Button,
  Center,
  Group,
  Modal,
  SimpleGrid,
  Text,
  TextInput,
} from "@mantine/core";
import { IconToggleLeft, IconToggleRight } from "@tabler/icons-react";
import { showNotification } from "@/utils/showNotification";
import { useRouter } from "next/navigation";

export default function AdvancedMode({ user, translatedData }: any) {
  const [opened, { close, open }] = useDisclosure(false);
  const [selectedMode, setSelectedMode] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    if (user?.price_list_mode) {
      setSelectedMode(user?.price_list_mode);
    }
  }, [user?.price_list_mode]);

  const updateBackendMode = async (mode: any) => {
    const data = {
      type: mode,
    };

    try {
      const res = await axiosInstance.patch(`/products/mode`, data);
      console.log("Success");
      // showNotification(res)
      window.location.reload();
    } catch (error: any) {
      showNotification(error.response);
    }
  };

  const handleModeChange = (mode: any) => {
    setSelectedMode(mode);
    console.log(mode);
    updateBackendMode(mode);
  };

  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        radius={"xl"}
        size="xl"
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
        <Center>
          <Text
            fw={600}
            mb={"xl"}
            size={"42px"}
            c={"#1381e9"}
            className="text-center"
          >
            {translatedData?.price_list?.advanced_mode}
          </Text>
        </Center>

        <Center>
          <Text className="text-center" c={"#000"}>
            {translatedData?.price_list?.advanced_mode_text_1}
          </Text>
        </Center>
        <Center>
          <Text className="text-center my-5" c={"#000"}>
            {translatedData?.price_list?.advanced_mode_text_2}
          </Text>
        </Center>
        <Center>
          <Text className="text-center" c={"#000"}>
            {translatedData?.price_list?.advanced_mode_text_3}
          </Text>
        </Center>
        <Center>
          <Text className="text-center mt-5" c={"#000"}>
            {translatedData?.price_list?.advanced_mode_text_4}
          </Text>
        </Center>

        <div className="px-8">
          <Center>
            <Group className="mt-8 pb-5 ssd-gsd">
              <Button
                className=" bg-[#0f7ee9] text-white rounded-[40px]"
                radius={50}
                onClick={() => handleModeChange("ordinary")}
              >
                {translatedData?.price_list?.ordinary_mode}
              </Button>
              <Button
                className="px-6 py-2 bg-[#0f7ee9] text-white rounded-[40px] mx-6"
                radius={50}
                onClick={() => handleModeChange("unit")}
              >
                {translatedData?.price_list?.advanced_mode_unit}
              </Button>
              <Button
                className="px-8 py-2 bg-[#0f7ee9] text-white rounded-[40px]"
                radius={50}
                onClick={() => handleModeChange("full")}
              >
                {translatedData?.price_list?.advanced_mode_full}
              </Button>
            </Group>
          </Center>
        </div>

        <div className="px-8 ssd-gsd-2 pb-8 w-[100%]">
          <Center mt={"lg"}>
            <Button
              w={"100%"}
              className=" bg-[#0f7ee9] text-white rounded-[40px]"
              radius={50}
              onClick={() => handleModeChange("ordinary")}
            >
              {translatedData?.price_list?.ordinary_mode}
            </Button>
          </Center>
          <Center my={"sm"}>
            <Button
              w={"100%"}
              className="py-2 bg-[#0f7ee9] text-white rounded-[40px]"
              radius={50}
              onClick={() => handleModeChange("unit")}
            >
              {translatedData?.price_list?.advanced_mode_unit}
            </Button>
          </Center>
          <Center>
            <Button
              w={"100%"}
              className="px-8 py-2 bg-[#0f7ee9] text-white rounded-[40px]"
              radius={50}
              onClick={() => handleModeChange("full")}
            >
              {translatedData?.price_list?.advanced_mode_full}
            </Button>
          </Center>
        </div>
      </Modal>
      <div
        onClick={open}
        className="flex gap-2 px-4 py-2 rounded-xl shadow-md text-[#808080] h-10 cursor-pointer btn-text-price"
      >
        <button className="text-[#1A1A1A] mb-text">
          {translatedData?.price_list?.advanced_mode}
        </button>
        {(user?.advanced_mode === true && user?.price_list_mode === "unit") ||
        (user?.advanced_mode === true && user?.price_list_mode === "full") ? (
          <IconToggleRight
            color="#35d4ff"
            size={30}
            style={{ marginTop: "-3px" }}
          />
        ) : (
          <IconToggleLeft
            color="#35d4ff"
            size={30}
            style={{ marginTop: "-3px" }}
          />
        )}
      </div>
    </>
  );
}
