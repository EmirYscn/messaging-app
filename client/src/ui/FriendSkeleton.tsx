function FriendSkeleton({
  variation = "friends",
}: {
  variation?: "sent" | "received" | "friends";
}) {
  const variations = {
    sent: "bg-blue-300",
    received: "bg-red-400/60",
    friends: "bg-gray-300/60",
  };

  return (
    <div className="flex items-center gap-2 px-4 py-2 border-b border-gray-300 animate-pulse">
      {/* Profile image placeholder */}
      <div className={`w-10 h-10 rounded-full ${variations[variation]}`} />

      {/* Username placeholder */}
      <div className="flex-1">
        <div className={`h-5 rounded ${variations[variation]}`} />
      </div>
    </div>
  );
}

export default FriendSkeleton;
