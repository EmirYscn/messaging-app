import PublicChats from "../ui/PublicChats";

function Home() {
  return (
    <div className="p-4 flex flex-col gap-4 h-full">
      <h1 className="text-4xl font-semibold">Public Chats</h1>
      <PublicChats />
    </div>
  );
}

export default Home;
