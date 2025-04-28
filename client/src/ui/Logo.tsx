import { Link } from "react-router";

type LogoProps = {
  size?: "sm" | "md" | "lg";
};

function Logo({ size = "lg" }: LogoProps) {
  const sizeClasses = {
    sm: "h-20", // 5rem = 80px
    md: "h-28", // 7rem = 112px
    lg: "h-38", // 9.6rem ≈ 153.6px → rounded to h-38 (9.5rem = 152px)
  };

  const logo = {
    sm: "/logo-sm.svg",
    md: "/logo-md.svg",
    lg: "/logo-lg.svg",
  };

  const src = logo[size] || logo.lg;

  return (
    <div className="flex justify-center">
      <Link to="/">
        <img src={src} alt="Logo" className={`${sizeClasses[size]} w-auto`} />
      </Link>
    </div>
  );
}

export default Logo;
