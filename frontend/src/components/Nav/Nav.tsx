"use client";
import Link from "next/link";
import "./nav.css";
const LanguageDropdown = dynamic(
  () => import("../LanguageDropdown/LanguageDropdown"),
  { ssr: false }
);
import { useState, useCallback, useEffect, useRef } from "react";
import { BiMenu } from "react-icons/bi";
import { Language } from "@/lib/Language";
import { Config } from "@/lib/Config";
import { gsap } from "gsap";
import dynamic from "next/dynamic";

export default function Nav() {
  const config = Config();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const translatedData = Language();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const closeDropdown = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  const handleDocumentClick = useCallback(
    (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        closeDropdown();
      }
    },
    [closeDropdown]
  );

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.addEventListener("click", handleDocumentClick);
    } else {
      document.removeEventListener("click", handleDocumentClick);
    }

    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, [isMobileMenuOpen, handleDocumentClick]);

  const animateMenu = (isOpen: any) => {
    const menuElement = menuRef.current;
    const timeline = gsap.timeline();

    if (isOpen) {
      timeline
        .to(menuElement, { height: "20rem", opacity: 1, duration: 0.01 })
        .then(() => {
          timeline.to(".sdasd", { height: "34%", duration: 0.03 });
        });
    } else {
      timeline.to(menuElement, { height: 0, duration: 0.003 });
      timeline.to(".sdasd", { height: 0, duration: 0.0000011, delay: 0.1 });
    }
  };

  const handleResize = () => {
    if (window.innerWidth > 1079 && isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  };

  useEffect(() => {
    animateMenu(isMobileMenuOpen);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isMobileMenuOpen]);

  const linkCollection = [
    {
      label: translatedData?.navigation?.home,
      link: config?.links?.home,
      alt: "Home",
      id: "1",
    },
    {
      label: translatedData?.navigation?.order,
      link: config?.links?.orders,
      alt: "Order",
      id: "2",
    },
    {
      label: translatedData?.navigation?.our_customer,
      link: config?.links?.our_customer,
      alt: "Become a Customer",
      id: "3",
    },
    {
      label: translatedData?.navigation?.about_us,
      link: config?.links?.about_us,
      alt: "About us",
      id: "4",
    },
    {
      label: translatedData?.navigation?.contact_us,
      alt: "Contactus",
      link: config?.links?.contact_us,
      id: "5",
    },
  ];

  const collectionlink = linkCollection.map((collection) => (
    <Link
      href={collection.link || "#"}
      key={collection.id}
      className={`text-[15px] linkCollection block md:block lg:inline-block xl:ml-4 xl:hover:text-[#ccc] ${
        isMobileMenuOpen ? "py-5 px-8" : "px-3 m-0"
      }`}
    >
      <span className="collectionSpan">
        <p>{collection.label}</p>
      </span>
    </Link>
  ));

  if (!config || !translatedData) {
    return null; // Future function render a loading indicator
  }

  return (
    <nav
      style={{
        width: "100%",
        position: "relative",
        zIndex: "10",
        fontWeight: "600",
      }}
      className="navigation-out"
    >
      <header
        ref={dropdownRef}
        className={`w-[90%] md:w-[70%] lg:w-[70%] xl:w-[70%] m-auto pt-10 ${
          isMobileMenuOpen ? "text-black" : "text-white"
        }`}
      >
        <section className="flex place-content-between">
          <div className="logoa">
            <Link href={"/"}>
              <img src={config?.logo} alt="" className="h-8 -mt-2" />
            </Link>
          </div>

          <div className="open-menu-dds">
            <BiMenu
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white text-4xl cursor-pointer"
            />
          </div>

          <div className="flex gap-4">
            <div
              className={`menu bg-[#fff] absolute mt-12 shadow-lg`}
              ref={menuRef}
            >
              <div
                className="sdasd"
                style={{ position: "relative", zIndex: "30" }}
              >
                {collectionlink}
              </div>
            </div>

            <div className="pc-menu">{collectionlink}</div>

            <div className="md:mt-0 lang-drop ">
              <LanguageDropdown languages={config.languages} />
            </div>
          </div>

          <div className="md:mt-0 lang-dropk mt-1">
            <LanguageDropdown languages={config.languages} />
          </div>
        </section>
      </header>
    </nav>
  );
}
