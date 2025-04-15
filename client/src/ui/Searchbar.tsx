import { useState } from "react";
import { FaArrowLeft, FaSearch } from "react-icons/fa";

function Searchbar() {
  const [searchValue, setSearchValue] = useState("");

  return (
    <div className="flex gap-4 items-center bg-[var(--color-grey-100)] px-4 py-1 rounded-2xl shadow-sm">
      <label htmlFor="searchbar">
        {searchValue ? <FaArrowLeft /> : <FaSearch />}
      </label>
      <input
        type="search"
        name="searchbar"
        id="searchbar"
        placeholder="Search..."
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        className="w-full focus:outline-none"
      />
    </div>
  );
}

export default Searchbar;
