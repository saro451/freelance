import Link from "next/link";
import { useRouter } from "next/navigation";
import { setCookie } from "cookies-next";

export default function Warning({ translatedData }: any) {
  const router = useRouter();
  const currentDate = new Date();

  const handleContinue = () => {
    const expirationDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate() + 2,
      0,
      0,
      0
    );
    const expirationTimestamp = expirationDate.getTime();
    const currentTimestamp = new Date().getTime();
    setCookie("warningDisplayed", "true", {
      sameSite: "none",
      secure: true,
      path: "/",
      expires: expirationDate,
    });
    router.push(`/dashboard`);
  };
  return (
    <div
      className="back-warning-exp pt-5 pb-8 text-black"
      style={{ position: "relative" }}
    >
      <h1 className="text-center font-[700] text-lg mt-5">
        {translatedData?.warning?.warning_text_1}
      </h1>
      <div className="px-12 text-center">
        <p className="mb-10 text-[1.125rem] mt-6">
          {translatedData?.warning?.warning_text_2}
        </p>
        <p className="text-[1.125rem] mt-6">
          {translatedData?.warning?.warning_text_3}
        </p>
      </div>
      <div className="text-center">
        <a
          href={`mailto:${translatedData?.warning?.warning_email}?subject=${translatedData?.warning?.warning_email_sub}&body=${translatedData?.warning?.warning_email_body}`}
        >
          <button className="px-6 py-2 text-white bg-[#0e71d1] mt-5 rounded-[20px]">
            {translatedData?.warning?.warning_btn_1}
          </button>
        </a>
        <button
          className="px-6 py-2 text-white bg-[#0e71d1] mt-5 rounded-[20px] ml-10"
          onClick={handleContinue}
        >
          {translatedData?.warning?.warning_btn_2}
        </button>
      </div>
    </div>
  );
}
