"use client"
import { useEffect, useState } from "react";
import axios, { AxiosResponse, CancelToken, CancelTokenSource } from "axios";
import axiosInstance from "@/api/axios/axios";

export const Config = () => {
    const [configData, setConfigData] = useState<any>([])

    useEffect(() => {
        let isMounted = true;
        const cancelTokenSource: CancelTokenSource = axios.CancelToken.source();
    
        const fetchLanguageData = async () => {
          try {
            const response: AxiosResponse<any> = await axiosInstance.get<any>(
              `/config`,
              { cancelToken: cancelTokenSource.token }
            );
              setConfigData(response.data);
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
      }, []);
    // const res = await axiosInstance('/config')
    // if(!res.data) throw new Error('failed to fetch')
    // const configData = res.data
      return configData
}
