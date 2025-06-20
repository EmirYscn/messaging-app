import { useUser } from "../hooks/useUser";
import ProfileImage from "./ProfileImage";
import Searchbar from "./Searchbar";
import { FaUserCircle } from "react-icons/fa";
import { PiSignOutBold } from "react-icons/pi";
// import { BsBellFill } from "react-icons/bs";
import DarkModeToggle from "./DarkModeToggle";
import { useLogout } from "../hooks/useLogout";
import { useAsideContext } from "../contexts/Aside/AsideContextProvider";
import { useTranslation } from "react-i18next";
import { MdLanguage } from "react-icons/md";

function Settings() {
  const { t, i18n } = useTranslation("settings");
  const { t: authT } = useTranslation("auth");
  const { user } = useUser();
  const { setContext } = useAsideContext();

  const { logout } = useLogout();

  const switchToSpanish = () => {
    i18n.changeLanguage("es"); // Switch to Spanish
  };

  const switchToEnglish = () => {
    i18n.changeLanguage("en"); // Switch to English
  };

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="flex flex-col flex-1 gap-4">
        <h1 className="px-4 py-6 text-4xl font-semibold">{t("settings")}</h1>
        <div className="px-4 ">
          <Searchbar placeholder={t("searchInTheSettings")} />
        </div>
        <div className="px-4 py-2 flex gap-4 items-center hover:bg-[var(--color-grey-100)]/40">
          <ProfileImage imgSrc={user?.avatar} size="md" />
          <h2 className="text-xl">{user?.username}</h2>
        </div>
        <div className="flex flex-col gap-3">
          <button
            onClick={() => setContext("profile")}
            className="grid grid-cols-[auto_1fr] text-left gap-1 items-center hover:bg-[var(--color-grey-100)]/40"
          >
            <div className="px-6 py-4">
              <span className="text-2xl">
                <FaUserCircle />
              </span>
            </div>
            <div className="py-4 border-b-1 border-b-[var(--color-grey-200)]">
              <span>{t("account")}</span>
            </div>
          </button>
          {/* <button className="grid grid-cols-[auto_1fr] text-left gap-1 items-center hover:bg-[var(--color-grey-100)]/40">
            <div className="px-6 py-4">
              <span className="text-2xl">
                <BsBellFill />
              </span>
            </div>
            <div className="py-4 border-b-1 border-b-[var(--color-grey-200)]">
              <span>{t("notifications")}</span>
            </div>
          </button> */}
          <button
            className="grid grid-cols-[auto_1fr] text-left gap-1 items-center hover:bg-[var(--color-grey-100)]/40"
            onClick={() =>
              i18n.language === "es" ? switchToEnglish() : switchToSpanish()
            }
          >
            <div className="px-6 py-4">
              <span className="text-2xl">
                <MdLanguage />
              </span>
            </div>
            <div className="py-4 border-b-1 border-b-[var(--color-grey-200)]">
              <span>
                {t("language")} /{" "}
                {i18n.language === "es" ? "Español" : "English"}
              </span>
            </div>
          </button>
          <button className="grid grid-cols-[auto_1fr] text-left gap-1 items-center text-red-400 hover:bg-[var(--color-grey-100)]/40">
            <div className="px-6 py-4">
              <span className="text-2xl">
                <PiSignOutBold />
              </span>
            </div>
            <div className="py-4" role="button" onClick={() => logout()}>
              <span>{authT("logout")}</span>
            </div>
          </button>
        </div>
      </div>

      {/* Push this to the bottom */}
      <div className="px-6 py-4 text-2xl">
        <DarkModeToggle />
      </div>
    </div>
  );
}

export default Settings;
