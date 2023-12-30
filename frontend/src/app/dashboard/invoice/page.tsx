"use client";
import { DashNav, MenuBar } from "@/components";
import { Container, Title } from "@mantine/core";

export default function Page() {
  return (
    <section>
      <DashNav />
      <section
        className="w-12/12 m-auto flex gap-16"
        style={{
          height: "90vh",
          overflow: "hidden",
        }}
      >
        <div className="menu-side-bar">
          <MenuBar />
        </div>
        <Title>Invoice Page</Title>
      </section>
    </section>
  );
}
