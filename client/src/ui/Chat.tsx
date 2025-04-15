import { FaPlus } from "react-icons/fa6";
import { IoMdSend } from "react-icons/io";
import Messages from "./Messages";
import { useChat } from "../hooks/useChat";

function Chat() {
  //  1) use chat data for current chatId
  const { chat } = useChat();
  //  2) pass messages to Messages component

  //  3) handle sockets for send_message and receive_message

  //  4) handle send message
  //  5) handle receive message
  //  6) handle typing indicator
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b-2 border-[var(--color-grey-100)] flex items-center gap-4">
        <h2 className="text-4xl font-semibold ">{chat?.name}</h2>
      </div>
      <div className="overflow-y-auto grow">
        <Messages />
      </div>
      <div className="flex gap-4 items-center border-t-2 border-[var(--color-grey-100)] mb-[-1rem] md:mb-0 px-12 py-6">
        <button className="text-xl">
          <FaPlus />
        </button>
        <input
          type="text"
          className="w-full focus:outline-none bg-[var(--color-grey-100)] px-6 py-2 shadow-sm rounded-lg"
        />
        <button className="text-xl">
          <IoMdSend />
        </button>
      </div>
    </div>
  );
}

export default Chat;
