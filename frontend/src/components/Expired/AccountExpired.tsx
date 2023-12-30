import { Background, Footer, Nav } from "@/components";
import Link from "next/link";
import { Center } from "@mantine/core";

export default function AccountExpired({ translatedData }: any) {
  return (
    <Center>
      <div className="back-acc-exp pt-5 pb-8 text-black">
        <h1 className="text-center font-[700] text-lg mt-5">
          {translatedData?.account_expired?.account_expired_text_1}
        </h1>
        <div className="px-10 text-center">
          <p className="mb-10 text-[1.125rem] mt-6">
            {translatedData?.account_expired?.account_expired_text_2}
          </p>
          <p className="text-[1.125rem] mt-6">
            {translatedData?.account_expired?.account_expired_text_3}
          </p>
        </div>
        <div className="text-center">
          <a
            href={`mailto:${translatedData?.account_expired?.account_expired_email}?subject=${translatedData?.account_expired?.account_expired_email_sub}&body=${translatedData?.account_expired?.account_expired_email_body}`}
          >
            <button className="px-6 py-2 text-white bg-[#0e71d1] mt-5 rounded-[20px]">
              {translatedData?.account_expired?.account_expired_btn}
            </button>
          </a>
        </div>
      </div>
    </Center>
  );
}
