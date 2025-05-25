import React, { createContext, useContext, useState } from "react";
import { createPortal } from "react-dom";
import { HiEllipsisVertical } from "react-icons/hi2";

import { useOutsideClick } from "../hooks/useOutsideClick";
import { useDarkMode } from "../contexts/DarkMode/ThemeContextProvider";

type Position = { x: number; y: number } | null;

type MenusContextType = {
  openId: number | string;
  close: () => void;
  open: React.Dispatch<React.SetStateAction<number | string>>;
  position: Position;
  setPosition: React.Dispatch<React.SetStateAction<Position>>;
  isDarkMode?: boolean;
};

type MenusProps = {
  children: React.ReactNode;
};

const MenusContext = createContext<MenusContextType | undefined>(undefined);

function Menus({ children }: MenusProps) {
  const { isDarkMode } = useDarkMode();
  const [openId, setOpenId] = useState<number | string>("");
  const [position, setPosition] = useState<Position>(null);

  const close = () => setOpenId("");
  const open = setOpenId;

  return (
    <MenusContext.Provider
      value={{ openId, close, open, position, setPosition, isDarkMode }}
    >
      {children}
    </MenusContext.Provider>
  );
}

type ToggleProps = {
  id: number | string;
  children?: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
  position?: "above" | "below";
};

function Toggle({
  id,
  children,
  icon,
  className,
  position = "below",
}: ToggleProps) {
  const context = useContext(MenusContext);
  if (!context) {
    throw new Error("Toggle must be used within a MenusProvider");
  }

  const { openId, close, open, setPosition } = context;

  function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.stopPropagation();
    const button = (e.target as HTMLElement).closest("button");
    if (button) {
      const rect = button.getBoundingClientRect();
      setPosition({
        x:
          position === "above"
            ? window.innerWidth - rect.width * 3 - rect.x
            : window.innerWidth - rect.width - rect.x,
        y:
          position === "above"
            ? rect.y - rect.height - 32
            : rect.y + rect.height + 8,
      });
      if (openId === "" || openId !== id) open(id);
      else close();
    }
  }

  return (
    <button
      onClick={handleClick}
      className={`w-full bg-none border-none px-4 py-2 hover:bg-[var(--color-brand-100)]/10 focus:outline-none ${className}`}
    >
      {children || icon || (
        <HiEllipsisVertical className="w-6 h-6 text-[var(--color-grey-700)] " />
      )}
    </button>
  );
}

type ListProps = {
  id: number | string;
  children: React.ReactNode;
  className?: string;
};

function List({ id, children, className }: ListProps) {
  const context = useContext(MenusContext);
  if (!context) {
    throw new Error("Toggle must be used within a MenusProvider");
  }
  const { openId, position, close } = context;

  const ref = useOutsideClick<HTMLUListElement>(close);

  if (openId !== id) return null;

  return createPortal(
    <ul
      className={`fixed bg-[var(--color-grey-0)] shadow-xl rounded-[var(--border-radius-md)] z-[200] ${className} `}
      style={{ right: `${position?.x}px`, top: `${position?.y}px` }}
      ref={ref}
    >
      {children}
    </ul>,
    document.body
  );
}

type ButtonProps = {
  children?: React.ReactNode;
  icon?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean | undefined;
  isSelected?: boolean | undefined;
  className?: string;
};

function Button({
  children,
  icon,
  onClick,
  isSelected,
  className,
}: ButtonProps) {
  const context = useContext(MenusContext);
  if (!context) {
    throw new Error("Toggle must be used within a MenusProvider");
  }
  const { close } = context;

  if (!context) {
    throw new Error("Toggle must be used within a MenusProvider");
  }

  function handleClick() {
    onClick?.();
    close();
  }

  return (
    <li>
      <button
        onClick={handleClick}
        className={`text-[var(--color-grey-800)] w-full text-left bg-none border-none px-7 py-4 text-sm flex items-center gap-4 hover:bg-[var(--color-grey-100)] [&_svg]:w-[1rem] [&_svg]:h-[1rem] ${
          isSelected ? "bg-[var(--color-brand-900)]" : ""
        } ${className}`}
      >
        {icon}
        {children && <span>{children}</span>}
      </button>
    </li>
  );
}

function Menu({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`flex items-center ${className}`}>{children}</div>;
}

Menus.Menu = Menu;
Menus.Toggle = Toggle;
Menus.List = List;
Menus.Button = Button;

export default Menus;
