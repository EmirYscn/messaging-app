import { useChatMessages } from "../hooks/useChatMessages";
import Message from "./Message";

function Messages() {
  const { messages } = useChatMessages();

  return (
    <div className="flex flex-col gap-4 bg-[var(--color-grey-50)] text-gray-900 p-4">
      {messages.map((message) => (
        <Message key={message.id} message={message} />
      ))}
    </div>
  );
}

export default Messages;
