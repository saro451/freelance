"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { getCookie } from "cookies-next";
import { setLanguageCookie } from "@/utils/cookieUtils";
import "./LanguageDropdown.css";
export interface OptionData {
  id: number;
  name: string;
  code: string;
  icon: string;
  is_active: boolean;
  is_default: boolean;
  is_premium: boolean;
}

interface LanguagesData {
  languages: OptionData[] | null;
}

export default function LanguageDropdown({ languages }: LanguagesData) {
  const [data, setData] = useState<OptionData | null>(
    languages ? languages[0] : null
  );
  const [show, setShow] = useState(false);
  const [selectedOption, setSelectedOption] = useState<OptionData | null>(data);
  const [langdefault, setLangDefault] = useState<any>("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [reloadOnce, setReloadOnce] = useState(false);

  useEffect(() => {
    const selectedLanguageCookie = getCookie("selectedLanguage");
    const selectedLanguage = languages?.find(
      (language) => language.code === selectedLanguageCookie
    );
    const defaultLanguage = languages?.find(
      (language) => language.is_default === true
    );
    if (!selectedLanguageCookie) setLangDefault(defaultLanguage?.code);
    if (!selectedLanguageCookie) setLanguageCookie(langdefault);

    if (selectedLanguage) {
      if (selectedLanguage) {
        setData(selectedLanguage);
        setSelectedOption(selectedLanguage);
      } else {
        if (defaultLanguage) {
          setData(defaultLanguage);
          setSelectedOption(defaultLanguage);
          setLanguageCookie(defaultLanguage.code);
          setReloadOnce(true);
        }
      }
    } else {
      if (defaultLanguage) {
        setData(defaultLanguage);
        setSelectedOption(defaultLanguage);
        setLanguageCookie(defaultLanguage.code);
        setReloadOnce(true);
      }
    }
  }, [languages]);

  useEffect(() => {
    if (reloadOnce) {
      window.location.reload();
    }
  }, [reloadOnce]);

  const closeDropdown = useCallback(() => {
    setShow(false);
  }, []);

  const handleOptionSelect = useCallback(
    (option: OptionData) => {
      setSelectedOption(option);
      setLanguageCookie(option.code);
      closeDropdown();
      window.location.reload();
    },
    [closeDropdown]
  );

  const handleDocumentClick = useCallback(
    (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        closeDropdown();
      }
    },
    [closeDropdown]
  );

  useEffect(() => {
    if (show) {
      document.addEventListener("click", handleDocumentClick);
    } else {
      document.removeEventListener("click", handleDocumentClick);
    }

    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, [show, handleDocumentClick]);

  if (!data || !languages) {
    return null;
  }

  return (
    <div style={{ fontWeight: "550", fontSize: "15px" }}>
      {!show && selectedOption && (
        <div
          id="dropdownContainer"
          className="flex justify-between cursor-pointer gap-flag-con gap-4"
          onClick={() => setShow(true)}
        >
          <p className=" flag-name">{selectedOption?.name}</p>
          <img
            src={selectedOption?.icon}
            className="h-4 mt-[0.5px] w-[26px] h-[18px] rounded-[4px] icon-flag-nav"
            style={{
              objectFit: "cover",
              objectPosition: "center",
            }}
          />
        </div>
      )}

      {show && (
        <div ref={dropdownRef}>
          <div
            className="flex justify-between cursor-pointer gap-flag-con gap-4"
            onClick={() => setShow(false)}
          >
            <p className="flag-name">{selectedOption?.name}</p>
            <img
              src={selectedOption?.icon}
              className="h-4 mt-[0.5px]  w-[26px] h-[18px] rounded-[4px] icon-flag-nav"
              alt={selectedOption?.code}
              style={{
                objectFit: "cover",
                objectPosition: "center",
              }}
            />
          </div>

          <div
            className="py-1 px-1 rounded-lg mt-2 shadow-xl call-dropdown"
            style={{
              fontWeight: "500",
            }}
          >
            {languages?.map((el) => (
              <div
                className={`flex justify-between cursor-pointer my-2 hover:bg-[#8cc0ff] py-1 px-2 duration-700 gap-3`}
                key={el.id}
                onClick={() => handleOptionSelect(el)}
              >
                <div>{el.name}</div>
                <div>
                  <img
                    src={el.icon}
                    className=" w-[26px] h-[18px] mt-1 rounded-[4px]"
                    alt={selectedOption?.code}
                    style={{
                      objectFit: "cover",
                      objectPosition: "center",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
