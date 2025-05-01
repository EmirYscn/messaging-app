import { useForm } from "react-hook-form";

import { SignupType } from "../services/apiAuth";

import Input from "./Input";
import Button from "./Button";
import FormRowVertical from "./FormRowVertical";
import SpinnerMini from "./SpinnerMini";

import { useSignup } from "../hooks/useSignup";
import { useTranslation } from "react-i18next";

function SignupForm() {
  const { t } = useTranslation("auth");
  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm<SignupType>();
  const { signup, isPending } = useSignup();

  function onSubmit({ email, username, password }: SignupType) {
    signup(
      { email, username, password },
      {
        onSettled: () => {
          reset();
        },
      }
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormRowVertical label={t("email")} formError={errors?.email?.message}>
        <Input
          type="email"
          id="email"
          // This makes this form better for password managers
          autoComplete="username"
          disabled={isPending}
          {...register("email", {
            required: "This field is required",
            pattern: {
              value: /\S+@\S+\.\S+/,
              message: "Please provide a valid email address",
            },
          })}
        />
      </FormRowVertical>
      <FormRowVertical
        label={t("username")}
        formError={errors?.username?.message}
      >
        <Input
          type="username"
          id="username"
          // This makes this form better for password managers
          autoComplete="username"
          disabled={isPending}
          {...register("username", { required: "This field is required" })}
        />
      </FormRowVertical>

      <FormRowVertical
        label={t("password")}
        formError={errors?.password?.message}
      >
        <Input
          type="password"
          id="password"
          autoComplete="current-password"
          disabled={isPending}
          {...register("password", {
            required: "This field is required",
            minLength: {
              value: 8,
              message: "Password needs a minimum of 8 characters",
            },
          })}
        />
      </FormRowVertical>
      <FormRowVertical
        label={t("confirmPassword")}
        formError={errors?.passwordConfirm?.message}
      >
        <Input
          type="password"
          id="passwordConfirm"
          disabled={isPending}
          {...register("passwordConfirm", {
            required: "This field is required",
            validate: (value) =>
              value === getValues().password || "Passwords need to match",
          })}
        />
      </FormRowVertical>

      <FormRowVertical>
        <Button type="submit" size="medium" variation="login">
          {!isPending ? t("signup") : <SpinnerMini />}
        </Button>
      </FormRowVertical>
    </form>
  );
}

export default SignupForm;
