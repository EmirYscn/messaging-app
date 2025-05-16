import { useTranslation } from "react-i18next";
import { useState } from "react";

import { User } from "../types/types";

import Button from "./Button";
import Friends from "./Friends";
import Searchbar from "./Searchbar";

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
    <div className="w-[10rem] md:w-[20rem] lg:w-[40rem] flex flex-col gap-[1.2rem]">
      <div className="flex flex-col gap-4 overflow-y-auto">
        <h1 className="px-4 text-3xl font-semibold">{tCommon("friends")}</h1>

        <Searchbar
          placeholder={tCommon("searchFriends")}
          searchValue={searchbarValue}
          setSearchValue={setSearchbarValue}
        />
        <Friends
          hasCheckbox={true}
          onCheck={(user: User) => handleUserSelection(user)}
          selectedUsers={selectedUsers}
          searchbarValue={searchbarValue}
        />
      </div>

      <div className="flex justify-end gap-[1.2rem]">
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
