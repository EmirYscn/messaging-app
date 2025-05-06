import { IoMdArrowRoundBack, IoMdArrowRoundForward } from "react-icons/io";
import { useTranslation } from "react-i18next";

import Button from "./Button";
import Searchbar from "./Searchbar";
import Friends from "./Friends";
import { useState } from "react";
import { User } from "../types/types";
import ProfileImage from "./ProfileImage";
import NewGroupPanelFinal from "./NewGroupPanelFinal";

type NewGroupProps = {
  onBack: () => void;
  onSuccess: () => void;
};

function NewGroupPanel({ onBack, onSuccess }: NewGroupProps) {
  const { t } = useTranslation("chats");
  const { t: tCommon } = useTranslation("common");
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);

  const [isCreatingGroupFinal, setIsCreatingGroupFinal] = useState(false);

  function handleUserSelection(user: User) {
    setSelectedUsers((prev) =>
      prev.some((u) => u.id === user.id)
        ? prev.filter((u) => u.id !== user.id)
        : [...prev, user]
    );
  }

  return (
    <div className="relative h-full overflow-hidden">
      <div
        className={`absolute top-0 left-0 w-full h-full z-20 bg-[var(--color-grey-50)] transition-transform duration-1000 ease-in-out ${
          isCreatingGroupFinal ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <NewGroupPanelFinal
          onBack={() => setIsCreatingGroupFinal(false)}
          selectedUsers={selectedUsers}
          handleUserSelection={handleUserSelection}
          onSuccess={() => {
            setSelectedUsers([]);
            setIsCreatingGroupFinal(false);
            onSuccess();
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
          <h1 className="text-lg font-semibold">{t("addMembersToGroup")}</h1>
        </div>

        {selectedUsers.length > 0 && (
          <div className="flex flex-wrap gap-2 px-4">
            {selectedUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center gap-2 pr-4 py-2 bg-[var(--color-grey-100)] rounded-full"
              >
                <ProfileImage imgSrc={user.avatar} size="xs" />
                <span className="text-sm font-semibold">{user.username}</span>
                <Button
                  icon={<IoMdArrowRoundBack />}
                  size="small"
                  className="!p-1"
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
          <Searchbar />
        </div>
        <div className="flex flex-col gap-2 overflow-y-auto">
          <h1 className="px-4 text-xl font-semibold">{tCommon("friends")}</h1>
          <Friends
            hasCheckbox={true}
            onCheck={(user: User) => handleUserSelection(user)}
            selectedUsers={selectedUsers}
          />
        </div>
        {selectedUsers.length > 0 && (
          <div className="flex items-center justify-center p-6">
            <Button
              icon={<IoMdArrowRoundForward />}
              size="large"
              className="!p-2 bg-[var(--color-brand-100)] !rounded-full"
              onClick={() => setIsCreatingGroupFinal(true)}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default NewGroupPanel;
