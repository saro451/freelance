"use client";
import { Button, Checkbox, Group, Menu, Select } from "@mantine/core";
import { IconChevronDown } from "@tabler/icons-react";
import { useEffect, useState } from "react";

export default function FilterCategory({
  language,
  handleCategoryChange,
  categoryQuery,
}: any) {
  const [selectData, setSelectData] = useState<any>([]);
  // const uniqueData = language
  //   .map((el: any) => el.keys.category)
  //   .filter(
  //     (value: string, index: number, self: string[]) =>
  //       self.indexOf(value) === index
  //   )
  useEffect(() => {
    const uniqueData = language
      .map((el: any) => el.keys.category)
      .filter(
        (value: string, index: number, self: string[]) =>
          self.indexOf(value) === index
      );

    setSelectData(
      uniqueData.map((category: any, index: any) => ({
        label: category,
        value: category,
        key: index,
      }))
    );
  }, []);

  const filterItem = (
    <Select
      style={{
        cursor: "pointer",
      }}
      placeholder="Category"
      radius={"100px"}
      w={"60%"}
      mt={"lg"}
      nothingFoundMessage="Nothing found..."
      allowDeselect
      value={categoryQuery}
      clearable
      data={selectData}
      onChange={(selectedOption) => handleCategoryChange(selectedOption)}
    />
  );
  return (
    <Group className="gap-5" justify="left" align="left">
      {filterItem}
      {/* <Button
        className="mt-5 bg-[#228be6] hover:bg-[#2771b3] text-white"
        radius={"100px"}
      >
        Filter
      </Button> */}
    </Group>
  );
}
