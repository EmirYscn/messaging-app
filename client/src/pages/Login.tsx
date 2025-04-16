// import Logo from "../ui/Logo";
// import Heading from "../ui/Heading";
import LoginForm from "../ui/LoginForm";
import Logo from "../ui/Logo";

function Login() {
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
      <Logo size="md" />
      <header className="text-3xl font-semibold text-center">
        Log in to your account
      </header>
      <LoginForm />
    </div>
  );
}

export default Login;
