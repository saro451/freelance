"use client";
import axiosInstance from "@/api/axios/axios";
import { showNotification } from "@/utils/showNotification";
import {
  Autocomplete,
  Button,
  Flex,
  Grid,
  GridCol,
  Group,
  Menu,
  TextInput,
  Checkbox,
  FileButton,
  FileInput,
  Text,
} from "@mantine/core";
import {
  IconChevronDown,
  IconDownload,
  IconSearch,
  IconUpload,
} from "@tabler/icons-react";
import { modals } from "@mantine/modals";
import { useState, FormEvent, useEffect } from "react";
import FilterCategory from "./FilterCategory";

export default function AdminSearch({
  setIsSearching,
  localeType,
  categoryStatus,
  language,
  setCategoryQuery,
  fetchLanguageData,
  categoryQuery,
  handleCategoryChange,
}: any) {
  const [file, setFile] = useState<File | null>();
  const [confirm, setConfirm] = useState<boolean>(false);

  const handleDownload = async () => {
    try {
      const response = await axiosInstance.get(
        `/admin/locale/excel/${localeType}?order_by=${"category"}`
      );
      const excelData = response.data;
      // const blob = new Blob([excelData], {
      //   type: "application/vnd.ms-excel",
      // });

      const blob = new Blob([excelData]);

      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `${localeType}.csv`;

      a.click();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleSubmit = async () => {
    console.log(file);
    if (file) {
      let uploadData = new FormData();
      uploadData.append("file", file);
      try {
        modals.open({
          title: "Please confirm your action",
          children: (
            <>
              <Text size="sm">
                Do you want to update {localeType} with {file?.name}?
              </Text>
              <Group wrap="nowrap" mt={"lg"} justify="right">
                <Button
                  style={{
                    background: "white",
                    color: "black",
                    border: "1px solid #ccc",
                  }}
                  onClick={() => {
                    setConfirm(false);
                    setFile(null);
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
                  onClick={() => {
                    // console.log(file);
                    axiosInstance({
                      method: "PATCH",
                      url: `/admin/locale/excel/${localeType}`,
                      data: uploadData,
                      headers: { "Content-Type": "multipart/form-data" },
                    })
                      .then((response: any) => {
                        modals.closeAll();
                        showNotification(response);
                        setFile(null);
                      })
                      .catch((error: any) => {
                        modals.closeAll();
                        showNotification(error.response);
                        setFile(null);
                      });
                  }}
                >
                  Confirm
                </Button>
              </Group>
            </>
          ),
        });
      } catch (error: any) {
        showNotification(error?.response);
        setConfirm(false);
      }
    }
  };

  useEffect(() => {
    if (file) {
      handleSubmit();
    }
  }, [file]);

  return (
    <section className="bg-[#fff] px-5 rounded-lg py-4">
      <Grid>
        {/* <GridCol span={5}>
          <Group className="gap-5 w-full">
            <TextInput
              leftSection={<IconSearch />}
              label="Search"
              placeholder="Search Dashboard"
              radius={"50px"}
              w={"70%"}
              onChange={(e) => handleQueryChange(e.target.value)}
            />
            <Button
              className="mt-5 bg-[#228be6] hover:bg-[#2771b3] text-white"
              radius={"100px"}
            >
              Search
            </Button>
          </Group>
        </GridCol> */}
        <GridCol span={6} ta={"left"}>
          {!categoryStatus ? (
            <></>
          ) : (
            <FilterCategory
              language={language}
              setCategoryQuery={setCategoryQuery}
              fetchLanguageData={fetchLanguageData}
              categoryQuery={categoryQuery}
              handleCategoryChange={handleCategoryChange}
            />
          )}
        </GridCol>
        <GridCol span={6} ta={"right"}>
          <Group className="gap-5" justify="right">
            <FileButton
              onChange={(files) => setFile(files[0])}
              accept=".csv,.xlsx"
              multiple
            >
              {(props) => (
                <Button
                  radius={"100px"}
                  className="mt-5 bg-[#228be6] hover:bg-[#2771b3] text-white"
                  rightSection={<IconUpload />}
                  {...props}
                >
                  Upload CSV
                </Button>
              )}
            </FileButton>
            {/* <Button
              onClick={handleSubmit}
              radius={"100px"}
              className="mt-5 bg-[#228be6] hover:bg-[#2771b3] text-white"
              rightSection={<IconUpload />}
            >
              Upload CSV
            </Button> */}
            <Button
              className="mt-5 bg-[#228be6] hover:bg-[#2771b3] text-white"
              radius={"100px"}
              rightSection={<IconDownload />}
              onClick={handleDownload}
            >
              Download CSV
            </Button>
          </Group>
        </GridCol>
      </Grid>
    </section>
  );
}
