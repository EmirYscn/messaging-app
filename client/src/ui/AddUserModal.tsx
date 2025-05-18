import { useTranslation } from "react-i18next";
import { useState } from "react";

import { User } from "../types/types";

import Button from "./Button";
import Friends from "./Friends";
import Searchbar from "./Searchbar";
import { useChat } from "../hooks/useChat";

type ConfirmDeleteProps = {
  resourceName?: string;
  onConfirm?: (userIds: string[]) => void;
  disabled?: boolean;
  onCloseModal?: () => void;
};

function AddUserModal({
  onConfirm,
  disabled,
  onCloseModal,
}: ConfirmDeleteProps) {
  const { t: tCommon } = useTranslation("common");
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [searchbarValue, setSearchbarValue] = useState("");
  const { chat } = useChat();

  const userIdsInChat = chat?.users?.map((user) => user.id) || [];

  function handleUserSelection(user: User) {
    setSelectedUsers((prev) =>
      prev.some((u) => u.id === user.id)
        ? prev.filter((u) => u.id !== user.id)
        : [...prev, user]
    );
  }

  function handleConfirm() {
    onConfirm?.(selectedUsers.map((user) => user.id));
    onCloseModal?.();
  }

  return (
    <div className="w-[15rem] md:w-[30rem] lg:w-[40rem] h-[30rem] flex flex-col gap-[1.2rem]">
      <div className="shrink-0 flex flex-col gap-4">
        <h1 className="px-4 text-3xl font-semibold">{tCommon("friends")}</h1>

        <Searchbar
          placeholder={tCommon("searchFriends")}
          searchValue={searchbarValue}
          setSearchValue={setSearchbarValue}
        />
      </div>
      <div className="grow overflow-y-auto">
        <Friends
          hasCheckbox={true}
          filterList={userIdsInChat}
          onCheck={(user: User) => handleUserSelection(user)}
          selectedUsers={selectedUsers}
          searchbarValue={searchbarValue}
        />
      </div>
      <div className="shrink-0 flex justify-end mt-auto px-4 gap-[1.2rem]">
        <Button variation="danger" disabled={disabled} onClick={onCloseModal}>
          Cancel
        </Button>
        <Button
          variation="accept"
          disabled={disabled}
          onClick={handleConfirm}
          className="text-white"
        >
          Done
        </Button>
      </div>
    </div>
  );
}

export default AddUserModal;
