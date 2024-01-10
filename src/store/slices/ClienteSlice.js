import { createSlice } from "@reduxjs/toolkit";
import { getClientes } from "./thunks/ClienteThunks";
 
const clienteSlice = createSlice({
  name: "cliente",
  initialState: {
    clientes: [],
  },
  extraReducers: (builder) => {
    builder
      .addCase(getClientes.fulfilled, (state, action) => {
        state.loading = false;
        state.clientes = action.payload.clientes;
      })
      .addCase(getClientes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      
  },
 

});

const { reducer } = clienteSlice;
export default reducer;
