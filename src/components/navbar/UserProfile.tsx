import useLoginCheck from "@/hooks/auth/useLoginCheck";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Icons from "@/assets/icons";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useTheme } from "@/providers/ThemeProvider";
import ReactIcons from "@/assets/icons";

const UserProfile = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  const { data: user } = useLoginCheck();
  const [showUserInfo, setShowUserInfo] = useState<Boolean>(false);

  const handleLogout = async () => {
    Cookies.remove("_use");
    navigate("/login");
    localStorage.removeItem("_cart");
    localStorage.removeItem("_wishlist");
    localStorage.removeItem("_cou");
    localStorage.removeItem("_add");
    localStorage.removeItem("_exra");
    queryClient.clear();
    window.location.reload();
  };
  return (
    <DropdownMenu onOpenChange={(open: Boolean) => setShowUserInfo(open)}>
      <DropdownMenuTrigger asChild>
        <div
          className="flex justify-center items-center gap-[6px] cursor-pointer"
          onClick={() => setShowUserInfo((prev) => !prev)}
        >
          <p className="w-8">
            <img
              src={user?.photo}
              loading="lazy"
              className="w-full rounded-full object-cover "
            />
          </p>
          <p className="mobile:hidden">{user?.name?.split(" ")[0]}</p>
          <p className="text-xs">
            {showUserInfo ? (
              <Icons.upArrow className="" />
            ) : (
              <Icons.downArrow />
            )}
          </p>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate(`/user/orders`)}>
          My Orders
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate(`/wishlist`)}>
          Wishlist
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate(`/user`)}>
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate(`/admin`)}>
          Admin
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleLogout()}>
          Logout
        </DropdownMenuItem>
        <DropdownMenuItem className="w-max">
          {theme === "light" && (
            <button className="" onClick={() => setTheme("dark")}>
              <ReactIcons.sun />
            </button>
          )}
          {theme === "dark" && (
            <button onClick={() => setTheme("light")}>
              <ReactIcons.moon />
            </button>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserProfile;
