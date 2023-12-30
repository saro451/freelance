"use client";
import axiosInstance from "@/api/axios/axios";
import { showNotification } from "@/utils/showNotification";
import { Button, Grid, GridCol, Group, Textarea } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";

export default function VersionItems({ value, keys, keg, category }: any) {
  const [opened, { close, open }] = useDisclosure(false);
  const [updatedData, setUpdatedData] = useState(value);
  const [clickedTwice, setClickedTwice] = useState<boolean>(false);
  const handleTextareaChange = (key: any, newValue: any) => {
    setUpdatedData(newValue);
  };

  const handleSave = async () => {
    const string = "version_based_strings";

    try {
      const response = await axiosInstance.patch(
        `/admin/locale/${string}?key=${keys}`,
        { [keg]: updatedData }
      );
      showNotification(response);
      close();
    } catch (error: any) {
      showNotification(error.response);
    }
    console.log(updatedData);
  };
  return (
    <Grid mt={"sm"}>
      <GridCol span={2}> {keg}</GridCol>
      <GridCol span={10}>
        <Textarea
          className={`border border-solid border-[#ccc] rounded-lg  ${
            clickedTwice == true ? "input-edit-form-admin" : ""
          }`}
          rows={1}
          value={updatedData}
          onClick={open}
          onDoubleClick={() => setClickedTwice(true)}
          onChange={(e) => handleTextareaChange(keg, e.target.value)}
        />
      </GridCol>
      <GridCol span={2}>
        <></>
      </GridCol>
      <GridCol span={10}>
        {opened && (
          <Group wrap="nowrap">
            <Button
              radius={"xl"}
              bg={"#fff"}
              style={{
                border: "1px solid #0082ff",
                color: "#0082ff",
              }}
              onClick={() => {
                setUpdatedData(value);
                setClickedTwice(false);
                close();
              }}
            >
              Cancel
            </Button>
            <Button
              radius={"xl"}
              style={{
                background: "#0082ff",
                color: "white",
                border: "1px solid #0082ff",
              }}
              onClick={handleSave}
            >
              Save
            </Button>
          </Group>
        )}
      </GridCol>
    </Grid>
  );
}
