import { useTranslation } from "react-i18next";
import PublicChats from "../ui/PublicChats";

function Home() {
  const { t } = useTranslation("common");
  return (
    <div className="flex flex-col h-full gap-4 p-4">
      <h1 className="text-4xl font-semibold">{t("publicChats")}</h1>
      <PublicChats />
    </div>
  );
}

export default Home;
