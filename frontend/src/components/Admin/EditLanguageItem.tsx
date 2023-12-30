"use client";
import axiosInstance from "@/api/axios/axios";
import renderLinkText, { containsDoubleCurlyBrackets } from "@/lib/BlueText";
import { showNotification } from "@/utils/showNotification";
import {
  Button,
  Center,
  Flex,
  Grid,
  GridCol,
  Group,
  Input,
  Textarea,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useState, useEffect } from "react";
import VersionData from "./VersionData";
import ComponentLoader from "../Loader/ComponentLoader";

export default function EditLanguageItem({
  el,
  setvalues,
  handleSave,
  localeType,
  category,
  keys,
  keg,
  fetchLanguageData,
  setIsSearching,
  language,
  setRegexMatches,
  versionData,
  fetchVersionBasedData,
  setLoading,
  loading,
}: // setBlue,
any) {
  const [opened, { close, open }] = useDisclosure(false);
  const [originalEL, setOriginalEL] = useState(el);
  const [height, setHeight] = useState<boolean>(false);
  const [highlightedKeg, setHighlightedKeg] = useState("");
  const [openBlue, setBlue] = useState<boolean>(false);
  const [contains, setContains] = useState<boolean>(false);
  const handleSaveClick = async () => {
    try {
      const response = await axiosInstance.patch(
        `/admin/locale/${localeType}?category=${category}&key=${keys}`,
        { [keg]: originalEL }
      );
      showNotification(response);
      close();
    } catch (error: any) {
      showNotification(error.response);
      setIsSearching(false);
      close();
    }
  };

  const handleCancel = (originalValue: any) => {
    setOriginalEL(originalValue);
    setHeight(false);
    setHighlightedKeg("");
    close();
  };

  const handleSize = () => {
    setHeight(true);
  };

  const handleTextareaClick = () => {
    open();
    setHighlightedKeg(keg);
    // fetchVersionBasedData(keg, keys);
    // console.log("keg +" + keg);
    // console.log("cat + " + category);
  };

  const handleRegex = () => {
    // const partsArray = renderLinkText(originalEL);
    // localStorage.setItem("extractedArray", JSON.stringify(partsArray));
    if (originalEL && /{{.*}}/.test(originalEL)) {
      setLoading(true);
      setBlue(true);
      fetchVersionBasedData(keg, keys, category);
    }
  };

  return (
    <div className="mb-2">
      <Grid>
        <GridCol span={2}>
          <div
            style={{
              cursor: "pointer",
            }}
            className={`mt-5 ${highlightedKeg === keg ? "blue-text" : ""}`}
            onClick={handleRegex}
          >
            {keg}
          </div>
        </GridCol>
        <GridCol span={"auto"}>
          <Textarea
            className={`border border-solid border-[#ccc] rounded-lg  ${
              height == true ? "input-edit-form-admin" : ""
            }`}
            mt={"sm"}
            rows={1}
            value={originalEL || ""}
            name="value"
            onClick={handleTextareaClick}
            onDoubleClick={handleSize}
            onChange={(e) => setOriginalEL(e.target.value)}
          />
          {opened && (
            <Flex gap={"sm"}>
              <Button
                onClick={handleSaveClick}
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
              <Button
                onClick={() => handleCancel(el)}
                radius={"xl"}
                mt={"sm"}
                bg={"#fff"}
                style={{ border: "1px solid #0082ff", color: "#0082ff" }}
              >
                Cancel
              </Button>
            </Flex>
          )}

          {openBlue && (
            <Center>
              <div
                style={{
                  width: "100%",
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
                {loading ? (
                  <ComponentLoader />
                ) : (
                  <>
                    {versionData.map((el: any, index: any) => (
                      <VersionData
                        versionData={versionData}
                        setBlue={setBlue}
                        el={el}
                        category={el.keys.category}
                        keys={el.keys.key}
                        key={index}
                      />
                    ))}
                  </>
                )}

                <Group justify="right">
                  <Button
                    radius={"xl"}
                    mt={"sm"}
                    style={{
                      background: "#0082ff",
                      color: "white",
                      border: "1px solid #0082ff",
                    }}
                    onClick={() => setBlue(false)}
                  >
                    Close
                  </Button>
                </Group>
              </div>
            </Center>
          )}
        </GridCol>
      </Grid>
    </div>
  );
}
