"use client";
import axiosInstance from "@/api/axios/axios";
import { AdminNavigation, AdminSideBar, EditLanguage } from "@/components";
import axios, { AxiosResponse, CancelTokenSource } from "axios";
import { useEffect, useState } from "react";
import "./index.css";
import { getCookie, setCookie } from "cookies-next";
import AdminHeader from "@/components/Admin/AdminHeader";
import AdminSearch from "@/components/Admin/AdminSearch";
import { showNotification } from "@/utils/showNotification";

export default function Page() {
  const [language, setLanguage] = useState<any>([]);
  const [categoryStatus, setCategoryStatus] = useState<boolean>();
  const [languageModels, setLanguageModels] = useState<string[]>();
  const [isSearching, setIsSearching] = useState(false);
  const [categoryQuery, setCategoryQuery] = useState<string>("");
  const [localeType, setLocalType] = useState(() => {
    const strings = getCookie("strings");
    if (!strings) return "backend_strings";
    return strings;
  });
  const [regexMatches, setRegexMatches] = useState<any>(["test"]);
  const [versionData, setVersionData] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>();

  const handleCategoryChange = (selectedOption: any) => {
    console.log(selectedOption || "");
    setCategoryQuery(selectedOption || "");
    setIsSearching(true);
  };

  const fetchVersionBasedData = async (
    language: string | null,
    key: string | null,
    category: string | null
  ) => {
    const string = "versionbased";
    try {
      const response = await axiosInstance.get(
        `/admin/${string}/${localeType}?language=${language}&key=${key}&category=${category}`
      );
      console.log(response.data.data);
      setVersionData(response.data.data);
      setLoading(false);
    } catch (error: any) {
      showNotification(error.response);
    }
  };

  const fetchNoCatLanguageData = async () => {
    const cancelTokenSource: CancelTokenSource = axios.CancelToken.source();

    try {
      const response: AxiosResponse<any> = await axiosInstance.get<any>(
        `/admin/locale/${localeType}`,
        { cancelToken: cancelTokenSource.token }
      );
      setLanguage(response.data.data);
      setCategoryStatus(response.data.category);
      setIsSearching(false);
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("Request canceled by component unmount");
      } else {
        console.log(error);
      }
    }
  };

  const fetchLanguageData = async () => {
    const cancelTokenSource: CancelTokenSource = axios.CancelToken.source();
    const categoryQueryParam = categoryQuery
      ? `?category=${categoryQuery}`
      : "";

    try {
      const response: AxiosResponse<any> = await axiosInstance.get<any>(
        `/admin/locale/${localeType}${categoryQueryParam}`,
        { cancelToken: cancelTokenSource.token }
      );
      setLanguage(response.data.data);
      setCategoryStatus(response.data.category);
      setIsSearching(false);
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("Request canceled by component unmount");
      } else {
        console.log(error);
      }
    }
  };

  const fetchLanguageModel = async () => {
    const cancelTokenSource: CancelTokenSource = axios.CancelToken.source();
    try {
      const response: AxiosResponse<any> = await axiosInstance.get<any>(
        `/admin/language/models`,
        { cancelToken: cancelTokenSource.token }
      );
      setLanguageModels(response.data.models);
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("Request canceled by component unmount");
      } else {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    const strings = getCookie("strings");
    if (!strings) {
      fetchLanguageData();
    }
  }, []);

  useEffect(() => {
    fetchLanguageModel();
  }, []);

  useEffect(() => {
    if (categoryQuery) {
      fetchLanguageData();
    } else {
      fetchNoCatLanguageData();
    }
  }, [categoryQuery]);

  return (
    <div style={{ display: "flex", overflow: "hidden" }}>
      <AdminSideBar />
      <div style={{ width: "100%" }} className="shadow-md">
        <AdminNavigation />
        <div className="pt-5 mt-2 h-[90vh] bg-[#f9faff]">
          <AdminHeader
            title={"Language"}
            setLanguage={setLanguage}
            setLocalType={setLocalType}
            localeType={localeType}
            languageModels={languageModels}
            fetchLanguageData={fetchLanguageData}
            fetchLanguageModel={fetchLanguageModel}
            setIsSearching={setIsSearching}
            setCategoryQuery={setCategoryQuery}
          />

          <AdminSearch
            localeType={localeType}
            categoryStatus={categoryStatus}
            language={language}
            setCategoryQuery={setCategoryQuery}
            fetchLanguageData={fetchLanguageData}
            categoryQuery={categoryQuery}
            handleCategoryChange={handleCategoryChange}
            setIsSearching={setIsSearching}
          />
          <EditLanguage
            language={language}
            setLanguage={setLanguage}
            setLocalType={setLocalType}
            localeType={localeType}
            languageModels={languageModels}
            fetchLanguageData={fetchLanguageData}
            fetchLanguageModel={fetchLanguageModel}
            isSearching={isSearching}
            setIsSearching={setIsSearching}
            categoryStatus={categoryStatus}
            setCategoryQuery={setCategoryQuery}
            categoryQuery={categoryQuery}
            handleCategoryChange={handleCategoryChange}
            setRegexMatches={setRegexMatches}
            fetchVersionBasedData={fetchVersionBasedData}
            versionData={versionData}
            setLoading={setLoading}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
}
