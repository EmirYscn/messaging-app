import { createContext } from "react";

export type ContextTypes =
  | "chats"
  | "settings"
  | "profile"
  | "friends"
  | "friend-add";

export type AsideContextType = {
  context: ContextTypes;
  setContext: (context: ContextTypes) => void;
};

export const AsideContext = createContext({} as AsideContextType);
