import { createContext } from "react";

export type ContextTypes = "chats" | "settings" | "profile";

export type AsideContextType = {
  context: ContextTypes;
  setContext: (context: ContextTypes) => void;
};

export const AsideContext = createContext({} as AsideContextType);
