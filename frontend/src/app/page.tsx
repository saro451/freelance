"use client";
import { Background, Nav } from "@/components";
import { useAuth } from "@/context/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(true);

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
          <Nav />
          {/* <Background height={"110vh"} /> */}
        </section>
      )}
    </>
  );
}
