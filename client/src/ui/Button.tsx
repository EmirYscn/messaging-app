type ButtonProps = {
  size?: "small" | "medium" | "large";
  variation?:
    | "primary"
    | "secondary"
    | "danger"
    | "create"
    | "icon"
    | "login"
    | "logout"
    | "iconWithText"
    | "subscribe"
    | "tag"
    | "search"
    | "normal"
    | "action"
    | "readmore"
    | "saveDraft"
    | "publish";
  icon?: React.ReactNode;
  children?: React.ReactNode;
  onClick?: (() => void) | ((e: React.MouseEvent<HTMLButtonElement>) => void);
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
};

const sizeClasses: Record<NonNullable<ButtonProps["size"]>, string> = {
  small: "text-xs px-2 py-1 font-semibold uppercase text-center",
  medium: "text-sm px-4 py-3 font-medium",
  large: "text-2xl px-6 py-3 font-medium",
};

const variationClasses: Record<
  NonNullable<ButtonProps["variation"]>,
  string
> = {
  primary: "bg-brand-600 text-white hover:bg-brand-700",
  secondary: "text-grey-600 bg-grey-0 border border-grey-200 hover:bg-grey-50",
  danger: "bg-red-700 text-red-100 hover:bg-red-800",
  create: "bg-brand-600 text-white rounded-full [&>svg]:h-4 [&>svg]:w-auto",
  icon: "p-4 focus:outline-none",
  login: "rounded-md bg-[var(--color-brand-100)] hover:text-brand-600",
  logout: "rounded-md hover:text-brand-600",
  iconWithText: "rounded-md hover:text-brand-600 focus:outline-none",
  subscribe: "bg-brand-600 text-white border-0 rounded-r-md",
  tag: "border-2 border-brand-600 px-4 py-2 rounded-md transition hover:bg-brand-600 hover:text-white",
  search: "border-none p-2 focus:outline-none hover:text-red-500",
  normal: "rounded-md hover:text-brand-600",
  action: "rounded-md py-4 hover:text-brand-600 focus:outline-none",
  readmore: "rounded-md p-0 hover:text-brand-600 focus:outline-none",
  saveDraft: "bg-yellow-700 text-grey-50 px-3 py-2",
  publish: "bg-green-700 text-grey-50 px-3 py-2",
};

function Button({
  type = "button",
  size = "medium",
  variation = "icon",
  icon,
  children,
  onClick,
  disabled,
}: ButtonProps) {
  const baseClasses = `flex items-center gap-2 rounded-sm ${
    disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
  }`;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${sizeClasses[size]} ${variationClasses[variation]}`}
    >
      {icon}
      {children}
    </button>
  );
}

export default Button;
