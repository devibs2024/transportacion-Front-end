import { createSlice } from "@reduxjs/toolkit";
import { getTipoVehiculos } from "./thunks/tipoVehiculoThunk";

const tipoVehiculoSlice = createSlice({
  name: "tipoVehiculos",
  initialState: {
    tipoVehiculos: [],
    error: "",
    loading: false,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTipoVehiculos.fulfilled, (state, action) => {
        state.loading = false;
        state.tipoVehiculos = action.payload.tipoVehiculos;
      })
      .addCase(getTipoVehiculos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

const { reducer } = tipoVehiculoSlice;

export default reducer;
