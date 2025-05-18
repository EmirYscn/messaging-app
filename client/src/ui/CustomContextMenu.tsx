import { useState } from "react";

export default function CustomContextMenu() {
  const [menuPosition, setMenuPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault(); // disable browser context menu
    setMenuPosition({ x: event.pageX, y: event.pageY });
  };

  const handleClose = () => {
    setMenuPosition(null);
  };

  return (
    <div className="relative w-full h-screen" onClick={handleClose}>
      <img
        src="https://via.placeholder.com/150"
        alt="Right click me"
        onContextMenu={handleContextMenu}
        className="mx-auto mt-20 rounded shadow cursor-pointer"
      />

      {/* Custom context menu */}
      {menuPosition && (
        <ul
          className="absolute z-50 bg-white shadow-lg border rounded py-2 w-40"
          style={{ top: menuPosition.y, left: menuPosition.x }}
        >
          <li
            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
            onClick={() => {
              alert("Option 1 clicked");
              handleClose();
            }}
          >
            Option 1
          </li>
          <li
            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
            onClick={() => {
              alert("Option 2 clicked");
              handleClose();
            }}
          >
            Option 2
          </li>
        </ul>
      )}
    </div>
  );
}
