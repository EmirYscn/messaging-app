import { Link } from "react-router";
import { useDarkMode } from "../contexts/DarkMode/ThemeContextProvider";

type LogoProps = {
  size?: "sm" | "md" | "lg";
};

function Logo({ size = "lg" }: LogoProps) {
  const { isDarkMode } = useDarkMode();
  const src = isDarkMode ? "/logo-dark.svg" : "/logo-light.svg";

  const sizeClasses = {
    sm: "h-20", // 5rem = 80px
    md: "h-28", // 7rem = 112px
    lg: "h-38", // 9.6rem ≈ 153.6px → rounded to h-38 (9.5rem = 152px)
  };

  return (
    <div className="flex justify-center">
      <Link to="/">
        <img src={src} alt="Logo" className={`${sizeClasses[size]} w-auto`} />
      </Link>
    </div>
  );
}

export default Logo;
