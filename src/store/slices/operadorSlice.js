import { createSlice } from "@reduxjs/toolkit";
import { getOperadores } from "./thunks/operadorThunks";

const operadorSlice = createSlice({
  name: "operador",
  initialState: {
    operadores: [],
  },
  extraReducers: (builder) => {
    builder
      .addCase(getOperadores.fulfilled, (state, action) => {
        state.loading = false;
        state.operadores = action.payload.operadores;
      })
      .addCase(getOperadores.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

const { reducer } = operadorSlice;

export default reducer;
