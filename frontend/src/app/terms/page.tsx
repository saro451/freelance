"use client";
import { Background, Footer, Nav, SecondBack } from "@/components";
import "./index.css";
import { Language } from "@/lib/Language";
import renderDynamicLinks from "@/lib/DynamicLinks";
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

      <section style={{ position: "relative" }}>
        <div className="text-center mt-20">
          <h1 className="text-white font-[700] text-2xl">
            {translatedData?.terms?.terms}
          </h1>
          <div className="mt-5">
            <button
              className="px-10 text-white bg-[#089e1e] py-3 rounded-full text-lg font-[600]"
              onClick={closePopup}
            >
              {translatedData?.terms?.close}
            </button>
          </div>
        </div>
        <div className="back-terms px-10 py-10 text-center text-[14px] leading-7 font-[300] text-[#282b31]">
          <p
            dangerouslySetInnerHTML={renderHtmlSafely(
              translatedData?.terms?.terms_text_1
            )}
          />

          {Array.from({ length: 2 }, (_, index) => (
            <p key={index} className="">
              {translatedData?.terms?.[`terms_text_${index + 2}`]}
            </p>
          ))}

          <p className="mt-6">{translatedData?.terms?.terms_text_4}</p>
          <p className="mb-6">{translatedData?.terms?.terms_text_5}</p>

          {Array.from({ length: 14 }, (_, index) => (
            <p key={index} className="">
              {translatedData?.terms?.[`terms_text_${index + 6}`]}
            </p>
          ))}
          <p>
            {renderDynamicLinks(translatedData?.terms?.terms_text_20, true)}
          </p>
          <p>{translatedData?.terms?.terms_text_21}</p>
          <p>{translatedData?.terms?.terms_text_22}</p>
          <p>{translatedData?.terms?.terms_text_23}</p>
          <p>{translatedData?.terms?.terms_text_24}</p>
        </div>
        <div className="he-between text-center py-6">
          <button
            className="px-10 text-white bg-[#089e1e] py-3 rounded-full text-lg font-[600]"
            onClick={closePopup}
          >
            {translatedData?.terms?.close}
          </button>
        </div>
      </section>
      {/* <div>
        <Footer />
        </div> */}
    </section>
  );
}
