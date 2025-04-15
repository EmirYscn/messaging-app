function Message({ message }) {
  const userId = "1dc8fd28-595c-4350-ab9b-405ba6fd9f63";
  return (
    <div
      className={`rounded-2xl px-4 py-2 w-max break-words max-w-[12rem] md:max-w-[24rem]  bg-amber-200 ${
        message.senderId === userId ? "self-end" : ""
      }`}
    >
      <span>{message.content}</span>
    </div>
  );
}

export default Message;
