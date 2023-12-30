import { setCookie } from 'cookies-next';

export const NextCookie = (languagekey: any, languageCode : any) => {
  setCookie(languagekey, languageCode,  {
    sameSite: "none",
    secure: true,
    path: '/',
    maxAge: 60*60*365*24,
  });
};