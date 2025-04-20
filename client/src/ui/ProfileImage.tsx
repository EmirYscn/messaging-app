import { useState } from "react";
import { FaCamera } from "react-icons/fa";

type ProfileImageProps = {
  children?: React.ReactNode;
  onClick?: () => void;
  imgSrc?: string | undefined | null;
  size?: "xs" | "sm" | "md" | "lg";
  context?: "header" | "settings" | "chats";
};

const sizeClasses = {
  xs: "w-8 h-8", // 2rem
  sm: "w-12 h-12", // 3rem
  md: "w-20 h-20", // 5rem
  lg: "w-40 h-40", // 10rem
};

function ProfileImage({
  imgSrc,
  size = "lg",
  children,
  context,
  onClick,
}: ProfileImageProps) {
  const sizeClass = sizeClasses[size];
  const [src, setSrc] = useState(imgSrc || "/default-profile-icon.png");

  const handleError = () => {
    setSrc("/default-profile-icon.png");
  };

  const baseWrapper =
    "relative overflow-hidden rounded-full cursor-pointer transition duration-300 ease-in-out";
  const imageClass =
    "w-full h-full object-cover rounded-full transition duration-300 ease-in-out";
  const overlayBase =
    "absolute top-0 left-0 w-full h-full bg-black/50 text-white flex flex-col gap-2 items-center justify-center text-sm font-bold opacity-0 transition-opacity duration-300";
  const overlayVisible = context !== "header" ? "group-hover:opacity-100" : "";

  if (context === "chats") {
    return (
      <div className="flex items-center justify-center gap-4 cursor-pointer group">
        <div
          className={`${baseWrapper} ${sizeClass} flex items-center justify-center text-2xl `}
          onClick={onClick}
        >
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4 cursor-pointer group">
      <div className={`${baseWrapper} ${sizeClass}`} onClick={onClick}>
        <img src={src} onError={handleError} className={imageClass} />
        {context === "settings" && (
          <div className={`${overlayBase} ${overlayVisible}`}>
            <span>
              <FaCamera />
            </span>
            <span className="max-w-11/12 text-center">
              Change Profile Picture
            </span>
          </div>
        )}
      </div>
      {context === "settings" && children}
    </div>
  );
}

export default ProfileImage;
