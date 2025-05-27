function ChatSkeleton() {
  return (
    <div className="flex items-center gap-4 animate-pulse px-2 py-3 border-b-1 border-[var(--color-grey-300)]">
      {/* Profile image placeholder */}
      <div className="w-10 h-10 bg-gray-300 rounded-full" />

      {/* Chat info */}
      <div className="flex flex-col flex-1 gap-2 overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="w-24 h-4 bg-gray-300 rounded" />
          <div className="w-10 h-3 bg-gray-300 rounded" />
        </div>
        <div className="w-full h-3 bg-gray-300 rounded" />
      </div>
    </div>
  );
}

export default ChatSkeleton;
