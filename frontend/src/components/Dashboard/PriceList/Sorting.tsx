import { setCookie } from "cookies-next";
import { useEffect } from "react";

function CookieHandler(sort_items: any) {
  setCookie("pricelist_order", sort_items, {
    sameSite: "none",
    secure: true,
    path: "/",
    maxAge: 60 * 60 * 365 * 24,
  });
}

export default function Sorting({ sort, reloadAPI, setIsSearching }: any) {
  useEffect(() => {
    CookieHandler("name");
  }, []);

  const handleSorting = () => {
    CookieHandler(sort);
    setIsSearching(true);
    console.log(sort);
    reloadAPI();
    setTimeout(() => {
      if (sort) {
        setIsSearching(false);
      }
    }, 2500);
  };

  return (
    <div className="cursor-pointer" onClick={handleSorting}>
      &#8595;
    </div>
  );
}
