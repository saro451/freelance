"use client";
import { Background, Footer, Nav, Validate } from "@/components";
import "./index.css";
import { useAuth } from "@/context/AuthProvider";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  const { isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    console.log("useEffect triggered with isAuthenticated:", isAuthenticated);
    if (isAuthenticated) {
      console.log("Redirecting to dashboard...");
      router.push("/dashboard");
      return;
    } else {
      router.push("/login");
    }
    setIsLoading(false);
  }, [isAuthenticated, router]);

  return (
    <>
      {isLoading ? (
        <div></div>
      ) : (
        <section>
          {/* <Nav />
        <Background 
        height={"110vh"}
        /> */}
          {/* <div className="bac-log pt-1 pb-12 mb-[14%] mt-[5%]">
          <Validate />
        </div> */}
          <div className="">
            <Validate />
          </div>
          {/* <div>
          <Footer />
        </div> */}
        </section>
      )}
    </>
  );
}
