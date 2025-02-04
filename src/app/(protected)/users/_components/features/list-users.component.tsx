import { DataTable } from "@/components/custom/data-table";
import { useGetAllClerkUsers } from "../../hooks/auth-service.hook";
import { columns } from "../ui/columns";

export const ListUsers = () => {
  const { users } = useGetAllClerkUsers();

  return <DataTable data={users} columns={columns} dataLength={1000} />;
};
