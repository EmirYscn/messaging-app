import Searchbar from "./Searchbar";

function Chats({ onToggleChats }) {
  return (
    <div className=" p-4 flex flex-col gap-4 h-full">
      <div className="flex justify-between items-center">
        <h2 className="text-4xl font-semibold mb-4">Chats</h2>
        <button className="md:hidden" onClick={onToggleChats}>
          Close
        </button>
      </div>
      <Searchbar />
      <div>
        <p className="text-sm">Chat 1</p>
        <p className="text-sm">Chat 2</p>
        <p className="text-sm">Chat 3</p>
      </div>
    </div>
  );
}

export default Chats;
