import { IoSunny } from "react-icons/io5";
import { MdDarkMode } from "react-icons/md";

import { useDarkMode } from "../contexts/DarkMode/ThemeContextProvider";

// const StyledDarkModeToggle = styled.button<{ $isDarkMode?: boolean }>`
//   background: none;
//   outline: none;
//   padding: 0.5rem;
//   border: none;

//   &:active {
//     border: none;
//     outline: none;
//   }

//   &:focus {
//     outline: none;
//   }

//   & svg {
//     height: 2rem;
//     width: auto;
//     ${(props) =>
//       props.$isDarkMode &&
//       css`
//         color: white;
//       `}
//   }
// `;

function DarkModeToggle() {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <button onClick={toggleDarkMode}>
      {isDarkMode ? <MdDarkMode /> : <IoSunny />}
    </button>
  );
}

export default DarkModeToggle;
