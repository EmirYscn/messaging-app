import { IoMdArrowRoundBack, IoMdArrowRoundForward } from "react-icons/io";
import { useTranslation } from "react-i18next";

import Button from "./Button";
import Searchbar from "./Searchbar";
import Friends from "./Friends";
import { useState } from "react";
import { User } from "../types/types";
import ProfileImage from "./ProfileImage";
import { useAsideContext } from "../contexts/Aside/AsideContextProvider";
import { useGroupChatContext } from "../contexts/Aside/GroupChatContextProvider";

type NewGroupProps = {
  onBack: () => void;
};

function NewGroupPanel({ onBack }: NewGroupProps) {
  const { t } = useTranslation("chats");
  const { t: tCommon } = useTranslation("common");
  const { selectedUsers, setSelectedUsers, handleUserSelection } =
    useGroupChatContext();
  const [searchbarValue, setSearchbarValue] = useState("");

  const { setContext } = useAsideContext();

  return (
    <div className="relative h-full overflow-hidden">
      <div className="flex flex-col w-full h-full gap-4">
        <div className="flex items-center gap-2 px-4 py-4">
          <Button
            icon={<IoMdArrowRoundBack />}
            size="large"
            className="!p-2"
            onClick={() => {
              setSelectedUsers([]);
              onBack();
            }}
          />
          <h1 className="text-lg font-semibold">{t("addMembersToGroup")}</h1>
        </div>

        {selectedUsers?.length > 0 && (
          <div className="flex flex-wrap gap-2 px-4">
            {selectedUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center gap-2 pr-4 py-2 rounded-full"
              >
                <ProfileImage imgSrc={user.avatar} size="xs" />
                <span className="text-sm font-semibold">{user.username}</span>
                <Button
                  icon={<IoMdArrowRoundBack />}
                  size="small"
                  className="!p-1 hover:text-red-500"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUserSelection(user);
                  }}
                />
              </div>
            ))}
          </div>
        )}

        <div className="px-4">
          <Searchbar
            placeholder={tCommon("searchFriends")}
            searchValue={searchbarValue}
            setSearchValue={setSearchbarValue}
          />
        </div>
        <div className="flex flex-col gap-2 overflow-y-auto">
          <h1 className="px-4 text-xl font-semibold">{tCommon("friends")}</h1>
          <Friends
            hasCheckbox={true}
            onCheck={(user: User) => handleUserSelection(user)}
            selectedUsers={selectedUsers}
            searchbarValue={searchbarValue}
          />
        </div>
        {selectedUsers?.length > 0 && (
          <div className="flex items-center justify-center p-6">
            <Button
              icon={<IoMdArrowRoundForward />}
              size="large"
              className="!p-2 bg-[var(--color-brand-100)] !rounded-full text-white"
              onClick={() => setContext("new-group-chat-final")}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default NewGroupPanel;
