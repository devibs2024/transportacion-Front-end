import { createSlice } from "@reduxjs/toolkit";
import { getVehiculos } from "./thunks/vehiculoThunks";

const vehiculoSlice = createSlice({
  name: "ModeloVehiculo",
  initialState: {
    vehiculos: [],
    loading: false,
    error: "",
  },
  extraReducers: (builder) => {
    builder
      .addCase(getVehiculos.fulfilled, (state, action) => {
        state.loading = false;
        state.vehiculos = action.payload.vehiculos;
      })
      .addCase(getVehiculos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

const { reducer } = vehiculoSlice;

export default reducer;