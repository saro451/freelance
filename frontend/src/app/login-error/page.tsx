"use client";
import { useState, useEffect } from "react";
import { Background, Footer, LoginError, Nav } from "@/components";
import "./index.css";
import { Language } from "@/lib/Language";
import { useRouter } from "next/navigation";
import { Center } from "@mantine/core";
import { Config } from "@/lib/Config";

export default function Page() {
  const [email, setEmail] = useState<any>();
  const translatedData = Language();
  const router = useRouter();
  const config = Config();
  useEffect(() => {
    const path = window.location.href;
    const url = new URL(`${path}`);
    const params = url.searchParams;
    const tokenvalue = params.get("email");
    if (tokenvalue) {
      setEmail(tokenvalue ?? "");
    } else {
      router.push(`/login`);
    }
  }, []);

  const LoginRedirect = () => {
    router.push(`/login?email=${encodeURIComponent(email)}`);
  };

  return (
    <div className="container">
      <Nav />
      <Background height="100%" />
      <div className="content">
        <div className=" my-20" style={{ position: "relative" }}>
          <LoginError />
        </div>
      </div>
      <div className="footer">
        <Footer />
      </div>
    </div>
  );
}
