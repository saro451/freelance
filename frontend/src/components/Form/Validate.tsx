"use client";
import React from "react";
import { useEffect, useState, FormEvent } from "react";
import { setCookie } from "cookies-next";
import axiosInstance from "@/api/axios/axios";
import { useAuth } from "@/context/AuthProvider";

interface formData {
  email: string;
  password: string;
  token: string | undefined;
}
export default function Validate() {
  const [pathname, setPathname] = useState<string | undefined>();
  const [loginData, setLoginData] = useState<formData>({
    email: "",
    password: "",
    token: "",
  });
  const { login } = useAuth();

  useEffect(() => {
    const path = window.location.href;
    const url = new URL(`${path}`);
    const params = url.searchParams;
    const tokenvalue = params.get("token");
    setPathname(tokenvalue ?? "");

    const verifyToken = async (token: string) => {
      try {
        const response = await axiosInstance.post("/verify", {
          token,
        });

        if (response.status === 200) {
          const newToken = response.data.token;
          const currentDate = new Date();
          const fiveYearsInSeconds = 5 * 365 * 24 * 60 * 60;
          const expirationDate = new Date(
            currentDate.getTime() + fiveYearsInSeconds * 1000
          );
          setCookie("token", newToken, {
            sameSite: "none",
            secure: true,
            path: "/",
            maxAge: fiveYearsInSeconds,
            expires: expirationDate,
          });
          console.log("Successfully verified and set new token");
          login(newToken);
        } else {
          console.log("Token verification failed");
        }
      } catch (error) {
        console.log("Error:", error);
      }
    };

    if (tokenvalue) {
      verifyToken(tokenvalue);
    }
  }, [setPathname, login]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  return <div></div>;
}
