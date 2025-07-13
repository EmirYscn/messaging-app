import Logo from "../ui/Logo";
import SpinnerMini from "../ui/SpinnerMini";
import LinkAccounts from "../ui/AccountLinking/LinkAccounts";
import ContinueWithThisAccount from "../ui/AccountLinking/ContinueWithThisAccount";
import { useUser } from "../hooks/useUser";
import CreateAndContinue from "../ui/AccountLinking/CreateAndContinue";
import { useCheckAccountStatus } from "../hooks/useCheckAccountStatus";

function CheckAccountStatus() {
  const { user } = useUser();
  const { status, accounts, isLoading, encodedData } = useCheckAccountStatus();

  const isSameUser = user?.id === accounts?.internalUser?.id;

  return (
    <div
      className="
        min-h-screen
        flex flex-col items-center justify-center
        bg-[var(--color-grey-50)] text-[var(--color-grey-700)] 
        gap-8
      "
    >
      <Logo size="lg" />
      {isLoading && <SpinnerMini />}

      {status === "linked" && (!user || !isSameUser) ? (
        <ContinueWithThisAccount accounts={accounts} />
      ) : null}

      {status === "not_linked" && (
        <LinkAccounts
          accounts={accounts}
          redirectLink={`checkAccountStatus?data=${encodedData}`}
        />
      )}
      {status === "not_found" && <CreateAndContinue accounts={accounts} />}
    </div>
  );
}

export default CheckAccountStatus;
