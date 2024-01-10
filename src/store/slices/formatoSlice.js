import { createSlice } from "@reduxjs/toolkit";
import { getFormatos } from "./thunks/formatoThunks";

const initialState = {
  formatos: [],
  loading: false,
  error: "",
};
const formatoSlice = createSlice({
  name: "formatos",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(getFormatos.fulfilled, (state, action) => {
        state.loading = false;
        state.formatos = action.payload.formatos;
      })
      .addCase(getFormatos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});
const { reducer } = formatoSlice;
export default reducer;
