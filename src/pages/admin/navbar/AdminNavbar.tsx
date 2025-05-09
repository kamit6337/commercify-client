import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import useSearchProducts from "@/hooks/products/useSearchProducts";
import useDebounce from "@/hooks/general/useDebounce";
import Icons from "@/assets/icons";
import UserProfile from "@/components/navbar/UserProfile";
import UserCountry from "@/components/navbar/UserCountry";
import Toastify from "@/lib/Toastify";
import CustomImages from "@/assets/images";

const AdminNavbar = () => {
  const navigate = useNavigate();
  const [showClearAll, setShowClearAll] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchList, setSearchList] = useState([]);
  const { error, data, refetch } = useSearchProducts(searchText);

  const debouncedSearch = useDebounce(() => {
    refetch();
  }, 500);

  const { showErrorMessage } = Toastify();

  useEffect(() => {
    if (data) {
      setSearchList(data);
    }
  }, [data]);

  useEffect(() => {
    if (error) {
      showErrorMessage({ message: error.message });
    }
  }, [error]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent default form submission behavior
      const query = e.currentTarget.value;
      navigate(`/search?q=${query}`);
      setSearchList([]);
    }
  };

  const handleChange = (value: string) => {
    if (!value) {
      setSearchText("");
      setSearchList([]);
      setShowClearAll(false);
      return;
    }
    setShowClearAll(true);
    setSearchText(value);
    debouncedSearch();
  };

  const resetSearch = () => {
    setSearchText("");
    setSearchList([]);
    setShowClearAll(false);
  };

  return (
    <section className="w-full flex justify-between items-center gap-5 h-full">
      {/* MARK: APP LOGO */}
      <Link to={`/`} className="hidden lg:flex">
        <div className="cursor-pointer w-40">
          <img src={CustomImages.logo} className="w-full object-cover" />
        </div>
      </Link>

      <Link to={`/`} className="lg:hidden">
        <div className="cursor-pointer w-10">
          <img src={CustomImages.smallLogo} className="w-full object-cover" />
        </div>
      </Link>

      {/* MARK: SEARCH BAR */}
      <div className="flex-1 relative flex justify-between items-center border-2  rounded-full">
        <input
          type="text"
          value={searchText}
          spellCheck="false"
          autoComplete="off"
          placeholder="Search Products"
          className="bg-inherit px-5 py-2 w-full border-none outline-none"
          onChange={(e) => handleChange(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        {showClearAll ? (
          <p
            className="px-5 py-2 flex justify-center items-center cursor-pointer whitespace-nowrap text-xs"
            onClick={resetSearch}
          >
            Clear All
          </p>
        ) : (
          <p className="px-5 py-2 flex justify-center items-center">
            <Icons.search className="text-xl text-gray-400" />
          </p>
        )}
        {searchList.length > 0 && (
          <div className="absolute z-50 w-full top-full mt-1 border-2 rounded-lg max-h-96 overflow-y-auto bg-background">
            {searchList.map((product) => {
              const { _id, title } = product;
              return (
                <div key={_id} className={` p-2 border-b last:border-none  `}>
                  <Link to={`/products/${_id}`} onClick={resetSearch}>
                    {title}
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* MARK: USER PROFILE */}
      <UserCountry />
      <UserProfile />
    </section>
  );
};

export default AdminNavbar;
