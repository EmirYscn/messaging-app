function UserProfileCardSkeleton() {
  return (
    <div className="w-[20rem] md:w-[30rem] h-[30rem] flex flex-col rounded-lg animate-pulse">
      <div className="relative w-full h-50 bg-gray-300 rounded-t-lg" />

      <div className="w-full flex items-center gap-4 absolute bottom-4 px-4">
        <div className="w-10 h-10 rounded-full bg-gray-400" />
        <div className="h-4 w-24 bg-gray-400 rounded" />
        <div className="ml-auto flex gap-2">
          <div className="h-8 w-8 bg-gray-400 rounded" />
          <div className="h-8 w-8 bg-gray-400 rounded" />
        </div>
      </div>

      <div className="grow p-4 bg-gray-100 rounded-b-lg">
        <div className="h-4 w-1/2 bg-gray-300 rounded" />
        <div className="mt-2 h-4 w-1/3 bg-gray-300 rounded" />
      </div>
    </div>
  );
}

export default UserProfileCardSkeleton;
