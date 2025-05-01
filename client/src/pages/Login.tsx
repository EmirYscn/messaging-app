import { useTranslation } from "react-i18next";
import LoginForm from "../ui/LoginForm";
import Logo from "../ui/Logo";

function Login() {
  const { t } = useTranslation("auth");
  return (
    <div
      className="
        min-h-screen
        grid grid-cols-[20rem] md:grid-cols-[36rem]
        place-content-center
        bg-[var(--color-grey-50)] text-[var(--color-grey-700)] 
        gap-8
      "
    >
      <Logo size="lg" />
      <header className="text-3xl font-semibold text-center">
        {t("loginTitle")}
      </header>
      <LoginForm />
    </div>
  );
}

export default Login;
