import { ERROR_MESSAGES, QUERY_KEYS, SUCCESS_MESSAGES } from "@/constants";
import { useCreateMutation } from "@/hooks/mutation-factory";
import { serviceFactory } from "@/services";
import {
  EditUserRole,
  GetUsersResponse,
  RegisterRequest,
} from "@/types/auth.type";
import { useQuery } from "@tanstack/react-query";

const authService = serviceFactory.getAuthService();

// Hook for fetching users
export const useGetAllClerkUsers = () => {
  const fetchUsers = useQuery<GetUsersResponse, Error>({
    queryKey: [QUERY_KEYS.CLERK_USERS],
    queryFn: () => authService.getAllClerkUsers(),
    gcTime: 1000 * 60 * 5,
    staleTime: 1000 * 60 * 5,
  });

  return {
    users: fetchUsers.data?.data || [],
    isLoading: fetchUsers.isLoading,
    isError: fetchUsers.isError,
    errorMessage: fetchUsers.error?.message,
    isFetching: fetchUsers.isFetching,
  };
};

// Hook for registering a user
export const useRegisterUser = () => {
  return useCreateMutation<RegisterRequest>({
    mutationFn: (data: RegisterRequest) => authService.registerUser(data),
    successMessage: SUCCESS_MESSAGES.REGISTER_USER,
    errorMessage: ERROR_MESSAGES.REGISTER_USER,
    invalidateKeys: [[QUERY_KEYS.CLERK_USERS]], // Invalidate user list after registration
  });
};
// Hook for updating user role
export const useUpdateUserRole = () => {
  return useCreateMutation<EditUserRole>({
    mutationFn: (data: EditUserRole) => authService.updateUserRole(data),
    successMessage: SUCCESS_MESSAGES.UPDATE_USER_ROLE,
    errorMessage: ERROR_MESSAGES.UPDATE_USER_ROLE,
    invalidateKeys: [[QUERY_KEYS.CLERK_USERS]], // Invalidate user list after role update
  });
};
