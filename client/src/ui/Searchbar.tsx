import { FaSearch } from "react-icons/fa";

function Searchbar() {
  return (
    <div className="flex gap-4 items-center bg-red-500 px-4 py-1 rounded-2xl text-white">
      <label htmlFor="searchbar">
        <FaSearch />
      </label>
      <input
        type="search"
        name="searchbar"
        id="searchbar"
        placeholder="Search..."
        className="w-full focus:outline-none"
      />
    </div>
  );
}

export default Searchbar;
