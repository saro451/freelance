import { setCookie } from 'cookies-next';

export const setLanguageCookie = (languageCode: string) => {
  setCookie("selectedLanguage", languageCode,  {
    sameSite: "none",
    secure: true,
    path: '/',
    maxAge: 60*60*365*24,
  });
};