"use client";
import { Background, Error, Footer, Invalid, Login, Nav } from "@/components";
import "./index.css";
import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import axiosInstance from "@/api/axios/axios";
import { Language } from "@/lib/Language";
import { useAuth } from "@/context/AuthProvider";
import { useRouter } from "next/navigation";
import { BackgroundImage, Center, Checkbox, ScrollArea } from "@mantine/core";
import renderDynamicLinks from "@/lib/DynamicLinks";
import { setCookie } from "cookies-next";
import { Config } from "@/lib/Config";
import { Container } from "postcss";

// interface formData {
//   email: string;
//   password: string;
// }

export default function Page() {
  // const [loginData, setLoginData] = useState<formData>({
  //   email: "",
  //   password: "",
  // });
  // const [error, setError] = useState<Record<string, string>>({});
  // const [invalid, setInvalid] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { login, isAuthenticated } = useAuth();
  // const [checked, setChecked] = useState(false);
  // const translatedData = Language();
  const router = useRouter();

  // const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const { name, value } = e.target;
  //   setLoginData((prev) => ({ ...prev, [name]: value }));
  //   setError((prev) => ({ ...prev, [name]: "" }));
  // };

  useEffect(() => {
    console.log("useEffect triggered with isAuthenticated:", isAuthenticated);
    if (isAuthenticated) {
      console.log("Redirecting to dashboard...");
      router.push("/dashboard");
      return;
    }
    setIsLoading(false);
  }, [isAuthenticated, router]);

  return (
    <div className="container">
      <Nav />
      <Background height="100%" />
      <div className="content">
        <div className=" my-20" style={{ position: "relative" }}>
          <Login />
        </div>
      </div>
      <div className="footer">
        <Footer />
      </div>
    </div>
  );
}
