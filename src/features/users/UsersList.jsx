import { useGetUsersQuery } from "./usersApiSlice";
import User from "./User";
import { HashLoader } from "react-spinners";
import Loader from "../../components/Loader";

const UsersList = () => {
  const {
    data: users,
    isLoading,
    isError,
    isSuccess,
    error,
  } = useGetUsersQuery("usersList", {
    pollingInterval: 60000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  let content;

  if (isLoading) content = <Loader />;
  if (isError) content = <p className="errmsg">{error?.data?.message}</p>;
  if (isSuccess) {
    const { ids } = users;
    const tableContent = ids?.length
      ? ids.map((userId) => <User key={userId} userId={userId} />)
      : null;
    content = (
      <table className="table table--users">
        <thead className="table__thead">
          <tr>
            <th className="table__th user__username" scope="col">
              UserName
            </th>
            <th className="table__th user__roles" scope="col">
              Roles
            </th>
            <th className="table__th user__edit" scope="col">
              Edit
            </th>
          </tr>
        </thead>
        <tbody>{tableContent}</tbody>
      </table>
    );
  }
  return content;
};

export default UsersList;
