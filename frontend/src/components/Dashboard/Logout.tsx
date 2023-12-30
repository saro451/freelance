import axiosInstance from "@/api/axios/axios";
import { useAuth } from "@/context/AuthProvider";
import { Expire } from "@/icons/Add";
import { Language } from "@/lib/Language";
import { showNotification } from "@/utils/showNotification";
import { Button, Center, Flex, Group, Text, Title } from "@mantine/core";
import { modals } from "@mantine/modals";
import React from "react";

export default function Logout() {
  const language = Language();
  const translatedData = language?.logout;
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      modals.open({
        title: "",
        centered: true,
        radius: "50px",
        children: (
          <div className="px-6">
            <Title fw={400} size={"48px"} c={"#0f7ee9"} className="text-center">
              {translatedData?.logout_heading}
            </Title>
            <Text my={"xl"} ta={"center"}>
              {translatedData?.logout_text}
            </Text>
            <Center pb={"xl"} mt={"lg"}>
              <Group className="mt-10">
                <button
                  className="px-10 py-2 bg-[#0f7ee9] text-white rounded-[40px] hover:bg-[#1469ba] duration-500"
                  onClick={async () => {
                    const response = await axiosInstance.post(`/logout`);
                    showNotification(response);
                    logout();
                    modals.closeAll();
                  }}
                >
                  {translatedData?.logout_confirm_btn}
                </button>
                <button
                  className="px-10 py-2 bg-[#0f7ee9] text-white rounded-[40px] ml-12 hover:bg-[#1469ba] duration-500"
                  onClick={() => {
                    modals.closeAll();
                  }}
                >
                  {translatedData?.logout_cancel_btn}
                </button>
              </Group>
            </Center>
          </div>
        ),
      });
    } catch (error: any) {
      showNotification(error.response);
    }
  };

  return (
    <span
      className={
        "cursor-pointer flex gap-3 hover:bg-[#ede7f6] rounded-lg duration-700 hover:text-[#7754bd] font-[300] mb-7 tracking-wide"
      }
    >
      {/* {collection.emoji} */}
      <Flex gap={"lg"}>
        <div>
          <Expire width={"25"} height={"25"} />
        </div>
        <p className="text-sm mt-[0.7px] text-black" onClick={handleLogout}>
          {/* {translatedData?.logout_confirm_btn} */}
          Logout
        </p>
      </Flex>
    </span>
  );
}
