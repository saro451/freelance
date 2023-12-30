"use client";
import { Background, Footer, Nav, Warning } from "@/components";
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
          <Warning translatedData={translatedData} />
        </div>
      </div>
      <div className="footer">
        <Footer />
      </div>
    </div>
  );
}
