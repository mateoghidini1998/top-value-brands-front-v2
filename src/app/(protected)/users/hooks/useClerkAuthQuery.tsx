import { useQuery } from "@tanstack/react-query";
import { getAllClerkUsers } from "../actions/get-users.action";
export const useClerkAuthQuery = () => {
  const getClerkUsers = useQuery({
    queryKey: ["clerk-users"],
    queryFn: () => getAllClerkUsers(),
    staleTime: 1000 * 60 * 5,
  });

  return {
    getClerkUsers,
  };
};
