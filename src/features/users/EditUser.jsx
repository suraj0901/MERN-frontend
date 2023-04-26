import { useParams } from "react-router-dom";
import EditUserForm from "./EditUserForm";
import { useGetUsersQuery } from "./usersApiSlice";
import Loader from "../../components/Loader";

const EditUser = () => {
  const { id } = useParams();
  const { user } = useGetUsersQuery("usersList", {
    selectFromResult: ({ data }) => ({
      user: data?.entities?.[id],
    }),
  });

  if (!user) return <Loader />;

  const content = <EditUserForm user={user} />;
  return content;
};

export default EditUser;
