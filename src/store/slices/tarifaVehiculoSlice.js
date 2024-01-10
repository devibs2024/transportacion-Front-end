import { createSlice } from "@reduxjs/toolkit";
import { getTarifaVehiculos } from "./thunks/TarifaVehiculosThunks";

const tarifaVehiculoSlice = createSlice({
  name: "tarifaVehiculos",
  initialState: {
    tarifaTipoVehiculo: [],
    error: "",
    loading: false,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTarifaVehiculos.fulfilled, (state, action) => {
        state.loading = false;
        state.tarifaTipoVehiculo = action.payload.tarifaTipoVehiculo;
      })
      .addCase(getTarifaVehiculos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

const { reducer } = tarifaVehiculoSlice;

export default reducer;
