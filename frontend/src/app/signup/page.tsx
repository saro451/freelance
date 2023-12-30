"use client";
import { Background, Footer, Nav, Signup } from "@/components";
import "./index.css";
import { Center } from "@mantine/core";

export default function Page() {
  return (
    <div className="container">
      <Nav />
      <Background height="100%" />
      <div className="content">
        <div className="bac-log my-20 py-6" style={{ position: "relative" }}>
          <Signup />
        </div>
      </div>
      <div className="footer">
        <Footer />
      </div>
    </div>
  );
}
