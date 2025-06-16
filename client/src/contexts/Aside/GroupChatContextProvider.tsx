import { useContext, useState } from "react";

import { User } from "../../types/types";
import { GroupChatContext } from "./GroupChatContext";

type GroupChatContextProviderProps = {
  children: React.ReactNode;
};

function GroupChatContextProvider({ children }: GroupChatContextProviderProps) {
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);

  function handleUserSelection(user: User) {
    setSelectedUsers((prev: User[]) =>
      prev.some((u) => u.id === user.id)
        ? prev.filter((u) => u.id !== user.id)
        : [...prev, user]
    );
  }

  return (
    <GroupChatContext.Provider
      value={{ selectedUsers, setSelectedUsers, handleUserSelection }}
    >
      {children}
    </GroupChatContext.Provider>
  );
}

function useGroupChatContext() {
  const context = useContext(GroupChatContext);
  if (context === undefined)
    throw new Error(
      "GroupChatContext was used outside of GroupChatContextProvider"
    );
  return context;
}

export { GroupChatContextProvider, useGroupChatContext };
