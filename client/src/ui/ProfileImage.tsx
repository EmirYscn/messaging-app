type ProfileImageProps = {
  children?: React.ReactNode;
  onClick?: () => void;
  imgSrc: string | undefined | null;
  size?: "xs" | "sm" | "md" | "lg";
  context?: "header" | "settings";
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

  const baseWrapper =
    "relative overflow-hidden rounded-full cursor-pointer transition duration-300 ease-in-out";
  const imageClass =
    "w-full h-full object-cover rounded-full transition duration-300 ease-in-out";
  const overlayBase =
    "absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 text-white flex items-center justify-center text-sm font-bold opacity-0 transition-opacity duration-300";
  const overlayVisible = context !== "header" ? "group-hover:opacity-100" : "";

  return (
    <div className="flex items-center gap-4 cursor-pointer group">
      <div className={`${baseWrapper} ${sizeClass}`} onClick={onClick}>
        <img
          src={imgSrc || "/default-profile-icon.png"}
          alt="Profile"
          className={imageClass}
        />
        {context === "settings" && (
          <div className={`${overlayBase} ${overlayVisible}`}>Change</div>
        )}
      </div>
      {context === "settings" && children}
    </div>
  );
}

export default ProfileImage;
