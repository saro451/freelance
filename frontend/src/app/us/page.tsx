"use client";
import { Background, Footer, Nav, SecondBack } from "@/components";
import "./index.css";
import { Language } from "@/lib/Language";
import xss from "xss";

export default function Page() {
  const translatedData = Language();

  const closePopup = () => {
    window.close();
  };

  const renderHtmlSafely = (html: string) => {
    return { __html: xss(html) };
  };

  return (
    <section>
      <Nav />
      <SecondBack height={"100%"} />
      <div
        className="text-center mt-20 text-black"
        style={{ position: "relative" }}
      >
        {/* <h1 className='text-white font-[700] text-2xl'>{translatedData?.terms?.terms}</h1> */}
        <div className="mt-5">
          <button
            className="px-10 text-white bg-[#089e1e] py-3 rounded-full text-lg font-[600]"
            onClick={closePopup}
          >
            {translatedData?.us?.close}
          </button>
        </div>
      </div>
      <div
        className="back-us px-16 py-10 text-center text-[14px] leading-7 font-[300] text-[#282b31]"
        style={{ position: "relative" }}
      >
        <p
          dangerouslySetInnerHTML={renderHtmlSafely(
            translatedData?.us?.us_text_1
          )}
        />
        <p>{translatedData?.us?.us_text_2}</p>
        <p>{translatedData?.us?.us_text_3}</p>
      </div>
    </section>
  );
}
