import { createSlice } from "@reduxjs/toolkit";
import { getZona } from "./thunks/ZonaThunks";

const initialState = {
  zona: [],
  loading: false,
  error: "",
};
const zonaSlice = createSlice({
  name: "zona",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(getZona.fulfilled, (state, action) => {
        state.loading = false;
        state.zona = action.payload.zona;
      })
      .addCase(getZona.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});
const { reducer } = zonaSlice;
export default reducer;
