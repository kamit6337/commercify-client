import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Toastify from "../lib/Toastify";
import CustomImages from "../assets/images";
import { cartAndWishlistState } from "@/redux/slice/cartAndWishlistSlice";
import useSearchProducts from "@/hooks/products/useSearchProducts";
import useDebounce from "@/hooks/general/useDebounce";
import Icons from "@/assets/icons";
import UserProfile from "@/components/navbar/UserProfile";
import UserCountry from "@/components/navbar/UserCountry";

const Navbar = () => {
  const navigate = useNavigate();
  const { cart } = useSelector(cartAndWishlistState);

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
    <section className="w-full flex justify-between items-center px-40 gap-5 h-full absolute z-10 ">
      {/* MARK: APP LOGO */}
      <Link to={`/`} className="tablet:hidden">
        <div className="cursor-pointer w-40">
          <img src={CustomImages.logo} className="w-full object-cover" />
        </div>
      </Link>

      <Link to={`/`} className="hidden tablet:flex">
        <div className="cursor-pointer w-10">
          <img src={CustomImages.smallLogo} className="w-full object-cover" />
        </div>
      </Link>

      {/* MARK: SEARCH BAR */}
      <div className="flex-1 relative flex justify-between items-center border border-white  rounded-3xl">
        <input
          type="text"
          value={searchText}
          spellCheck="false"
          autoComplete="off"
          placeholder="Search Products"
          className="bg-inherit px-5 py-2 w-full"
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
            <Icons.search className="text-xl" />
          </p>
        )}
        {searchList.length > 0 && (
          <div className="absolute z-50 w-full top-full mt-1 border border-black rounded-lg max-h-96 overflow-y-auto">
            {searchList.map((product) => {
              const { _id, title } = product;
              return (
                <div
                  key={_id}
                  className={` p-2 border-b border-black last:border-none  `}
                >
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

      {/* MARK: CART */}
      <Link to={`/cart`}>
        <div className="flex gap-1">
          <div className="relative cursor-pointer">
            <Icons.cart className="text-2xl" />
            <p className="absolute z-50 bottom-full right-0 text-xs -mb-1 mr-[6px]">
              {cart.length}
            </p>
          </div>
          <p className="tracking-wide">Cart</p>
        </div>
      </Link>
    </section>
  );
};

export default Navbar;
