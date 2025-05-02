import { Link } from "react-router";
import { usePublicChats } from "../hooks/usePublicChats";
import { useTranslation } from "react-i18next";

const chatPosClass: Record<number, string> = {
  1: "col-start-2 row-start-2 bg-gradient-to-br from-pink-400 to-red-500",
  2: "col-start-5 row-start-6 bg-gradient-to-br from-blue-400 to-indigo-600",
  3: "col-start-9 row-start-4 bg-gradient-to-br from-purple-400 to-violet-600",
};

function PublicChats() {
  const { t } = useTranslation("chats");
  const { publicChats } = usePublicChats();

  return (
    <div className="grid grid-cols-12 grid-rows-12 h-screen w-full gap-4 p-4 text-[var(--color-grey-100)] text-gray-300">
      {/* Channel 1 */}
      {publicChats?.map((chat, index) => {
        // Get the position of the chat
        const posClass = chatPosClass[index + 1];

        return (
          <Link
            to={`/chat/${chat.id}`}
            key={chat.id}
            className={`
        ${posClass} w-[100px] h-[100px] sm:w-[150px] sm:h-[150px] 
        bg-[var(--color-blue-700)] shadow-[var(--shadow-md)] rounded-full 
        flex items-center justify-center 
         text-sm sm:text-lg font-semibold hover:bg-amber-200 hover:scale-105 cursor-pointer border-2 border-[var(--color-green-700)]`}
          >
            {t(`${chat.name}`) || chat.name}
          </Link>
        );
      })}
    </div>
  );
}

export default PublicChats;
