"use client";
import { Background, Error, Footer, Invalid, Loader, Nav } from "@/components";
import "./index.css";
import { FormEvent, Suspense, useEffect, useState } from "react";
import axiosInstance from "@/api/axios/axios";
import { Language } from "@/lib/Language";
import renderDynamicLinks from "@/lib/DynamicLinks";
import { BackgroundImage, Center } from "@mantine/core";
import { Config } from "@/lib/Config";

interface formData {
  email: string;
}

const ForgotPasswordForm = () => {
  const [resetData, setResetData] = useState<formData>({
    email: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [canResend, setCanResend] = useState(true);
  const [timeLeft, setTimeLeft] = useState(0);
  const [error, setError] = useState<Record<string, string>>({});
  const [invalid, setInvalid] = useState<Record<string, string>>({});

  const translatedData = Language();

  useEffect(() => {
    if (timeLeft > 0 && !canResend) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);

      return () => {
        clearInterval(timer);
      };
    } else if (timeLeft === 0 && !canResend) {
      setCanResend(true);
    }
  }, [timeLeft, canResend]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setResetData((prev) => ({ ...prev, [name]: value }));
    setError((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      await axiosInstance.post("/forgot-password", resetData).then((res) => {
        setSubmitted(true);
        setCanResend(false);
        setTimeLeft(60);
      });

      console.log("Success");
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.detail) {
        setError(error.response.data.detail);
        setInvalid(error.response.data);
        console.log(error.response.data.detail);
      } else {
        setError({});
        setInvalid({});
      }
    }
  };

  const handleResend = async () => {
    try {
      await axiosInstance.post("/forgot-password", resetData).then(() => {
        setCanResend(false);
        setTimeLeft(60);
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <section>
      {!submitted && (
        <form onSubmit={handleSubmit} noValidate={true} className="text-black">
          <h2 className="text-center py-2 text-[1.7em] md:text-[2.5em] lg:text-[2.5em] xl:text-[2.5em] font-[700] tracking-wide text-[red] forogto-passwordo-titleto">
            {translatedData?.forgot_password?.forgot_password}
          </h2>
          <section className="w-9/12 m-auto">
            <div className="mt-5">
              <div>
                <label htmlFor="">
                  {translatedData?.forgot_password?.enter_email}
                </label>
              </div>
              <input
                className="w-[100%] h-14 rounded-3xl px-4"
                placeholder={translatedData?.forgot_password?.email_placeholder}
                type="email"
                name="email"
                id="email"
                required
                value={resetData.email}
                onChange={handleChange}
              />
              {error.email && <Error error={error.email} />}
            </div>
            {invalid.message && <Invalid invalid={invalid.message} />}
          </section>

          <div className="text-center mt-5">
            <button
              className="bg-[#07a31f] hover:bg-[#05b01f] duration-700 text-white px-12 md:px-28 lg:px-28 py-4 rounded-[40px]"
              type="submit"
            >
              {translatedData?.forgot_password?.send_password}
            </button>
          </div>
        </form>
      )}
      {submitted && (
        <section className="text-black">
          <h2 className="text-center text-[2.5rem] font-[700] tracking-wide mt-[7%] text-[red]">
            {translatedData?.forgot_password?.forgot_password}
          </h2>
          <div className="text-center">
            <p className="text-center mt-10 mb-5 text-[#273339]">
              {translatedData?.forgot_password?.password_sent_successfully}
            </p>
            {invalid.message && <Invalid invalid={invalid.message} />}

            {!canResend && (
              <div>
                <button
                  className="bg-[#07a31f] hover:bg-[#273339] duration-700 text-white px-12 md:px-28 lg:px-28 py-4 rounded-[40px]"
                  type="submit"
                  disabled
                >
                  {translatedData?.forgot_password?.resend_password}
                </button>
              </div>
            )}
            {canResend && (
              <div>
                <button
                  className="bg-[#07a31f] hover:bg-[#273339] duration-700 text-white px-12 md:px-28 lg:px-28 py-4 rounded-[40px]"
                  type="submit"
                  onClick={handleResend}
                >
                  {translatedData?.forgot_password?.resend_password}
                </button>
              </div>
            )}
            {timeLeft > 0 && (
              <div className="mt-5">
                {translatedData?.forgot_password?.resend_password_in.replace(
                  "{time}",
                  `${timeLeft}`
                )}
              </div>
            )}
          </div>
        </section>
      )}
    </section>
  );
};

export default function Page() {
  return (
    <div className="container">
      <Nav />
      <Background height="100%" />
      <div className="content">
        <div
          className="back-for-pass my-20 py-6"
          style={{ position: "relative" }}
        >
          <ForgotPasswordForm />
        </div>
      </div>
      <div className="footer">
        <Footer />
      </div>
    </div>
  );
}
