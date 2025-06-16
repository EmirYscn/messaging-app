import { RiInfoCardFill, RiRadioButtonLine } from "react-icons/ri";
import { User as UserType } from "../types/types";

import Menus from "./Menus";
import { IoPersonAdd } from "react-icons/io5";
import { BiSolidMessageSquareAdd } from "react-icons/bi";
import { useSocketActiveUsers } from "../hooks/sockets/useSocketActiveUsers";
import { useCreateChat } from "../hooks/useCreateChat";
import { useUser } from "../hooks/useUser";
import { useFriends } from "../hooks/useFriends";
import { useSendFriendRequest } from "../hooks/useSendFriendRequest";
import { useRemoveFriend } from "../hooks/useRemoveFriend";
import { useTranslation } from "react-i18next";
import Modal from "./Modal";
import UserProfileModal from "./UserProfileModal";

function ActiveUsersPanel() {
  const { t } = useTranslation("chats");
  const { activeUsers } = useSocketActiveUsers();

  return (
    <div className="hidden lg:block w-1/4 border-l-1 border-[var(--color-grey-100)]">
      <h1 className="p-4 mb-4 text-xl font-semibold">{t("activeUsers")}</h1>
      {activeUsers && activeUsers.length > 0 ? (
        <>
          {activeUsers.map((user) => (
            <User key={user.id} user={user} />
          ))}
        </>
      ) : (
        <div className="p-4 text-[var(--color-grey-300)]">
          {t("noActiveUsers")}
        </div>
      )}
    </div>
  );
}

export default ActiveUsersPanel;

function User({ user }: { user: UserType }) {
  const { t } = useTranslation("menus");
  const { t: tCommon } = useTranslation("common");
  const { user: loggedUser } = useUser();
  const { friends } = useFriends();
  const { createChat } = useCreateChat();
  const { sendRequest, isPending: isSendingRequest } = useSendFriendRequest();
  const { removeFriend, isLoading: isRemovingFriend } = useRemoveFriend();

  const currentUser = loggedUser?.id;

  const isFriend = friends?.some((friend) => friend.id === user.id);

  return (
    <Modal>
      <Menus>
        <Menus.Menu>
          <Menus.Toggle id={user?.id}>
            <div
              key={user.id}
              className={`flex items-center gap-2 text-sm font-semibold mb-2 ${
                user.id !== currentUser
                  ? "text-[var(--color-blue-700)]"
                  : "text-[var(--color-grey-300)]"
              }`}
            >
              <div className="text-green-400">
                <RiRadioButtonLine />
              </div>
              <span>{user.username}</span>
            </div>
          </Menus.Toggle>
          {user.id !== currentUser && (
            <>
              <Menus.List id={user?.id}>
                <Modal.Open opens="userInfo">
                  <Menus.Button icon={<RiInfoCardFill />}>
                    <span className="text-sm">{tCommon("userInfo")}</span>
                  </Menus.Button>
                </Modal.Open>
                {isFriend ? (
                  <Menus.Button
                    icon={<IoPersonAdd />}
                    onClick={() => removeFriend(user?.id)}
                    disabled={isRemovingFriend}
                  >
                    {t("removeFriend")}
                  </Menus.Button>
                ) : (
                  <Menus.Button
                    icon={<IoPersonAdd />}
                    onClick={() => sendRequest(user?.id)}
                    disabled={isSendingRequest}
                  >
                    {t("addFriend")}
                  </Menus.Button>
                )}
                <Menus.Button
                  icon={<BiSolidMessageSquareAdd />}
                  onClick={() => createChat(user.id)}
                >
                  {t("sendMessage")}
                </Menus.Button>
              </Menus.List>
              <Modal.Window name="userInfo" className="!p-0">
                <UserProfileModal userId={user.id} />
              </Modal.Window>
            </>
          )}
        </Menus.Menu>
      </Menus>
    </Modal>
  );
}
