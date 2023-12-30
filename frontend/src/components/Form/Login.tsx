import { Background, Error, Footer, Invalid, Nav } from "@/components";
import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import axiosInstance from "@/api/axios/axios";
import { Language } from "@/lib/Language";
import { useAuth } from "@/context/AuthProvider";
import { useRouter } from "next/navigation";
import { Center, Checkbox } from "@mantine/core";
import { setCookie } from "cookies-next";

type formData = {
  email: string;
  password: string;
};

export default function Login() {
  const [loginData, setLoginData] = useState<formData>({
    email: "",
    password: "",
  });
  const [error, setError] = useState<Record<string, string>>({});
  const [invalid, setInvalid] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { login, isAuthenticated } = useAuth();
  const [checked, setChecked] = useState(false);
  const translatedData = Language();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
    setError((prev) => ({ ...prev, [name]: "" }));
  };

  useEffect(() => {
    const path = window.location.href;
    const url = new URL(`${path}`);
    const params = url.searchParams;
    const emailValue = params.get("email");
    if (emailValue) {
      setLoginData((prev) => ({ ...prev, email: emailValue as string }));
    }
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.post("/login", loginData);
      console.log("Success");
      const token = res.data.token;
      if (token) {
        login(token);
      }
      if (checked) {
        setCookie("isRem", checked);
      } else {
        setCookie("isRem", checked);
      }
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.detail) {
        if (loginData.email.trim() === "") {
          setError(error.response.data.detail);
          setInvalid({});
        } else if (loginData.password.trim() === "") {
          setError(error.response.data.detail);
          setInvalid({});
        } else {
          setError(error.response.data.detail);
          setInvalid(error.response.data);
        }
      } else {
        setError({});
        setInvalid({});
      }
    }
  };
  return (
    <Center>
      <div className="back-login pb-12 pt-[0.5px] text-black">
        <form onSubmit={handleSubmit} noValidate={true}>
          <h2 className="text-center py-2 text-[1.8em] md:text-[2.5em] lg:text-[2.5em] xl:text-[2.5em] login-in-in font-[700] tracking-wide mt-[7%] text-[red]">
            {translatedData?.login?.login}
          </h2>
          <section className="w-9/12 m-auto">
            <div className="mt-10">
              <div>
                <label htmlFor="">{translatedData?.login?.enter_email}</label>
              </div>
              <input
                className="w-[100%] h-14 rounded-3xl px-4"
                placeholder={translatedData?.login?.email}
                type="email"
                name="email"
                id="email"
                required
                value={loginData.email}
                onChange={handleChange}
              />
            </div>
            {error.email && <Error error={error.email} />}
            <div className="mt-5">
              <div>
                <label htmlFor="">
                  {translatedData?.login?.enter_password}{" "}
                </label>
              </div>
              <input
                className="w-[100%] h-14 rounded-3xl px-4"
                placeholder={translatedData?.login?.password}
                type="password"
                name="password"
                id="password"
                value={loginData.password}
                onChange={handleChange}
                required
              />
            </div>
            {error.password && <Error error={error.password} />}

            <div className="mt-3 flex gap-2">
              <div
                style={{
                  cursor: "pointer",
                }}
              >
                <Checkbox
                  name="remember"
                  id="remember"
                  label={translatedData?.login?.remember_me}
                  checked={checked}
                  onChange={(event) => setChecked(event.currentTarget.checked)}
                />
              </div>
            </div>

            {invalid.message && <Invalid invalid={invalid.message} />}
          </section>

          <div className="text-center mt-5">
            <button
              className="bg-[#07a31f] hover:bg-[#05b01f] duration-700 text-white px-20 md:px-28 lg:px-28 py-4 rounded-[40px]"
              type="submit"
            >
              {translatedData?.login?.login}
            </button>
          </div>
        </form>
        <section className="text-center mt-5 gotodifferntlink">
          <Link href={`/register`}>{translatedData?.login?.new_customer}</Link>
          <Link href={"/forgot-password"} className="ml-10">
            {translatedData?.login?.get_password}
          </Link>
        </section>
      </div>
    </Center>
  );
}
