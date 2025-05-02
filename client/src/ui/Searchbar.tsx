import { t } from "i18next";
import { FaArrowLeft, FaSearch } from "react-icons/fa";

type SearchbarProps = {
  placeholder?: string;
  searchValue?: string;
  setSearchValue?: (value: string) => void;
};

function Searchbar({
  placeholder = t("search"),
  searchValue,
  setSearchValue,
}: SearchbarProps) {
  return (
    <div className="flex gap-4 items-center bg-[var(--color-grey-100)] px-4 py-1 rounded-lg shadow-sm">
      <label
        htmlFor="searchbar"
        className="cursor-pointer text-[var(--color-grey-400)]"
      >
        {searchValue ? <FaArrowLeft /> : <FaSearch />}
      </label>
      <input
        type="search"
        name="searchbar"
        id="searchbar"
        placeholder={placeholder}
        value={searchValue}
        onChange={(e) => setSearchValue?.(e.target.value)}
        className="w-full focus:outline-none"
        autoComplete="off"
      />
    </div>
  );
}

export default Searchbar;
