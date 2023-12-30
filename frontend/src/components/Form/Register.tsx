"use client";
import axiosInstance from "@/api/axios/axios";
import { FormEvent, useEffect, useRef, useState } from "react";
import { Language } from "@/lib/Language";
import Error from "../Error";
import Invalid from "../Invalid";
import { Button, Container, Grid, GridCol, Group } from "@mantine/core";
import renderDynamicLinks from "@/lib/DynamicLinks";

interface FormData {
  name: string | null;
  email: string | null;
  org_name: string | null;
  address: string | null;
  location: string | null;
  post_number: string | null;
  mobile: string | null;
  password: string | null;
}

export default function Register() {
  const [formData, setFormData] = useState<FormData>({
    name: null,
    email: null,
    org_name: null,
    address: null,
    location: null,
    post_number: null,
    mobile: null,
    password: null,
  });
  const scrollRef = useRef<HTMLDivElement>(null);
  const translatedData = Language();
  const [error, setError] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [invalid, setInvalid] = useState<Record<string, string>>({});
  const [postStatus, setPostStatus] = useState<"success" | "failure" | null>(
    null
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const res = await axiosInstance.post("/register", formData);
      console.log(res);
      console.log("Success");
      setSubmitted(true);
      setPostStatus("success");
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.detail) {
        setError(error.response.data.detail);
        setInvalid(error.response.data);
        console.log(error.response.data.detail);

        if (formData?.post_number?.trim() === "") {
          setPostStatus(null);
        }
        if (error.response.data.detail.post_number == "invalid_post_number") {
          setPostStatus("failure");
        }
      } else {
        setError({});
        setInvalid({});
        setPostStatus(null);
      }
    }
  };

  useEffect(() => {
    if (postStatus === "failure") {
      window.scrollTo(0, 0);
    }
  }, [postStatus]);

  useEffect(() => {
    if (submitted) {
      window.scrollTo(0, 0);
    }
  }, [submitted]);

  const handleReload = () => {
    setError({});
    setPostStatus(null);
    setSubmitted(false);
  };

  return (
    <div ref={scrollRef}>
      {postStatus === "failure" && !submitted && (
        <div className="text-center mt-5 text-black">
          <h2 className="text-center text-[1.7rem] font-[700] tracking-wide mt-[7%] text-[red] px-6">
            {translatedData?.register?.post_number_invalid}
          </h2>
          <div className="text-fields-register-un">
            <p className="text-center mt-10 font-[300] text-[#273339] text-xl">
              {translatedData?.register?.post_number_invalid_text_1}
            </p>
            <p className="text-center mt-10 font-[300] text-[#273339] text-xl">
              {translatedData?.register?.post_number_invalid_text_2}
            </p>
            <p className="text-center mt-10 font-[300] text-[#273339] text-xl">
              {translatedData?.register?.post_number_invalid_text_3}
            </p>
            <p className="text-center mt-2 mb-5 font-[300] text-[#273339] text-xl">
              {translatedData?.register?.post_number_invalid_text_4}
            </p>
          </div>
          <Container size="xs">
            <Grid gutter="md">
              <GridCol span="auto">
                <a
                  href={`mailto:${translatedData?.register?.post_number_invalid_email}?subject=${translatedData?.register?.post_number_invalid_email_sub}&body=${translatedData?.register?.post_number_invalid_email_body}`}
                >
                  <Button
                    size="lg"
                    radius="xl"
                    style={{
                      background: "#07a31f",
                    }}
                    fullWidth
                    styles={{
                      inner: {
                        fontSize: "15px",
                      },
                    }}
                  >
                    {translatedData?.register?.post_number_invalid_email_btn}
                  </Button>
                </a>
              </GridCol>
              <GridCol span="auto" mt={{ xs: 0, md: 0 }}>
                <Button
                  style={{
                    background: "#07a31f",
                  }}
                  radius="xl"
                  size="lg"
                  fullWidth
                  onClick={handleReload}
                  styles={{
                    inner: {
                      fontSize: "15px",
                    },
                  }}
                >
                  {translatedData?.register?.try_again}
                </Button>
              </GridCol>
            </Grid>
          </Container>
        </div>
      )}

      {!submitted && postStatus !== "failure" && (
        <form onSubmit={handleSubmit} noValidate={true} className="text-black">
          <h2 className="text-center py-2 text-[2em] md:text-[2.5em] lg:text-[2.5em] xl:text-[2.5em] font-[700] tracking-wide mt-[7%] text-[red]">
            {translatedData?.register?.register}
          </h2>
          <section className="w-10/12 m-auto">
            <div className="mt-10">
              <input
                className="w-[100%] h-12 rounded-3xl px-4"
                placeholder={translatedData?.register?.business_name}
                type="text"
                name="org_name"
                value={formData.org_name ?? ""}
                onChange={handleChange}
                id="org_name"
                required
              />
            </div>
            {error.org_name && <Error error={error.org_name} />}
            <div className="mt-5">
              <input
                className="w-[100%] h-12 rounded-3xl px-4"
                placeholder={translatedData?.register?.contact_person}
                type="text"
                name="name"
                id="name"
                value={formData.name ?? ""}
                onChange={handleChange}
                required
              />
            </div>
            {error.name && <Error error={error.name} />}
            <div className="mt-5">
              <input
                className="w-[100%] h-12 rounded-3xl px-4"
                placeholder={translatedData?.register?.address}
                type="text"
                name="address"
                id="address"
                value={formData.address ?? ""}
                onChange={handleChange}
                required
              />
            </div>
            {error.address && <Error error={error.address} />}
            <div className="mt-5">
              <input
                className="w-[100%] h-12 rounded-3xl px-4"
                placeholder={translatedData?.register?.post_number}
                type="text"
                name="post_number"
                id="post_number"
                value={formData.post_number ?? ""}
                onChange={handleChange}
                required
                min={1000}
                max={10000}
              />
            </div>
            {error.post_number && <Error error={error.post_number} />}
            <div className="mt-5">
              <input
                className="w-[100%] h-12 rounded-3xl px-4"
                placeholder={translatedData?.register?.place}
                type="text"
                name="location"
                id="location"
                value={formData.location ?? ""}
                onChange={handleChange}
                required
              />
            </div>
            {error.location && <Error error={error.location} />}
            <div className="mt-5">
              <input
                className="w-[100%] h-12 rounded-3xl px-4"
                placeholder={translatedData?.register?.email_address}
                type="text"
                name="email"
                id="email"
                value={formData.email ?? ""}
                onChange={handleChange}
                required
              />
            </div>
            {error.email && <Error error={error.email} />}
            <div className="mt-5">
              <input
                className="w-[100%] h-12 rounded-3xl px-4"
                placeholder={translatedData?.register?.mobile_number}
                type="text"
                name="mobile"
                id="mobile"
                value={formData.mobile ?? ""}
                onChange={handleChange}
                required
              />
            </div>
            {error.mobile && <Error error={error.mobile} />}

            <div className="text-[13px] font-[400] mt-5">
              <p>{translatedData?.register?.register_text_1}</p>
              <p className="my-2">
                {translatedData?.register?.register_text_2}
              </p>
              <p>{translatedData?.register?.register_text_3}</p>
              <p className="my-4">
                {renderDynamicLinks(
                  translatedData?.register?.register_text_4,
                  true
                )}
              </p>
            </div>

            <div className="mt-5">
              <input
                className="w-[100%] h-12 rounded-3xl px-4"
                placeholder={translatedData?.register?.choose_password}
                type="password"
                name="password"
                id="password"
                value={formData.password ?? ""}
                onChange={handleChange}
                required
              />
            </div>
            {error.password && (
              <span className="text-red-500 text-sm mt-1">
                {error.password}
              </span>
            )}

            {invalid.message && <Invalid invalid={invalid.message} />}
          </section>

          <div className="text-center mt-5">
            <button
              className="bg-[#07a31f] hover:bg-[#05b01f] duration-700 text-white px-16 md:px-28 lg:px-28 py-4 rounded-[40px]"
              type="submit"
            >
              {translatedData?.register?.create_account}
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
              <a
                href={`mailto:${translatedData?.register?.register_success_email}?subject=${translatedData?.register?.register_email_subject}&body=${translatedData?.register?.register_email_body}`}
              >
                <button
                  className="bg-[#07a31f] hover:bg-[#05b01f] duration-700 text-white px-3 md:px-28 lg:px-28 py-4 rounded-[40px] font-[550]"
                  type="submit"
                >
                  {translatedData?.register?.register_success_email_btn}
                </button>
              </a>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
