"use client"
import { useContext, useEffect, useState } from "react";
import axios, { AxiosResponse, CancelToken, CancelTokenSource } from "axios";
import axiosInstance from "@/api/axios/axios";
import { CookieValueTypes, getCookie } from "cookies-next";

export const Language = () => {
  const [languageData, setLanguageData] = useState<any>([]);
  const cookieValue: CookieValueTypes | undefined = getCookie('selectedLanguage');
  const initialLanURL: string | undefined = typeof cookieValue === "string" ? cookieValue : undefined;
  const [lanURL, setLanURL] = useState<string | undefined>(initialLanURL);

  useEffect(() => {
    if (lanURL) {
      let isMounted = true;
      const cancelTokenSource: CancelTokenSource = axios.CancelToken.source();
  
      const fetchLanguageData = async () => {
        try {
          const response: AxiosResponse<any> = await axiosInstance.get<any>(
            `/locals/${lanURL}`,
            { cancelToken: cancelTokenSource.token }
          );
          if (isMounted) {
            setLanguageData(response.data);
          }
        } catch (error) {
          if (axios.isCancel(error)) {
            console.log("Request canceled by component unmount");
          } else {
            console.log(error);
          }
        }
      };
  
      fetchLanguageData();
  
      return () => {
        isMounted = false;
        cancelTokenSource.cancel("Request canceled by component unmount");
      };
    }
  }, [lanURL]);


  return languageData;
};