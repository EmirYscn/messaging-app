import { createContext, Dispatch, SetStateAction } from "react";
import { User } from "../../types/types";

export type GroupChatContextType = {
  selectedUsers: User[];
  setSelectedUsers: Dispatch<SetStateAction<User[]>>;
  handleUserSelection: (user: User) => void;
};

export const GroupChatContext = createContext({} as GroupChatContextType);
