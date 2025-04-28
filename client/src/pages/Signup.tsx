import Logo from "../ui/Logo";

import SignupForm from "../ui/SignupForm";

function Signup() {
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
        Create an account
      </header>
      <SignupForm />
    </div>
  );
}

export default Signup;
