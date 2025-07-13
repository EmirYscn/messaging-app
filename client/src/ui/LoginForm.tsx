import { useState } from "react";
import { Link, useSearchParams } from "react-router";

import GoogleButton from "./GoogleButton";
import GitHubButton from "./GithubButton";
import FormRowVertical from "./FormRowVertical";
import Input from "./Input";
import Button from "./Button";
import { FormEvent } from "../types/types";
import { useLogin } from "../hooks/useLogin";
import SpinnerMini from "./SpinnerMini";
import { useTranslation } from "react-i18next";

function LoginForm() {
  const { t } = useTranslation("auth");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [searchParams] = useSearchParams();
  const redirectUrl = searchParams.get("redirect");
  const { login, isPending } = useLogin(redirectUrl, true);

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
      <FormRowVertical label={t("email")}>
        <Input
          type="email"
          id="email"
          autoComplete="username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isPending}
        />
      </FormRowVertical>

      <FormRowVertical label={t("password")}>
        <Input
          type="password"
          id="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isPending}
        />
      </FormRowVertical>

      {/* <Link to="/forgotPassword">{t("forgotPassword")}</Link> */}

      <FormRowVertical>
        <GoogleButton redirectUrl={redirectUrl} />
        <GitHubButton redirectUrl={redirectUrl} />
      </FormRowVertical>

      <Link to="/signup">{t("dontHaveAnAccount")}</Link>
      <FormRowVertical>
        <Button
          type="submit"
          size="medium"
          variation="login"
          // className="px-5 py-2 rounded-lg  bg-[var(--color-grey-50)] text-[var(--color-grey-900)]"
        >
          {!isPending ? (
            <span className="text-gray-200">{t("loginButton")}</span>
          ) : (
            <SpinnerMini />
          )}
        </Button>
      </FormRowVertical>
    </form>
  );
}

export default LoginForm;
