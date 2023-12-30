import { useState, useEffect } from "react";
import { Background, Footer, Nav } from "@/components";
import { Language } from "@/lib/Language";
import { useRouter } from "next/navigation";
import { BackgroundImage, Center } from "@mantine/core";

export default function LoginError() {
  const [email, setEmail] = useState<any>();
  const translatedData = Language();
  const router = useRouter();
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
    <div className="back-login-error pt-5 pb-8 text-black">
      <h1 className="text-center font-[700] text-lg mt-5">
        {translatedData?.duplicate_email?.duplicate_email_text_1}
      </h1>
      <div className="px-10 text-center">
        <p className="mb-10 text-[1.125rem] mt-6">
          {translatedData?.duplicate_email?.duplicate_email_text_2}
        </p>
        <p className="text-[1.125rem] mt-6">
          {translatedData?.duplicate_email?.duplicate_email_text_3}
        </p>
      </div>
      <div className="text-center">
        <button
          className="px-6 py-2 text-white bg-[#0e71d1] mt-5 rounded-[20px]"
          onClick={LoginRedirect}
        >
          {translatedData?.duplicate_email?.duplicate_email_btn}
        </button>
      </div>
    </div>
  );
}
