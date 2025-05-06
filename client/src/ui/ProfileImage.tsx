import { useEffect, useRef, useState } from "react";
import { FaCamera } from "react-icons/fa";
import { useAvatarUpload } from "../hooks/useAvatarUpload";
import { useTranslation } from "react-i18next";

type ProfileImageProps = {
  children?: React.ReactNode;
  onClick?: () => void;
  imgSrc?: string | undefined | null;
  size?: "xs" | "sm" | "md" | "lg";
  context?: "header" | "settings" | "chats" | "group";
  setGroupImageFromFile?: (file: File) => void;
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
  setGroupImageFromFile,
}: ProfileImageProps) {
  const { t } = useTranslation("settings");
  const { t: tChat } = useTranslation("chats");
  const { updateAvatar, isLoading } = useAvatarUpload();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const sizeClass = sizeClasses[size];
  const [src, setSrc] = useState(imgSrc || "/default-profile-icon.png");

  const handleError = () => {
    setSrc("/default-profile-icon.png");
  };

  useEffect(() => {
    if (imgSrc) {
      setSrc(imgSrc);
    }
  }, [imgSrc]);

  const baseWrapper =
    "relative overflow-hidden rounded-full cursor-pointer transition duration-300 ease-in-out";
  const imageClass =
    "w-full h-full object-cover rounded-full transition duration-300 ease-in-out";
  const overlayBase =
    "absolute top-0 left-0 w-full h-full bg-black/50 text-white flex flex-col gap-2 items-center justify-center text-sm font-bold opacity-0 transition-opacity duration-300";
  const overlayVisible = context !== "header" ? "group-hover:opacity-100" : "";

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];

    if (file) {
      const formData = new FormData();
      formData.append("avatar", file);

      updateAvatar(formData);
    }
  }

  function handleImageClick() {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }

  function handleGroupImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setGroupImageFromFile?.(file);
    }
  }

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

  if (context === "group") {
    return (
      <div className="flex items-center gap-4 cursor-pointer group">
        <div className={`${baseWrapper} ${sizeClass}`} onClick={onClick}>
          <img src={src} onError={handleError} className={imageClass} />
          {isLoading && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40">
              <div className="w-6 h-6 border-2 border-white rounded-full border-t-transparent animate-spin"></div>
            </div>
          )}
          {context === "group" && (
            <div
              onClick={handleImageClick}
              className={`${overlayBase} ${overlayVisible}`}
            >
              <span>
                <FaCamera />
              </span>
              <span className="text-center max-w-11/12">
                {tChat("changeGroupImage")}
              </span>
            </div>
          )}
        </div>
        {context === "group" && (
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            accept="image/*"
            onChange={handleGroupImageUpload}
            disabled={isLoading}
          />
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4 cursor-pointer group">
      <div className={`${baseWrapper} ${sizeClass}`} onClick={onClick}>
        <img src={src} onError={handleError} className={imageClass} />
        {isLoading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40">
            <div className="w-6 h-6 border-2 border-white rounded-full border-t-transparent animate-spin"></div>
          </div>
        )}
        {context === "settings" && (
          <div
            onClick={handleImageClick}
            className={`${overlayBase} ${overlayVisible}`}
          >
            <span>
              <FaCamera />
            </span>
            <span className="text-center max-w-11/12">
              {t("changeProfilePicture")}
            </span>
          </div>
        )}
      </div>
      {context === "settings" && (
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          accept="image/*"
          onChange={handleAvatarUpload}
          disabled={isLoading}
        />
      )}
    </div>
  );
}

export default ProfileImage;
