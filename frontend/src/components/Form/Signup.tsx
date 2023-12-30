"use client";
import React from "react";
import { FormEvent, useEffect, useState } from "react";
import axiosInstance from "@/api/axios/axios";
import { Language } from "@/lib/Language";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Error from "../Error";
import Invalid from "../Invalid";

interface formData {
  email: string;
  password: string | null;
}

export default function Signup() {
  const [pathname, setPathname] = useState<string | undefined>();
  const [invalid, setInvalid] = useState<Record<string, string>>({});
  const [loginData, setLoginData] = useState<formData>({
    email: "",
    password: null,
  });
  const [error, setError] = useState<Record<string, string>>({});
  const translatedData = Language();
  const [submitted, setSubmitted] = useState(false);
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
    const tokenvalue = params.get("token");
    setPathname(tokenvalue ?? "");

    const sendTokenToBackend = async (token: string) => {
      try {
        const res = await axiosInstance.get(`/signup/verify?token=${token}`);
        console.log(res.data.email);
        setLoginData((prev) => ({ ...prev, email: res.data.email }));
        console.log("Success");
      } catch (error: any) {
        console.log(error);
        router.push("/register");
      }
    };

    if (tokenvalue) {
      sendTokenToBackend(tokenvalue ?? "");
    } else {
      router.push(`/register`);
    }
  }, [setPathname, router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const signupData = {
      password: loginData.password,
      token: pathname,
    };

    try {
      const res = await axiosInstance.post("/signup", signupData);
      console.log(res);
      console.log("Success");
      setSubmitted(true);
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.detail) {
        if (loginData.email.trim() === "") {
          setError(error.response.data.detail);
          setInvalid({});
        } else if (loginData?.password?.trim() === null) {
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
    <>
      {!submitted && (
        <form onSubmit={handleSubmit} noValidate={true} className="text-black">
          <h2 className="text-center py-2 text-[2em] md:text-[2.5em] lg:text-[2.5em] xl:text-[2.5em] font-[700] tracking-wide text-[red]">
            {translatedData?.signup?.signup}
          </h2>
          <section className="w-9/12 m-auto">
            <div className="mt-10">
              <div>
                <label htmlFor="">{translatedData?.signup?.enter_email}</label>
              </div>
              <input
                className="w-[100%] h-14 rounded-3xl px-4"
                placeholder={translatedData?.signup?.email_placeholder}
                type="email"
                name="email"
                id="email"
                required
                value={loginData.email}
                onChange={handleChange}
                disabled
              />
            </div>
            {error.email && <Error error={error.email} />}
            <div className="mt-5">
              <div>
                <label htmlFor="">
                  {" "}
                  {translatedData?.signup?.choose_password}{" "}
                </label>
              </div>
              <input
                className="w-[100%] h-14 rounded-3xl px-4"
                placeholder={translatedData?.signup?.password_placeholder}
                type="password"
                name="password"
                id="password"
                value={loginData.password ?? ""}
                onChange={handleChange}
                required
              />
            </div>
            {error.password && <Error error={error.password} />}

            {invalid.message && <Invalid invalid={invalid.message} />}
          </section>
          <div className="text-center mt-10">
            <button
              className="bg-[#07a31f] hover:bg-[#05b01f] duration-700 text-white px-20 py-4 rounded-3xl"
              type="submit"
            >
              {translatedData?.signup?.signup_btn}
            </button>
          </div>
        </form>
      )}
      {submitted && (
        <section className="text-black">
          <h2 className="text-center text-[1.9rem] font-[700] tracking-wide mt-[7%] text-[red]">
            {translatedData?.register?.register_successful}
          </h2>
          <div className="px-16">
            <div>
              <p className="text-center mt-10 mb-5 font-[300] text-[#273339] text-xl">
                {translatedData?.register?.regiter_success_text_1}
              </p>
            </div>
            <p className="text-center mt-10 mb-5 font-[300] text-[#273339] text-xl">
              {translatedData?.register?.regiter_success_text_2}
            </p>
            <p className="text-center mt-10 font-[300] text-[#273339] text-xl">
              {translatedData?.register?.regiter_success_text_3}
            </p>
            <p className="text-center mt-2 mb-5 font-[300] text-[#273339] text-xl">
              {translatedData?.register?.contact_us_at}
            </p>
            <div className="text-center">
              <Link
                href={`mailto:${translatedData?.register?.register_success_email}?subject=${translatedData?.register?.register_email_subject}&body=${translatedData?.register?.register_email_body}`}
              >
                <button
                  className="bg-[#07a31f] hover:bg-[#05b01f] duration-700 text-white px-3 md:px-28 lg:px-28 py-4 rounded-[40px]"
                  type="submit"
                >
                  {translatedData?.register?.register_success_email_btn}
                </button>
              </Link>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
