import { useEffect } from "react";

export type ContextMenuPosition = { x: number; y: number } | null;

export type ContextMenuItem = {
  key: string;
  label: string;
  onClick: () => void;
};

type ContextMenuProps = {
  position: ContextMenuPosition;
  setPosition: React.Dispatch<React.SetStateAction<ContextMenuPosition>>;
  items: ContextMenuItem[];
};

export default function ContextMenu({
  position,
  setPosition,
  items,
}: ContextMenuProps) {
  useEffect(() => {
    const handleClick = () => setPosition(null);
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, [setPosition]);

  if (!position) return null;

  return (
    <ul
      className="fixed z-50 w-40 bg-[var(--color-brand-100)]/85 rounded-md shadow-lg text-sm text-white [&_li]:cursor-pointer [&_li]:hover:bg-white/10"
      style={{ top: position.y, left: position.x }}
      onClick={() => setPosition(null)}
    >
      {items.map((item) => (
        <li
          key={item.key}
          className="px-4 py-2"
          onClick={(e) => {
            e.stopPropagation();
            item.onClick();
            setPosition(null);
          }}
        >
          {item.label}
        </li>
      ))}
    </ul>
  );
}
