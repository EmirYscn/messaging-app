// import React, { createContext, useContext, useState } from "react";
// // import styled, { css } from "styled-components";
// import { createPortal } from "react-dom";
// import { HiEllipsisVertical } from "react-icons/hi2";

// import { useOutsideClick } from "../hooks/useOutsideClick";

// type Position = { x: number; y: number } | null;

// type MenusContextType = {
//   openId: number | string;
//   close: () => void;
//   open: React.Dispatch<React.SetStateAction<number | string>>;
//   position: Position;
//   setPosition: React.Dispatch<React.SetStateAction<Position>>;
//   isDarkMode?: boolean;
// };

// const MenusContext = createContext<MenusContextType | undefined>(undefined);

// // const Menu = styled.div`
// //   display: flex;
// //   align-items: center;
// //   justify-content: flex-end;
// // `;

// function Menu({ children }: { children: React.ReactNode }) {
//   return <div className="flex items-center">{children}</div>;
// }

// // const StyledToggle = styled.button<{ $isDarkMode?: boolean }>`
// //   background: none;
// //   border: none;
// //   padding: 0.4rem;
// //   border-radius: var(--border-radius-sm);
// //   transform: translateX(0.8rem);
// //   transition: all 0.2s;

// //   &:hover {
// //     background-color: var(--color-grey-100);
// //   }

// //   &:focus {
// //     outline: none;
// //   }

// //   & svg {
// //     width: 2.4rem;
// //     height: 2.4rem;
// //     color: var(--color-grey-700);
// //   }
// // `;

// // const StyledList = styled.ul<{ position: Position }>`
// //   position: fixed;

// //   background-color: var(--color-grey-0);
// //   box-shadow: var(--shadow-md);
// //   border-radius: var(--border-radius-md);

// //   right: ${(props) => props?.position!.x}px;
// //   top: ${(props) => props?.position!.y}px;

// //   z-index: 200;
// // `;

// // const StyledButton = styled.button<{
// //   selected?: boolean;
// // }>`
// //   width: 100%;
// //   text-align: left;
// //   background: none;
// //   border: none;
// //   padding: 1.2rem 2.4rem;
// //   font-size: 1.4rem;
// //   transition: all 0.2s;

// //   display: flex;
// //   align-items: center;
// //   gap: 1.6rem;

// //   &:hover {
// //     background-color: var(--color-grey-50);
// //   }

// //   & svg {
// //     width: 1.6rem;
// //     height: 1.6rem;
// //     color: var(--color-grey-400);
// //     transition: all 0.3s;
// //   }

// //   ${(props) =>
// //     props.selected &&
// //     css`
// //       background-color: var(--color-brand-900);
// //     `}
// // `;

// function Menus({ children }: { children: React.ReactNode }) {
//   const [openId, setOpenId] = useState<number | string>("");
//   const [position, setPosition] = useState<Position>(null);

//   const close = () => setOpenId("");
//   const open = setOpenId;

//   return (
//     <MenusContext.Provider
//       value={{ openId, close, open, position, setPosition }}
//     >
//       {children}
//     </MenusContext.Provider>
//   );
// }

// type ToggleProps = {
//   id: number | string;
//   children?: React.ReactNode;
//   icon?: React.ReactNode;
// };

// function Toggle({ id, children, icon }: ToggleProps) {
//   const context = useContext(MenusContext);
//   if (!context) {
//     throw new Error("Toggle must be used within a MenusProvider");
//   }

//   const { openId, close, open, setPosition } = context;

//   function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
//     e.stopPropagation();
//     const button = (e.target as HTMLElement).closest("button");
//     if (button) {
//       const rect = button.getBoundingClientRect();
//       setPosition({
//         x: window.innerWidth - rect.width - rect.x,
//         y: rect.y + rect.height + 8,
//       });
//       if (openId === "" || openId !== id) open(id);
//       else close();
//     }
//   }

//   return (
//     <button
//       onClick={handleClick}
//       className="w-full translate-x-2 rounded-md hover:bg-gray-100 focus:outline-none dark:hover:bg-gray-700"
//     >
//       {children || icon || (
//         <HiEllipsisVertical className="w-6 h-6 text-gray-700 dark:text-gray-300" />
//       )}
//     </button>
//   );
// }

// type ListProps = {
//   id: number | string;
//   children: React.ReactNode;
// };

// function List({ id, children }: ListProps) {
//   const context = useContext(MenusContext);
//   if (!context) {
//     throw new Error("Toggle must be used within a MenusProvider");
//   }

//   const { openId, position, close } = context;

//   const ref = useOutsideClick<HTMLUListElement>(close, false);

//   if (openId !== id) return null;

//   return createPortal(
//     <ul
//       ref={ref}
//       className="fixed bg-white dark:bg-gray-800 shadow-md rounded-md z-[200] w-max"
//       style={{ top: position?.y, right: position?.x }}
//     >
//       {children}
//     </ul>,
//     document.body
//   );
// }

// type ButtonProps = {
//   children: React.ReactNode;
//   icon?: React.ReactNode;
//   onClick?: () => void;
//   disabled?: boolean | undefined;
//   isSelected?: boolean | undefined;
// };

// function Button({ children, icon, onClick, isSelected }: ButtonProps) {
//   const context = useContext(MenusContext);
//   if (!context) {
//     throw new Error("Toggle must be used within a MenusProvider");
//   }
//   const { close } = context;

//   function handleClick() {
//     onClick?.();
//     close();
//   }

//   return (
//     <li>
//       <button
//         onClick={handleClick}
//         className={`w-full flex items-center gap-4 text-left px-6 py-3 text-sm transition-colors ${
//           isSelected
//             ? "bg-blue-100 dark:bg-blue-900"
//             : "hover:bg-gray-50 dark:hover:bg-gray-700"
//         }`}
//       >
//         {icon && (
//           <span className="w-4 h-4 text-gray-400 transition-all dark:text-gray-300">
//             {icon}
//           </span>
//         )}
//         <span>{children}</span>
//       </button>
//     </li>
//   );
// }

// Menus.Menu = Menu;
// Menus.Toggle = Toggle;
// Menus.List = List;
// Menus.Button = Button;

// export default Menus;

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
      className={`w-full bg-none border-none px-4 py-2 hover:bg-[var(--color-grey-100)] focus:outline-none ${className}`}
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
