import { createContext } from "react";

export const ScrollPositionsContext = createContext<
  React.RefObject<{ [chatId: string]: number }>
>({ current: {} });
