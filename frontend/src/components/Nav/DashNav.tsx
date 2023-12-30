import { useAuth } from "@/context/AuthProvider";
import "./nav.css";
import Link from "next/link";
import { Config } from "@/lib/Config";
import LanguageDropdown from "../LanguageDropdown/LanguageDropdown";
import MobileMenu from "./MobileMenu";

export default function DashNav() {
  const { user } = useAuth();
  const config = Config();

  return (
    <nav className="dashnav">
      <header className="w-[75%] m-auto py-4">
        <section className="flex place-content-between">
          <>
            {user && (
              <div className="flex gap-2 user-details">
                <Link href={"/dashboard"}>
                  <img
                    src={user?.profile_pic}
                    alt={user?.name}
                    className="h-14 rounded-[50%] "
                    style={{
                      width: "60px",
                      height: "60px",
                      objectFit: "contain",
                      border: "1.5px solid #fff",
                    }}
                  />
                </Link>
                <div className="my-3">
                  <p className="text-white text-[17px]">{user?.name}</p>
                  <div className="-mt-1">
                    <p className="text-white text-[12px]">{user?.address}</p>
                  </div>
                </div>
              </div>
            )}
          </>
          <MobileMenu />
          <div className="my-5 text-white">
            <LanguageDropdown languages={config.languages} />
          </div>
        </section>
      </header>
    </nav>
  );
}
