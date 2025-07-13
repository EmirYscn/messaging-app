import { MdOutlineLink } from "react-icons/md";
import Button from "../Button";
import ProfileImage from "../ProfileImage";
import { AccountStatus, ExternalUser } from "../../services/apiAuth";
import { useLinkAccounts } from "../../hooks/useLinkAccounts";
import { User } from "../../types/types";
import SpinnerMini from "../SpinnerMini";
import { useNavigate } from "react-router";

function LinkAccounts({
  accounts,
  redirectLink,
}: {
  accounts: AccountStatus["accounts"];
  redirectLink?: string | null;
}) {
  const {
    linkAccounts,
    isPending: isLinkingAccounts,
    error,
  } = useLinkAccounts();
  const navigate = useNavigate();

  const handleLinkingAccounts = async () => {
    const data = {
      externalUser: accounts?.externalUser as ExternalUser,
      internalUser: accounts?.internalUser as User,
    };
    linkAccounts(data);
  };

  return (
    <>
      <p>You have an account but it is not linked. Please link your account.</p>
      <div className="flex items-center gap-6">
        <div className="flex flex-col gap-4 items-center">
          <span className="text-xl font-semibold">Odin Connect</span>
          <ProfileImage imgSrc={accounts?.externalUser.avatar} />
          <span>{accounts?.externalUser.username}</span>
        </div>
        <div>
          <span className="text-2xl">
            <MdOutlineLink />
          </span>
        </div>
        <div className="flex flex-col gap-4 items-center">
          <span className="text-xl font-semibold">Messaging App</span>

          <ProfileImage imgSrc={accounts?.internalUser?.avatar} />
          <span>{accounts?.internalUser?.username}</span>
        </div>
      </div>
      <span className="text-sm text-gray-500">Is this your account?</span>
      {error ? (
        <Button
          onClick={() =>
            navigate(`/login?redirect=${redirectLink || ""}`, { replace: true })
          }
          className="bg-[var(--color-brand-100)] hover:bg-[var(--color-brand-100)]/50"
        >
          Continue to login
        </Button>
      ) : (
        <Button
          onClick={handleLinkingAccounts}
          className="bg-[var(--color-brand-100)] hover:bg-[var(--color-brand-100)]/50"
        >
          {isLinkingAccounts ? <SpinnerMini /> : "Link Accounts"}
        </Button>
      )}
    </>
  );
}

export default LinkAccounts;
