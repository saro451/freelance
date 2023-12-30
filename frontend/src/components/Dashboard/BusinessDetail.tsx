"use client";
import axiosInstance from "@/api/axios/axios";
import { Language } from "@/lib/Language";
import {
  Grid,
  GridCol,
  Input,
  ScrollArea,
  ScrollAreaAutosize,
  Text,
} from "@mantine/core";
import { FormEvent, useEffect, useState } from "react";

interface BusinessData {
  name: string;
  address: string;
  address2: string;
  postcode: string;
  city: string;
  reference: string;
  phone: string;
  email: string;
  accnumber: string;
  orgnumber: string;
  homepage: string;
}

export default function BusinessDetail() {
  const [formData, setFormData] = useState<BusinessData>({
    name: "",
    address: "",
    address2: "",
    postcode: "",
    city: "",
    reference: "",
    phone: "",
    email: "",
    accnumber: "",
    orgnumber: "",
    homepage: "",
  });
  const [error, setError] = useState<Record<string, string>>({});
  const language = Language();
  const translatedData = language?.business_details || {};
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const res = await axiosInstance.post("/mybusiness", formData);
      console.log(res);
      console.log("Success");
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.detail) {
        setError(error.response.data.detail);
        console.log(error.response.data.detail);
      } else {
        setError({});
      }
    }
  };

  return (
    <section className="w-full pt-10">
      <ScrollArea h={"76.5vh"} scrollbarSize={"none"}>
        <h2 className="mb-10">{/* {translatedData?.} */}</h2>
        <form className="">
          <Grid>
            <GridCol span={"auto"}>
              <Grid mb={"xl"}>
                <GridCol span={1}>{translatedData.name}</GridCol>
                <GridCol span={11}>
                  <Input
                    placeholder={translatedData.enter_name}
                    radius={"50px"}
                  />
                </GridCol>
              </Grid>
              <Grid mb={"xl"}>
                <GridCol span={1}>{translatedData.adress}</GridCol>
                <GridCol span={11}>
                  <Input
                    placeholder={translatedData.enter_placeholder}
                    radius={"50px"}
                  />
                </GridCol>
              </Grid>
              <Grid mb={"xl"}>
                <GridCol span={1}>{translatedData.address_2}</GridCol>
                <GridCol span={11}>
                  <Input
                    placeholder={translatedData.address_2_placeholder}
                    radius={"50px"}
                  />
                </GridCol>
              </Grid>
              <Grid mb={"xl"}>
                <GridCol span={1}>{translatedData.postcode}</GridCol>
                <GridCol span={11}>
                  <Input
                    placeholder={translatedData.postcode_placeholder}
                    radius={"50px"}
                  />
                </GridCol>
              </Grid>
              <Grid mb={"xl"}>
                <GridCol span={1}>{translatedData.city}</GridCol>
                <GridCol span={11}>
                  <Input
                    placeholder={translatedData.city_placeholder}
                    radius={"50px"}
                  />
                </GridCol>
              </Grid>
              <Grid mb={"xl"}>
                <GridCol span={1}>{translatedData.phone}</GridCol>
                <GridCol span={11}>
                  <Input
                    placeholder={translatedData.phone_placeholder}
                    radius={"50px"}
                  />
                </GridCol>
              </Grid>
              <Grid mb={"xl"}>
                <GridCol span={1}>{translatedData.emails}</GridCol>
                <GridCol span={11}>
                  <Input
                    placeholder={translatedData.email_placeholder}
                    radius={"50px"}
                  />
                </GridCol>
              </Grid>
              <Grid mb={"xl"}>
                <GridCol span={1}>{translatedData.account_number}</GridCol>
                <GridCol span={11}>
                  <Input
                    placeholder={translatedData.account_number_placeholder}
                    radius={"50px"}
                  />
                </GridCol>
              </Grid>
              <Grid mb={"xl"}>
                <GridCol span={1}>{translatedData.org_number}</GridCol>
                <GridCol span={11}>
                  <Input
                    placeholder={translatedData.org_number_placeholder}
                    radius={"50px"}
                  />
                </GridCol>
              </Grid>
              <Grid mb={"xl"}>
                <GridCol span={1}>{translatedData.homepage}</GridCol>
                <GridCol span={11}>
                  <Input
                    placeholder={translatedData.homepage_placeholder}
                    radius={"50px"}
                  />
                </GridCol>
              </Grid>
            </GridCol>
          </Grid>
        </form>
      </ScrollArea>
    </section>
  );
}
