"use client";
import { AccountExpired, Background, Footer, Nav } from "@/components";
import "./index.css";
import { Language } from "@/lib/Language";

export default function Page() {
  const translatedData = Language();

  return (
    <div className="container">
      <Nav />
      <Background height="100%" />
      <div className="content">
        <div className=" my-20" style={{ position: "relative" }}>
          <AccountExpired translatedData={translatedData} />
        </div>
      </div>
      <div className="footer">
        <Footer />
      </div>
    </div>
  );
}
