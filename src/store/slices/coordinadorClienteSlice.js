import { createSlice } from "@reduxjs/toolkit";
import { getCoordinadorClientes } from "./thunks/coordinadorClienteThunks";

const coordinadorClienteSlice = createSlice({
    name: "CoordinadorCliente",
    initialState: {
        coordinadorClientes: [],
        loading: false,
        error: "",
    },
    extraReducers: (builder) => {
        builder
            .addCase(getCoordinadorClientes.fulfilled, (state, action) => {
                state.loading = false;
                state.coordinadorClientes = action.payload.coordinadorClientes;
            })
            .addCase(getCoordinadorClientes.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

const { reducer } = coordinadorClienteSlice;

export default reducer;