import { createContext } from "react";

export type ContextTypes =
  | "chats"
  | "settings"
  | "profile"
  | "friends"
  | "friend-add"
  | "new-chat"
  | "new-group-chat"
  | "new-group-chat-final";

export type AsideContextType = {
  context: ContextTypes;
  setContext: (context: ContextTypes) => void;
};

export const AsideContext = createContext({} as AsideContextType);
