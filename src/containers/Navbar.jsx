import { Link, useNavigate } from "react-router-dom";
import { Icons } from "../assets/icons";
import { useState } from "react";
import useAllProducts from "../hooks/query/useAllProducts";
import { useSelector } from "react-redux";
import { localStorageState } from "../redux/slice/localStorageSlice";
import useLoginCheck from "../hooks/auth/useLoginCheck";
import { getReq } from "../utils/api/api";
import OnClickOutside from "../lib/OnClickOutside";
import Toastify from "../lib/Toastify";
import { QueryClient } from "@tanstack/react-query";

const Navbar = () => {
  const navigate = useNavigate();
  const { cart } = useSelector(localStorageState);
  const { data: user } = useLoginCheck();
  const [searchList, setSearchList] = useState([]);
  const { data } = useAllProducts();
  const [searchText, setSearchText] = useState("");
  const [showUserInfo, setShowUserInfo] = useState(false);
  const [showClearAll, setShowClearAll] = useState(false);

  const queryClient = new QueryClient();

  const { ToastContainer, showErrorMessage } = Toastify();

  const callback = () => {
    setShowUserInfo(false);
  };

  const { ref } = OnClickOutside(callback);

  const handleLogout = async () => {
    try {
      await getReq("/auth/logout");
      navigate("/login");

      localStorage.removeItem("_cart");
      localStorage.removeItem("_wishlist");
      localStorage.removeItem("_cou");
      queryClient.clear();
      window.location.reload();
    } catch (error) {
      showErrorMessage({ message: error.message });
    }
  };

  const searchProducts = () => {
    if (!searchText) return;
    navigate(`/search?q=${searchText}`);
    setSearchList([]);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent default form submission behavior
      searchProducts();
    }
  };

  const handleSearch = (e) => {
    const { value } = e.target;
    setSearchText(value);

    if (!value) {
      setSearchList([]);
      setShowClearAll(false);

      return;
    }

    setShowClearAll(true);
    const findProduct = data.data.filter((product) => {
      return product.title.toLowerCase().includes(value.toLowerCase());
    });
    setSearchList(findProduct);
  };

  const resetSearch = () => {
    setSearchText("");
    setSearchList([]);
    setShowClearAll(false);
  };

  return (
    <>
      <section className="w-full flex justify-center  items-center gap-10 tablet:gap-5 px-8 tablet:px-4 h-full absolute z-10">
        {/* MARK: APP LOGO */}
        <div className="cursor-pointer">
          <Link to={`/`}>Commercify</Link>
        </div>

        {/* MARK: SEARCH BAR */}
        <div className="relative flex justify-between items-center border border-white  rounded-3xl w-1/2">
          <input
            type="text"
            value={searchText}
            spellCheck="false"
            autoComplete="off"
            placeholder="Search Products"
            className="bg-inherit px-5 py-2 w-full"
            onChange={handleSearch}
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
            <div className="absolute z-50 w-full top-full mt-1 bg-white text-black border border-black rounded-lg max-h-96 overflow-y-auto">
              {searchList.map((product, i, array) => {
                const { _id, title } = product;
                return (
                  <div
                    key={_id}
                    className={`${
                      array.length - 1 !== i ? "border-b border-black" : ""
                    } p-2 `}
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
        <div className="h-full relative flex flex-col items-center justify-center">
          <div
            ref={ref}
            className="flex justify-center items-center gap-[6px] cursor-pointer"
            onClick={() => setShowUserInfo((prev) => !prev)}
          >
            <p className="w-8">
              <img
                src={user.photo}
                loading="lazy"
                className="w-full rounded-full object-cover"
              />
            </p>
            <p>{user.name.split(" ")[0]}</p>
            <p className="text-xs">
              {showUserInfo ? (
                <Icons.upArrow className="" />
              ) : (
                <Icons.downArrow />
              )}
            </p>
          </div>
          {showUserInfo && (
            <div className="absolute z-10 top-full bg-white shadow-2xl shadow-slate-700 w-64 text-black">
              <Link to={`/user/orders`} onClick={() => setShowUserInfo(false)}>
                <p className="py-3 border-b px-4 cursor-pointer">My Orders</p>
              </Link>
              <Link to={`/wishlist`} onClick={() => setShowUserInfo(false)}>
                <p className="py-3 border-b px-4 cursor-pointer">Wishlist</p>
              </Link>
              <Link to={`/user`} onClick={() => setShowUserInfo(false)}>
                <p className="py-3 border-b px-4 cursor-pointer">Profile</p>
              </Link>
              <p
                className="py-3 border-b px-4 cursor-pointer"
                onClick={handleLogout}
              >
                Logout
              </p>
            </div>
          )}
        </div>

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
      <ToastContainer />
    </>
  );
};

export default Navbar;
