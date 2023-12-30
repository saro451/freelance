import { Button, Center, Group, Text } from "@mantine/core";
import { IconCircleX } from "@tabler/icons-react";
import classes from "./NavbarNested.module.css";
import axiosInstance from "@/api/axios/axios";
import { showNotification } from "@/utils/showNotification";
import { modals } from "@mantine/modals";

export default function ClearCache() {
  const handleClear = async () => {
    try {
      modals.open({
        title: "Do you want to clear cache?",
        children: (
          <>
            <Text>This action will delete all the cache.</Text>
            <Group wrap="nowrap" mt={"lg"} justify="right">
              <Button
                style={{
                  background: "white",
                  color: "black",
                  border: "1px solid #ccc",
                }}
                onClick={() => {
                  modals.closeAll();
                }}
              >
                Cancel
              </Button>
              <Button
                style={{
                  background: "#228be6",
                  color: "white",
                }}
                onClick={async () => {
                  const response = await axiosInstance.delete(`/admin/cache`);
                  showNotification(response);
                  modals.closeAll();
                }}
              >
                Yes
              </Button>
            </Group>
          </>
        ),
      });
    } catch (error: any) {
      showNotification(error.response);
    }
  };
  return (
    <Button
      className={classes.footertext}
      onClick={handleClear}
      size="sm"
      style={{
        fontSize: "0.95rem",
        background: "none",
      }}
      mx={"lg"}
      mb={"sm"}
      leftSection={
        <IconCircleX
          size={"1.35rem"}
          style={{
            marginTop: ".5px",
          }}
        />
      }
    >
      Clear Cache
    </Button>
  );
}
