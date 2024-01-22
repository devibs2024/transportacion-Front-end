import { createSlice } from "@reduxjs/toolkit";
import { getClienteCoordinadores } from "./thunks/clienteCoordinadorThunk";

const clienteCoordinadorSlice = createSlice({
    name: "clienteCoordinadores",
    initialState: {
        clienteCoordinadores: [],        
        error: "",
        loading: false,
    },
    extraReducers: (builder) => {
        builder
            .addCase(getClienteCoordinadores.fulfilled, (state, action) => {
                state.loading = false;
                state.clienteCoordinadores = action.payload.clienteCoordinadores;
            })
            .addCase(getClienteCoordinadores.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

const { reducer } = clienteCoordinadorSlice;

export default reducer;