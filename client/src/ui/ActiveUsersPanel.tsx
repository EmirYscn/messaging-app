import { RiRadioButtonLine } from "react-icons/ri";

import Menus from "./Menus";
import { IoPersonAdd } from "react-icons/io5";
import { BiSolidMessageSquareAdd } from "react-icons/bi";
import { useSocketActiveUsers } from "../hooks/useSocketActiveUsers";
import { useCreateChat } from "../hooks/useCreateChat";
import { useUser } from "../hooks/useUser";

function ActiveUsersPanel() {
  const { user } = useUser();
  const { activeUsers } = useSocketActiveUsers();
  const { createChat } = useCreateChat();

  const currentUser = user?.id;

  return (
    <div className="hidden lg:block w-1/4 border-l-1 border-[var(--color-grey-100)] bg-[var(--color-grey-50)]">
      <h1 className="p-4 text-xl font-semibold mb-4">Active Users</h1>
      {activeUsers && activeUsers.length > 0 ? (
        <>
          {activeUsers.map((user) => (
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
                  <Menus.List id={user?.id}>
                    <Menus.Button icon={<IoPersonAdd />}>
                      Add Friend
                    </Menus.Button>
                    <Menus.Button
                      icon={<BiSolidMessageSquareAdd />}
                      onClick={() => createChat(user.id)}
                    >
                      Send Message
                    </Menus.Button>
                  </Menus.List>
                )}
              </Menus.Menu>
            </Menus>
          ))}
        </>
      ) : (
        <div className="p-4 text-[var(--color-grey-300)]">No active users</div>
      )}
    </div>
  );
}

export default ActiveUsersPanel;
