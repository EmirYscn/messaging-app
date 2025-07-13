import { IoSunny } from "react-icons/io5";
import { MdDarkMode } from "react-icons/md";

import { useDarkMode } from "../contexts/DarkMode/ThemeContextProvider";

function DarkModeToggle() {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <button onClick={toggleDarkMode}>
      {isDarkMode ? <MdDarkMode /> : <IoSunny />}
    </button>
  );
}

export default DarkModeToggle;
