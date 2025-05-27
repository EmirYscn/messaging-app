function MessageSkeleton({ isCurrentUser }: { isCurrentUser: boolean }) {
  return (
    <div
      className={`flex gap-4 items-start animate-pulse ${
        isCurrentUser ? "self-end flex-row-reverse" : ""
      }`}
    >
      {/* Profile circle */}
      <div className="flex-shrink-0 w-8 h-8 bg-gray-300 rounded-full" />

      {/* Message bubble */}
      <div
        className={`relative rounded-2xl px-6 py-4 max-w-[12rem] md:max-w-[24rem] ${
          isCurrentUser ? "bg-blue-300" : "bg-gray-300"
        }`}
      >
        {/* Message Arrow */}
        <div
          className={`absolute top-2 w-0 h-0 border-t-[10px] border-b-[10px] border-t-transparent border-b-transparent ${
            isCurrentUser
              ? "-right-2 border-l-[10px] border-l-blue-300"
              : "-left-2 border-r-[10px] border-r-gray-300"
          }`}
        />
        <div className="w-24 h-4 mb-2 bg-gray-200 rounded" />
        <div className="w-16 h-3 bg-gray-200 rounded" />
      </div>
    </div>
  );
}

export default MessageSkeleton;
