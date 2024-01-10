import { createSlice } from "@reduxjs/toolkit";
import { getMarcasVehiculo } from "./thunks/marcaVehiculoThunk";

const initialState = {
  marcaVehiculos: [],
  loading: false,
  error: "",
};
const marcaVehiculosSlice = createSlice({
  name: "marcaVehiculo",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(getMarcasVehiculo.fulfilled, (state, action) => {
        state.loading = false;
        state.estados = action.payload.marcaVehiculos;
      })
      .addCase(getMarcasVehiculo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});
const { reducer } = marcaVehiculosSlice;
export default reducer;
