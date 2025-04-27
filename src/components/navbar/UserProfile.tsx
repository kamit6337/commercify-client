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

const UserProfile = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: user } = useLoginCheck();
  const [showUserInfo, setShowUserInfo] = useState(false);

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
    <DropdownMenu onOpenChange={(open) => setShowUserInfo(open)}>
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
        <DropdownMenuItem onClick={() => handleLogout()}>
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserProfile;
