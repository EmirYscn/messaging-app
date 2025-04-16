import { useContext, useState } from "react";

import { AsideContext, ContextTypes } from "./AsideContext";

type AsideContextContextProviderProps = {
  children: React.ReactNode;
};

function AsideContextProvider({ children }: AsideContextContextProviderProps) {
  const [contextType, setContextType] = useState<ContextTypes>("chats");

  const setContext = (context: ContextTypes) => setContextType(context);

  return (
    <AsideContext.Provider value={{ context: contextType, setContext }}>
      {children}
    </AsideContext.Provider>
  );
}

function useAsideContext() {
  const context = useContext(AsideContext);
  if (context === undefined)
    throw new Error("AsideContext was used outside of AsideContextProvider");
  return context;
}

export { AsideContextProvider, useAsideContext };
