import Cookies from "js-cookie";

const getAuthToken = () => {
  const token = Cookies.get("_use") 
  return token;
};

export default getAuthToken;
