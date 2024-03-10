import { useQuery } from "@tanstack/react-query";
import { getAuthReq } from "../../utils/api/authApi";

const UseOAuthLogin = () => {
  const query = useQuery({
    queryKey: ["OAuthLogin"],
    queryFn: async () => await getAuthReq("/login/OAuth"),
    retry: 2,
  });
  return query;
};

export default UseOAuthLogin;
