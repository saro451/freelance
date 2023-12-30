"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthProvider";
import { useRouter } from "next/navigation";
import {
  BusinessDetail,
  DashNav,
  MenuBar,
  Settings,
  StandardText,
} from "@/components";
import "./index.css";

export default function Page() {
  const [activeTab, setActiveTab] = useState<any>("business");
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, router]);

  const tabs = [
    { id: "business", label: "Business Detail" },
    { id: "settings", label: "Settings" },
    { id: "standardText", label: "Standard Texts" },
  ];

  return (
    <>
      {loading ? (
        <div></div>
      ) : isAuthenticated ? (
        <section>
          <DashNav />
          <section className="w-12/12 m-auto flex gap-16">
            <div className="dashboard-menusidebar">
              <MenuBar />
            </div>
            <div className="main-dashboard-price-list-container">
              <div className="flex border-b mt-10">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    className={`flex-1 cursor-pointer text-center py-2 ${
                      activeTab === tab.id
                        ? "border-t-2 border-red-500 bg-white"
                        : "bg-gray-100"
                    }`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              {activeTab === "business" && <BusinessDetail />}
              {activeTab === "settings" && <Settings />}
              {activeTab === "standardText" && <StandardText />}
            </div>
          </section>
        </section>
      ) : (
        ""
      )}
    </>
  );
}
