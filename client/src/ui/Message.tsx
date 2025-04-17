import { useUser } from "../hooks/useUser";

function Message({ message }) {
  const { user } = useUser();
  return (
    <div
      className={`rounded-2xl px-4 py-2 w-max break-words max-w-[12rem] md:max-w-[24rem] bg-[var(--color-blue-100)] text-[var(--color-grey-800)] ${
        message.senderId === user?.id ? "self-end" : ""
      }`}
    >
      <span>{message.content}</span>
    </div>
  );
}

export default Message;
