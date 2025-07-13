import { useContinueWithThisAccount } from "../../hooks/useContinueWithThisAccount";
import { AccountStatus } from "../../services/apiAuth";
import { User } from "../../types/types";
import Button from "../Button";
import ProfileImage from "../ProfileImage";
import SpinnerMini from "../SpinnerMini";

function ContinueWithThisAccount({
  accounts,
}: {
  accounts: AccountStatus["accounts"];
}) {
  const { continueWithThisAccount, isPending: isLoading } =
    useContinueWithThisAccount();

  const handleContinue = () => {
    continueWithThisAccount({ user: accounts?.internalUser as User });
  };
  return (
    <>
      <div className="flex flex-col gap-4 items-center">
        <span className="text-xl font-semibold">Messaging App</span>
        <ProfileImage imgSrc={accounts?.internalUser?.avatar} />
        <span>{accounts?.internalUser?.username}</span>
      </div>
      <Button
        onClick={handleContinue}
        className="bg-[var(--color-brand-100)] hover:bg-[var(--color-brand-100)]/50"
      >
        {isLoading ? <SpinnerMini /> : "Continue with this account"}
      </Button>
    </>
  );
}

export default ContinueWithThisAccount;
