"use client";
import React, { createContext, useEffect, useState } from "react";
import { getCookie, setCookie } from "cookies-next";

const LanguageContext = createContext<any>(null);

export const LanguageProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [lanURL, setLanURL] = useState<any>(getCookie("selectedLanguage"));

  return (
    <LanguageContext.Provider value={{ lanURL }}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageContext;
