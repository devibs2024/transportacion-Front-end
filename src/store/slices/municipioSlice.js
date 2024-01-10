import { createSlice } from "@reduxjs/toolkit";
import { getMunicipios } from "./thunks/municipioThunks";

const initialState = {
  municipios: [],
  loading: false,
  error: "",
};
const municipioSlice = createSlice({
  name: "municipio",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(getMunicipios.fulfilled, (state, action) => {
        state.loading = false;
        state.municipios = action.payload.municipios;
      })
      .addCase(getMunicipios.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});
const { reducer } =  municipioSlice;
export default reducer;
