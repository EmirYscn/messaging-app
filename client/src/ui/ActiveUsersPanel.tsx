import { RiRadioButtonLine } from "react-icons/ri";
import { User } from "../types/types";

function ActiveUsersPanel({ activeUsers }: { activeUsers: User[] | null }) {
  return (
    <div className="hidden lg:block w-1/4 border-l-1 border-[var(--color-grey-100)] bg-[var(--color-grey-50)] p-4">
      <h1 className="text-xl font-semibold mb-4">Active Users</h1>
      {activeUsers && activeUsers.length > 0 ? (
        <div>
          {activeUsers.map((user) => (
            <div
              key={user.id}
              className="flex items-center gap-2 text-sm font-semibold mb-2"
            >
              <div className="text-green-400">
                <RiRadioButtonLine />
              </div>
              <span>{user.username}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-[var(--color-grey-300)]">No active users</div>
      )}
    </div>
  );
}

export default ActiveUsersPanel;
