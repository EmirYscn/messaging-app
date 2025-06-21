import { useContext, useRef } from "react";
import { ScrollPositionsContext } from "./ScrollPositionContext";

export const ScrollPositionsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const scrollPositions = useRef<{ [chatId: string]: number }>({});
  return (
    <ScrollPositionsContext.Provider value={scrollPositions}>
      {children}
    </ScrollPositionsContext.Provider>
  );
};

export const useScrollPositions = () => useContext(ScrollPositionsContext);
