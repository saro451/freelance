"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { getCookie, setCookie, deleteCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import axiosInstance from "@/api/axios/axios";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
  user: any;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
  user: null,
});

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const token = getCookie("token");
    return !!token;
  });
  const [remember, setRemember] = useState(() => {
    const remember_me = getCookie("isRem");
    return !!remember_me;
  });
  const router = useRouter();
  const [user, setUser] = useState<any>([]);
  const currentDate = new Date();
  const [warningDisplayed, setWarningDisplayed] = useState<boolean>(false);

  const login = (token: string) => {
    const fiveYearsInSeconds = 5 * 365 * 24 * 60 * 60;
    const expirationDate = new Date(
      currentDate.getTime() + fiveYearsInSeconds * 1000
    );

    const oneDay = 24 * 60 * 60;
    const oneDayExp = new Date(Date.now() + oneDay);
    if (token) {
      if (remember) {
        const fiveYearsInSeconds = 5 * 365 * 24 * 60 * 60;
        const expirationDate = new Date(
          currentDate.getTime() + fiveYearsInSeconds * 1000
        );
        setCookie("token", token, {
          sameSite: "none",
          secure: true,
          path: "/",
          maxAge: fiveYearsInSeconds,
          expires: expirationDate,
        });
      } else {
        setCookie("token", token, {
          secure: true,
          sameSite: "none",
          path: "/",
          maxAge: oneDay,
          expires: oneDayExp,
        });
      }
      setIsAuthenticated(true);
      router.push("/dashboard");
      window.location.reload();
    } else {
      setIsAuthenticated(false);
      alert("Invalid credentials");
    }
  };

  const logout = useCallback(() => {
    deleteCookie("token");
    setIsAuthenticated(false);
  }, []);

  useEffect(() => {
    const token = getCookie("token");
    if (token) {
      const fetchUserData = async () => {
        try {
          const response = await axiosInstance.get("/user");
          setUser(response.data);
          const show_warning = response.data.show_warning;
          const warningDisplayed = getCookie("warningDisplayed");
          const expirationDate = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            currentDate.getDate() + 1,
            0,
            0,
            0
          );

          const expirationTimestamp = expirationDate.getTime();
          const currentTimestamp = new Date().getTime();
          const timeUntilExpiration = expirationTimestamp - currentTimestamp;
          setTimeout(() => {
            deleteCookie("warningDisplayed");
          }, timeUntilExpiration);

          if (show_warning == true && !warningDisplayed) {
            router.push("/warning");
          }
        } catch (error: any) {
          console.log(error);
          if (error.response && error.response.status === 401) {
            logout();
            router.push("/login");
          }
          if (
            error.response &&
            error.response.status === 402 &&
            error.response.data.error == "account_expired"
          ) {
            router.push("/account-expired");
            setTimeout(() => {
              logout();
            }, 4000);
          }
          if (
            error.response &&
            error.response.status === 402 &&
            error.response.data.error == "trial_expired"
          ) {
            router.push("/trial-expired");
            setTimeout(() => {
              logout();
            }, 4000);
          }
        }
      };
      fetchUserData();
    }
  }, [logout, router, warningDisplayed]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
