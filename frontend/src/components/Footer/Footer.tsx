import Link from "next/link";
import { Language } from "@/lib/Language";
import { Config } from "@/lib/Config";

export default function Footer() {
  const translatedData = Language();
  const config = Config();

  const linkCollection = [
    {
      label: translatedData?.footer?.home,
      link: config?.links?.home,
      alt: "Home",
      id: "1",
    },
    {
      label: translatedData?.footer?.order,
      link: config?.links?.orders,
      alt: "Order",
      id: "2",
    },
    {
      label: translatedData?.footer?.contact_us,
      alt: "Contactus",
      link: config?.links?.contact_us,
      id: "3",
    },
  ];

  if (!config || !translatedData) {
    return null;
  }

  const footerLinks = linkCollection.map((collection) => (
    <Link href={collection.link || "#"} key={collection.id}>
      <span>
        <p>{collection.label}</p>
      </span>
    </Link>
  ));

  return (
    <>
      <footer
        className="w-[100%] h-[12rem]  footer"
        style={{
          position: "relative",
        }}
      >
        <div className="flex flex-cols-6 justify-center gap-10 text-[#fff] pt-16">
          {footerLinks}
        </div>
        <div className="text-center mt-5">
          <p className="text-white px-5 md:p-0 xl:p-0 lg:p-0">
            {translatedData?.footer?.copyright}
          </p>
        </div>
      </footer>
    </>
  );
}
