import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

const notesAdapter = createEntityAdapter({
  sortComparer: (a, b) =>
    a.completed === b.completed ? 0 : a.completed ? 1 : -1,
});

const initialState = notesAdapter.getInitialState();

export const notesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getNotes: builder.query({
      query: () => ({
        url: "/notes",
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),
      // keepUnusedDataFor: 5,
      transformResponse: (responseData) => {
        const loadedNotes = responseData?.map((note) => {
          note.id = note._id;
          return note;
        });
        return notesAdapter.setAll(initialState, loadedNotes);
      },
      providesTags: (result) => {
        if (result?.ids) {
          return [
            { type: "Note", id: "LIST" },
            ...result.ids.map((id) => ({ type: "Note", id })),
          ];
        }
        return [{ type: "Note", id: "LIST" }];
      },
    }),
    addNewNotes: builder.mutation({
      query: (initialNotesData) => ({
        url: "/notes",
        method: "POST",
        body: {
          ...initialNotesData,
        },
      }),
      invalidatesTags: [{ type: "Note", id: "LIST" }],
    }),
    updateNotes: builder.mutation({
      query: (initialNotesData) => ({
        url: "/notes",
        method: "PATCH",
        body: {
          ...initialNotesData,
        },
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: "Note", id: arg.id },
      ],
    }),
    deleteNotes: builder.mutation({
      query: ({ id }) => ({
        url: "/notes",
        method: "DELETE",
        body: { id },
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: "Note", id: arg.id },
      ],
    }),
  }),
});

export const {
  useGetNotesQuery,
  useAddNewNotesMutation,
  useUpdateNotesMutation,
  useDeleteNotesMutation,
} = notesApiSlice;

// returns the query result object
export const selectNoteResult = notesApiSlice.endpoints.getNotes.select();

// create memoized selector
const selectNotesData = createSelector(
  selectNoteResult,
  (notesResult) => notesResult.data
);

// getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
  selectAll: selectAllNotes,
  selectById: selectNoteById,
  selectIds: selectNoteIds,
} = notesAdapter.getSelectors(
  (state) => selectNotesData(state) ?? initialState
);
