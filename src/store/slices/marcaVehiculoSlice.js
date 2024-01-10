import { createSlice } from "@reduxjs/toolkit";
import { getMarcaVehiculos } from "./thunks/marcaVehiculoThunk";

const marcasVehiculoSlice = createSlice({
  name: "marcaVehiculo",
  initialState: {
    marcaVehiculos: [],
    error: "",
    loading: false,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMarcaVehiculos.fulfilled, (state, action) => {
        state.loading = false;
        state.marcaVehiculos = action.payload.marcaVehiculos;
      })
      .addCase(getMarcaVehiculos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

const { reducer } = marcasVehiculoSlice;

export default reducer;
