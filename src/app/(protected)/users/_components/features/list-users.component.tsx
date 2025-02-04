import { DataTable } from "@/components/custom/data-table";
import { useGetAllClerkUsers } from "../../hooks/auth-service.hook";
import { columns } from "../ui/columns";
import LoadingSpinner from "@/components/custom/loading-spinner";
import FetchError from "@/components/custom/fetch-error";

export const ListUsers = () => {
  const { users, isLoading, isError, errorMessage } = useGetAllClerkUsers();

  if (isLoading) return <LoadingSpinner />;
  if (isError)
    return (
      <FetchError
        error={errorMessage}
        reset={() => {
          window.location.reload();
        }}
      />
    );

  return <DataTable data={users} columns={columns} dataLength={1000} />;
};
