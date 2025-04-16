import { useNavigate } from "react-router";
import { FaArrowCircleLeft } from "react-icons/fa";

type BackButtonProps = {
  posContext?: "post" | "settings";
  to?: string;
};

function BackButton({ posContext = "settings", to }: BackButtonProps) {
  const navigate = useNavigate();

  const baseClasses =
    "p-2 px-4 text-sm rounded-[6px] bg-none border-none absolute z-[1000] hover:bg-yellow-200/60";
  const positionClasses =
    posContext === "settings" ? "left-12 top-12" : "left-52 top-8";

  return (
    <button
      onClick={() => (to ? navigate(to) : navigate(-1))}
      className={`${baseClasses} ${positionClasses}`}
    >
      <FaArrowCircleLeft className="h-8 w-auto" />
    </button>
  );
}

export default BackButton;
