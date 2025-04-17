import { Link } from "react-router";
import { usePublicChats } from "../hooks/usePublicChats";

const chatPos: Record<number, { col: number; row: number }> = {
  1: { col: 2, row: 2 },
  2: { col: 5, row: 6 },
  3: { col: 9, row: 4 },
};

function PublicChats() {
  const { publicChats } = usePublicChats();

  return (
    <div className="grid grid-cols-12 grid-rows-12 h-screen w-full gap-4 p-4 text-[var(--color-grey-100)]">
      {/* Channel 1 */}
      {publicChats?.map((chat, index) => {
        // Get the position of the chat
        const pos = chatPos[index + 1];
        const colStart = `col-start-${pos.col}`;
        const rowStart = `row-start-${pos.row}`;
        return (
          <Link
            to={`/chat/${chat.id}`}
            key={chat.id}
            className={`
        ${colStart} ${rowStart}
        w-[100px] h-[100px] sm:w-[150px] sm:h-[150px] 
        bg-[var(--color-blue-700)] shadow-2xl rounded-full 
        flex items-center justify-center 
         text-sm sm:text-lg font-semibold hover:bg-amber-200 hover:scale-105 cursor-pointer`}
          >
            {chat.name}
          </Link>
        );
      })}

      {/* <div
        className="
        col-start-2 row-start-2
        w-[100px] h-[100px] sm:w-[150px] sm:h-[150px] 
        bg-[var(--color-blue-700)] shadow-2xl rounded-full 
        flex items-center justify-center 
         text-sm sm:text-lg font-semibold hover:bg-amber-200 hover:scale-105 cursor-pointer"
      >
        Channel 1
      </div>

      <div
        className="
        col-start-5 row-start-6
        w-[100px] h-[100px] sm:w-[150px] sm:h-[150px] 
        bg-[var(--color-green-700)] shadow-2xl rounded-full 
        flex items-center justify-center 
         text-sm sm:text-lg font-semibold hover:bg-amber-200 hover:scale-105 cursor-pointer"
      >
        Channel 2
      </div>

      <div
        className="
        col-start-9 row-start-4
        w-[100px] h-[100px] sm:w-[150px] sm:h-[150px] 
        bg-[var(--color-indigo-700)] shadow-2xl rounded-full 
        flex items-center justify-center 
        text-sm sm:text-lg font-semibold hover:bg-amber-200 hover:scale-105 cursor-pointer"
      >
        Channel 3
      </div> */}
    </div>
  );
}

export default PublicChats;
