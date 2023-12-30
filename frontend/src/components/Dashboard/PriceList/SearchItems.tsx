import { Button, Center, Flex, Group, Modal, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconSearch } from "@tabler/icons-react";
import { FormEvent, useState, useEffect } from "react";

export default function SearchItems({
  translatedData,
  user,
  onSearch,
  reloadAPI,
  setSearchActive,
  searchActive,
  setIsSearching,
}: any) {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [articleTerm, setArticleTerm] = useState<string>("");
  const [term, setTerm] = useState<any>();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [keys, setKeys] = useState<string>("");
  const [opened, { close, open }] = useDisclosure(false);

  const handleSearch = (
    e: FormEvent<HTMLFormElement>,
    term: string,
    key: string
  ) => {
    e.preventDefault();
    if (term.trim() === "") {
      setIsSearching(true);
      setSearchActive(false);
    }
    if (term) {
      open();
      setKeys(key);
      setTerm(term);
    } else {
      onSearch("", key, "");
      setSearchActive(false);
    }
  };

  const handleIconSearchClick = (term: string, key: string) => {
    if (term.trim() === "") {
      setIsSearching(true);
      setSearchActive(false);
      // window.location.reload();
      // reloadAPI();
    }
    if (term) {
      open();
      setKeys(key);
      setTerm(term);
    } else {
      onSearch("", key, "");
      setSearchActive(false);
    }
  };

  useEffect(() => {
    if (!searchActive) {
      setIsSearching(false);
      reloadAPI();
    }
  }, [searchActive]);

  return (
    <div className="psd-1">
      {user?.advanced_mode === true && user?.price_list_mode === "full" ? (
        <form
          className="flex search-article w-[25rem] py-1 rounded-xl"
          onSubmit={(e) => handleSearch(e, articleTerm, "article")}
          noValidate
        >
          <input
            className="search-box text-black"
            type="text"
            style={{ border: "none !important" }}
            name="article"
            id="article"
            value={articleTerm}
            placeholder={translatedData?.price_list?.search_article_number}
            onChange={(e) => setArticleTerm(e.target.value)}
          />
          <IconSearch
            color="#44dcff"
            className="cursor-pointer"
            size={25}
            onClick={() => handleIconSearchClick(articleTerm, "article")}
          />
        </form>
      ) : (
        <></>
      )}
      <form
        className="flex search-article w-[25rem] py-1 rounded-xl mt-2"
        onSubmit={(e) => handleSearch(e, searchTerm, "title")}
        noValidate
      >
        <input
          className="search-box text-black"
          type="text"
          style={{ border: "none !important" }}
          name="search"
          id="title"
          value={searchTerm}
          placeholder={translatedData?.price_list?.search_product}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <IconSearch
          color="#44dcff"
          size={25}
          className="cursor-pointer"
          onClick={() => handleIconSearchClick(searchTerm, "title")}
        />
      </form>

      <Modal
        opened={opened}
        onClose={close}
        size={"xl"}
        radius={"xl"}
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
        <div className="grid-2 gap-10 px-2">
          <Text className="text-center" c={"#000"}>
            {translatedData?.price_list?.show_all_text}
          </Text>
          <button
            className="bg-[#0f7ee9] text-white rounded-[50px] py-[12px]"
            onClick={() => {
              setSelectedOption("all");
              onSearch(term, keys, "all");
              close();
            }}
          >
            {translatedData?.price_list?.show_all}
          </button>
        </div>

        <div className="grid-2 mt-8 gap-10 px-2">
          <Text className="text-center" c={"#000"}>
            {translatedData?.price_list?.show_alphabetically_text}
          </Text>
          <button
            className="bg-[#0f7ee9] text-white rounded-[50px] py-[12px]"
            onClick={() => {
              setSelectedOption("alphabetical");
              onSearch(term, keys, "alphabetical");
              close();
            }}
          >
            {translatedData?.price_list?.show_alphabetically}
          </button>
        </div>
      </Modal>
    </div>
  );
}
