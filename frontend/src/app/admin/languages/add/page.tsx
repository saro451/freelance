"use client";
import axiosInstance from "@/api/axios/axios";
import {
  AddLanguage,
  AdminNavigation,
  AdminSideBar,
  PageTitle,
} from "@/components";
import { useEffect, useState } from "react";

export default function Page() {
  return (
    <div style={{ display: "flex" }}>
      <AdminSideBar />
      <div style={{ width: "100%" }} className="shadow-md">
        <AdminNavigation />
        <div className="pt-5 mt-2 h-[90vh] bg-[#f9faff] px-10">
          <PageTitle title={"Language"} />
          <div className="mt-10">
            <AddLanguage />
          </div>
        </div>
      </div>
    </div>
  );
}
