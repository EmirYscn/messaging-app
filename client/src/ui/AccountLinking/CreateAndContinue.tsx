import { useTranslation } from "react-i18next";
import { useCreateAndContinueWithThisAccount } from "../../hooks/useCreateAndContinueWithThisAccount";
import { AccountStatus } from "../../services/apiAuth";
import { User } from "../../types/types";
import Button from "../Button";
import FormRowVertical from "../FormRowVertical";
import Input from "../Input";
import ProfileImage from "../ProfileImage";
import SpinnerMini from "../SpinnerMini";
import { useState } from "react";
import { useForm } from "react-hook-form";

function CreateAndContinue({
  accounts,
}: {
  accounts: AccountStatus["accounts"];
}) {
  const { t } = useTranslation("auth");
  const [isEnteringPassword, setIsEnteringPassword] = useState(false);
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<{ password: string; passwordConfirm: string }>();
  const { createAndContinue, isPending } =
    useCreateAndContinueWithThisAccount();

  const handleCreateAndContinue = () => {
    setIsEnteringPassword(true);
  };

  const onSubmit = ({
    password,
  }: {
    password: string;
    passwordConfirm: string;
  }) => {
    const user = accounts?.externalUser;
    const data: Partial<User> = {
      email: user?.email as string,
      avatar: user?.avatar,
      password,
      username: user?.username as string,
      mainAppUserId: user?.userId,
      mainAppUserProfileId: user?.profileId,
    };
    createAndContinue({ user: data });
  };

  return (
    <>
      {!isEnteringPassword && (
        <>
          <p>
            You do not have an account. Please create an account to continue.
          </p>
          <div className="flex flex-col gap-4 items-center">
            <span className="text-xl font-semibold">Odin Connect</span>
            <ProfileImage imgSrc={accounts?.externalUser?.avatar} />
            <span>{accounts?.externalUser?.username}</span>
          </div>
        </>
      )}
      {!isEnteringPassword && (
        <Button
          onClick={handleCreateAndContinue}
          className="bg-[var(--color-brand-100)] hover:bg-[var(--color-brand-100)]/50"
        >
          Continue with this account
        </Button>
      )}
      {isEnteringPassword && (
        <form className="w-100" onSubmit={handleSubmit(onSubmit)}>
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
          <Button
            type="submit"
            className="bg-[var(--color-brand-100)] hover:bg-[var(--color-brand-100)]/50"
          >
            {isPending ? <SpinnerMini /> : "Done"}
          </Button>
        </form>
      )}
    </>
  );
}

export default CreateAndContinue;
