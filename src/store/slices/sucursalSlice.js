import { createSlice } from "@reduxjs/toolkit";
import { getSucursales } from "./thunks/sucursalThunks";

const sucursalSlice = createSlice({
  name: "sucursal",
  initialState: {
    sucursales: [],
    error: "",
    loading: false,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSucursales.fulfilled, (state, action) => {
        state.loading = false;
        state.sucursales = action.payload.sucursales;
      })
      .addCase(getSucursales.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

const { reducer } = sucursalSlice;

export default reducer;
