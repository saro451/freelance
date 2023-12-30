"use client";
import {
  Button,
  Center,
  Divider,
  Drawer,
  Grid,
  GridCol,
  Group,
  ScrollArea,
} from "@mantine/core";
import AdminHeader from "./AdminHeader";
import AdminSearch from "./AdminSearch";
import EditLanguageItem from "./EditLanguageItem";
import ComponentLoader from "../Loader/ComponentLoader";
import { useCallback, useState } from "react";
import VersionData from "./VersionData";
import { useDisclosure } from "@mantine/hooks";

export default function EditLanguage({
  language,
  setLanguage,
  setLocalType,
  localeType,
  languageModels,
  fetchLanguageData,
  fetchLanguageModel,
  isSearching,
  setIsSearching,
  categoryStatus,
  setCategoryQuery,
  categoryQuery,
  handleCategoryChange,
  fetchVersionBasedData,
  setRegexMatches,
  versionData,
  setLoading,
  loading,
}: any) {
  const [openBlue, setBlue] = useState<boolean>(true);
  const [opened, { open, close }] = useDisclosure(false);

  const handleSave = () => {};

  return (
    <div className="px-5">
      <section className="bg-[#fff] px-2 rounded-lg py-4 mt-5">
        <Grid className="font-bold px-3 pb-2">
          <GridCol span={2}>Key</GridCol>
          {!categoryStatus ? <></> : <GridCol span={2}>Category</GridCol>}
          <GridCol span={2}>Version</GridCol>
          <GridCol span={4}>Input String</GridCol>
          {/* <GridCol span={2}>
            <Group wrap="nowrap" justify="right">
              <Button onClick={open}>Open drawer</Button>
            </Group>
          </GridCol> */}
        </Grid>
        <ScrollArea h={"63.4vh"}>
          {isSearching ? (
            <ComponentLoader />
          ) : (
            <>
              {language.map((value: any, index: any) => (
                <div key={index}>
                  <Grid
                    className="border border-solid px-3 rounded-sm mt-5 py-4"
                    style={{
                      boxShadow: "2px 4px 4px #ccc",
                    }}
                  >
                    <GridCol mt={"lg"} span={2}>
                      {value.keys.key}
                    </GridCol>{" "}
                    {!categoryStatus ? (
                      <></>
                    ) : (
                      <GridCol mt={"lg"} span={2}>
                        {value.keys.category}
                      </GridCol>
                    )}
                    <GridCol span={`auto`}>
                      {Object.entries(value.languages).map(
                        ([keg, el], subIndex) => (
                          <EditLanguageItem
                            el={el}
                            keg={keg}
                            key={subIndex}
                            localeType={localeType}
                            category={value.keys.category}
                            keys={value.keys.key}
                            fetchLanguageData={fetchLanguageData}
                            setIsSearching={setIsSearching}
                            setRegexMatches={setRegexMatches}
                            fetchVersionBasedData={fetchVersionBasedData}
                            versionData={versionData}
                            setBlue={setBlue}
                            setLoading={setLoading}
                            loading={loading}
                          />
                        )
                      )}
                    </GridCol>
                  </Grid>
                  {/* {openBlue && (
                    <Center>
                      <div
                        style={{
                          width: "60%",
                          marginTop: "2em",
                          border: "1px solid #ccc",
                          borderRadius: "10px",
                          boxShadow: "6px 8px 10px #ccc",
                          padding: "1em",
                        }}
                      >
                        <Grid>
                          <GridCol span={2} fw={"bolder"}>
                            Key
                          </GridCol>
                          <GridCol span={2} fw={"bolder"}>
                            Version
                          </GridCol>
                          <GridCol span={8} fw={"bolder"}>
                            Input String
                          </GridCol>
                        </Grid>
                        {versionData.map((el: any, index: any) => (
                          <VersionData
                            versionData={versionData}
                            setBlue={setBlue}
                            el={el}
                            key={index}
                          />
                        ))}
                        <Group
                          wrap="nowrap"
                          ta={"right"}
                          justify="right"
                          mt={"lg"}
                        >
                          <Button
                            radius={"xl"}
                            mt={"sm"}
                            bg={"#fff"}
                            style={{
                              border: "1px solid #0082ff",
                              color: "#0082ff",
                            }}
                            onClick={() => setBlue(false)}
                          >
                            Cancel
                          </Button>
                          <Button
                            radius={"xl"}
                            mt={"sm"}
                            style={{
                              background: "#0082ff",
                              color: "white",
                              border: "1px solid #0082ff",
                            }}
                          >
                            Save
                          </Button>
                        </Group>
                      </div>
                    </Center>
                  )} */}
                </div>
              ))}
            </>
          )}
        </ScrollArea>
      </section>
    </div>
  );
}
