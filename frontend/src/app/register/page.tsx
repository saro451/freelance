"use client";
import { Background, Footer, Loader, Nav, Register } from "@/components";
import "./index.css";

export default function Page() {
  return (
    <div className="container">
      <Nav />
      <Background height="100%" />
      <div className="content">
        <div className="back-register my-20" style={{ position: "relative" }}>
          <Register />
        </div>
      </div>
      <div className="footer">
        <Footer />
      </div>
    </div>
  );
}
