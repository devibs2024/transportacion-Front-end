import { createSlice } from "@reduxjs/toolkit";
import { getEstados } from "./thunks/estadoThunks";

const initialState = {
  estados: [],
  loading: false,
  error: "",
};
const estadoSlice = createSlice({
  name: "estado",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(getEstados.fulfilled, (state, action) => {
        state.loading = false;
        state.estados = action.payload.estados;
      })
      .addCase(getEstados.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});
const { reducer } = estadoSlice;
export default reducer;
