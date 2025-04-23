import { useState } from "react";
import { Link } from "react-router";

import GoogleButton from "./GoogleButton";
import GitHubButton from "./GithubButton";
import FormRowVertical from "./FormRowVertical";
import Input from "./Input";
import Button from "./Button";
import { FormEvent } from "../types/types";
import { useLogin } from "../hooks/useLogin";
import SpinnerMini from "./SpinnerMini";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isPending } = useLogin();
  // const { isDarkMode } = useDarkMode();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email || !password) return;
    login(
      { email, password },
      {
        onSettled: () => {
          setEmail("");
          setPassword("");
        },
      }
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <FormRowVertical label="Email">
        <Input
          type="email"
          id="email"
          autoComplete="username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isPending}
        />
      </FormRowVertical>

      <FormRowVertical label="Password">
        <Input
          type="password"
          id="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isPending}
        />
      </FormRowVertical>

      <Link to="/forgotPassword">Forgot Password?</Link>

      <FormRowVertical>
        <GoogleButton />
        <GitHubButton />
      </FormRowVertical>

      <Link to="/signup">Don't have an account?</Link>
      <FormRowVertical>
        <Button
          type="submit"
          size="medium"
          variation="login"
          // className="px-5 py-2 rounded-lg  bg-[var(--color-grey-50)] text-[var(--color-grey-900)]"
        >
          {!isPending ? (
            <span className="text-gray-200">Log in</span>
          ) : (
            <SpinnerMini />
          )}
        </Button>
      </FormRowVertical>
    </form>
  );
}

export default LoginForm;
