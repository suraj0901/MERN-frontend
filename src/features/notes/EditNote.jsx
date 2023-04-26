import { useParams } from "react-router-dom";
import { useGetNotesQuery } from "./notesApiSlice";
import { useGetUsersQuery } from "../users/usersApiSlice";
import EditNoteForm from "./EditNoteForm";
import useAuth from "../../hooks/useAuth";
import Loader from "../../components/Loader";

const EditNote = () => {
  const { id } = useParams();
  const { username, isAdmin, isManager } = useAuth();
  const { note } = useGetNotesQuery("notesList", {
    selectFromResult: ({ data }) => ({
      note: data?.entities?.[id],
    }),
  });
  const { users } = useGetUsersQuery("userList", {
    selectFromResult: ({ data }) => ({
      users: data?.ids.map((id) => data?.entities?.[id]),
    }),
  });

  if (!note || !users?.length) return <Loader />;

  if (!isManager && !isAdmin) {
    if (note.username !== username) {
      return <p className="errmsg">No access</p>;
    }
  }
  const content = <EditNoteForm note={note} users={users} />;
  return content;
};

export default EditNote;
