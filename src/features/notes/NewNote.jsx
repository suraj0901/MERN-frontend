import NewNoteForm from "./NewNoteForm";
import { useGetUsersQuery } from "../users/usersApiSlice";
import Loader from "../../components/Loader";

const NewNote = () => {
  const { users } = useGetUsersQuery("usersList", {
    selectFromResult: ({ data }) => ({
      users: data?.ids.map((id) => data?.entities?.[id]),
    }),
  });
  if (!users?.length) return <Loader />;
  const content = <NewNoteForm users={users} />;
  return content;
};

export default NewNote;
