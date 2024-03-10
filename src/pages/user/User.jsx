import { useQuery } from "@tanstack/react-query";
import { getReq } from "../../utils/api/api";
import Loading from "../../containers/Loading";
import FullPageError from "../../components/FullPageError";
import { Images } from "../../assets/images/index";
import { useNavigate } from "react-router-dom";

const User = () => {
  const navigate = useNavigate();

  const { isLoading, isError, error, data } = useQuery({
    queryKey: ["user"],
    queryFn: () => getReq("/user"),
  });

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <FullPageError errMsg={error.message} />;
  }

  const { name, email, mobile, photo, address } = data.data.data;

  const handleLogout = async () => {
    try {
      await getReq("/auth/logout");

      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="h-5/6 w-1/3 border border-black p-6 rounded-xl flex flex-col justify-between">
      <div className="flex flex-col gap-8">
        <div className="flex justify-start gap-12 items-center">
          <div className="w-28 rounded-full">
            <img
              src={photo || Images.dummyProfile}
              alt="profile"
              className="w-full rounded-full"
            />
          </div>
          <p className="text-3xl font-semibold tracking-wide">{name}</p>
        </div>
        <div>
          <p>{email}</p>
          <p>{mobile}</p>
          <p>
            {address.length > 0
              ? "Address present"
              : "Address is not available"}
          </p>
        </div>
      </div>

      <p
        className="w-full p-3 cursor-pointer rounded-lg border border-gray-400 text-lg font-semibold text-center"
        onClick={handleLogout}
      >
        Logout
      </p>
    </div>
  );
};

export default User;
