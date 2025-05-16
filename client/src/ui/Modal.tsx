import { cloneElement, createContext, useContext, useState } from "react";
import { createPortal } from "react-dom";
import { HiXMark } from "react-icons/hi2";

import { useOutsideClick } from "../hooks/useOutsideClick";

type ModalContextType = {
  openName: string;
  close: () => void;
  open: React.Dispatch<React.SetStateAction<string>>;
  isDarkMode?: boolean;
};

const ModalContext = createContext({} as ModalContextType);

type ModalProps = {
  children: React.ReactNode;
};

function Modal({ children }: ModalProps) {
  const [openName, setOpenName] = useState("");

  const close = () => setOpenName("");
  const open = setOpenName;

  return (
    <ModalContext.Provider value={{ openName, close, open }}>
      {children}
    </ModalContext.Provider>
  );
}

type OpenProps = {
  children: React.ReactElement<any, string | React.JSXElementConstructor<any>>;
  opens: string;
};

function Open({ children, opens: opensWindowName }: OpenProps) {
  const { open } = useContext(ModalContext);
  return cloneElement(children, { onClick: () => open(opensWindowName) });
}

type WindowProps = {
  children: React.ReactElement<any, string | React.JSXElementConstructor<any>>;
  name: string;
};

function Window({ children, name }: WindowProps) {
  const { openName, close } = useContext(ModalContext);

  const ref = useOutsideClick<HTMLDivElement>(close);

  if (name !== openName) return null;

  return createPortal(
    <div className="fixed top-0 left-0 w-full h-full bg-[var(--backdrop-color)] backdrop-blur-[4px] z-[1000]">
      <div
        ref={ref}
        className="fixed top-[50%] left-[50%] translate-[-50%] bg-[var(--color-grey-800)] text-[var(--color-grey-50)] rounded-[var(--border-radius-lg)] shadow-[var(--shadow-md)] py-[3.2rem] px-[4rem] transition-all duration-500"
      >
        <button
          className="bg-none border-none p-[0.4rem] radius-[var(--border-radius-sm)] translate-x-[0.8rem] transition-all duration-200 absolute top-[1.2rem] right-[1.9rem] hover:bg[var(--color-grey-100)]"
          onClick={close}
        >
          <HiXMark />
        </button>
        <div>{cloneElement(children, { onCloseModal: close })}</div>
      </div>
    </div>,
    document.body
  );
}

Modal.Open = Open;
Modal.Window = Window;

export default Modal;
