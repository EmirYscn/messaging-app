import { IoMdArrowRoundBack } from "react-icons/io";
import { FaUserGroup } from "react-icons/fa6";
import { useTranslation } from "react-i18next";
import { IoPersonAddSharp } from "react-icons/io5";

import Button from "./Button";
import Searchbar from "./Searchbar";
import Friends from "./Friends";

import { useAsideContext } from "../contexts/Aside/AsideContextProvider";
import { useState } from "react";
import NewGroupPanel from "./NewGroupPanel";

type NewChatProps = {
  onBack: () => void;
};

function NewChat({ onBack }: NewChatProps) {
  const { t } = useTranslation("chats");
  const { t: tCommon } = useTranslation("common");
  const { setContext } = useAsideContext();
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);

  return (
    <div className="relative h-full overflow-hidden">
      <div
        className={`absolute top-0 left-0 w-full h-full z-20 bg-[var(--color-grey-50)] transition-transform duration-1000 ease-in-out ${
          isCreatingGroup ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <NewGroupPanel
          onBack={() => setIsCreatingGroup(false)}
          onSuccess={() => {
            setIsCreatingGroup(false);
          }}
        />
      </div>
      <div className="flex flex-col w-full h-full gap-4">
        <div className="flex items-center gap-2 px-4 py-4">
          <Button
            icon={<IoMdArrowRoundBack />}
            size="large"
            className="!p-2"
            onClick={onBack}
          />
          <h1 className="text-lg font-semibold">{t("newChat")}</h1>
        </div>
        <div className="px-4">
          <Searchbar />
        </div>
        <div className="flex flex-col">
          <div
            className="flex items-center gap-4 px-4 py-2 hover:bg-[var(--color-grey-100)] cursor-pointer"
            onClick={() => setIsCreatingGroup(true)}
          >
            <Button
              icon={<FaUserGroup className="text-[var(--color-grey-50)]" />}
              size="large"
              className="!rounded-full bg-[var(--color-brand-100)] !p-3"
            />
            <span>{t("newGroup")}</span>
          </div>
          <div
            className="flex items-center gap-4 px-4 py-2 hover:bg-[var(--color-grey-100)] cursor-pointer"
            onClick={() => setContext("friend-add")}
          >
            <Button
              icon={
                <IoPersonAddSharp className="text-[var(--color-grey-50)]" />
              }
              size="large"
              className="!rounded-full bg-[var(--color-brand-100)] !p-3"
            />
            <span>{t("addFriend")}</span>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <h1 className="px-4 text-xl font-semibold">{tCommon("friends")}</h1>
          <Friends />
        </div>
      </div>
    </div>
  );
}

export default NewChat;
