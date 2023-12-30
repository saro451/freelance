import { NextCookie } from "@/utils/nextCookie";
import { Button, Menu, Select } from "@mantine/core";
import { IconChevronDown } from "@tabler/icons-react";
import { useEffect } from "react";
import PageTitle from "./PageTitle";

export default function AdminHeader({
  title,
  setLocalType,
  localeType,
  languageModels,
  fetchLanguageData,
  fetchLanguageModel,
  setIsSearching,
  setCategoryQuery,
  setLanguage,
}: any) {
  const handleModel = (value: any) => {
    if (value !== localeType) {
      NextCookie("strings", value);
      setLocalType(value);
      setIsSearching(true);
      setCategoryQuery("");
      console.log("Selected value:", value);
    }
  };

  useEffect(() => {
    fetchLanguageData();
    fetchLanguageModel();
  }, [localeType]);

  const menuOption = (
    <Select
      className="select-color-vsjkhasd"
      w={"inherit"}
      mb={"xl"}
      label=""
      placeholder="Select"
      rightSection={<IconChevronDown className="text-white" />}
      defaultValue="backend_strings"
      onChange={(value) => handleModel(value)}
      allowDeselect={false}
      value={localeType}
      data={languageModels}
    />
  );
  return (
    <section className="flex place-content-between px-5">
      <PageTitle title={title} />
      <div className="text-white">{menuOption}</div>
    </section>
  );
}
