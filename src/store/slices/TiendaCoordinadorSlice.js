import { createSlice } from "@reduxjs/toolkit";
import { getTiendaCoordinadores } from "./thunks/tiendaCoordinadorThunk";

const tiendaCoordinadorSlice = createSlice({
    name: "tiendaCoordinadores",
    initialState: {
        tiendaCoordinadores: [],        
        error: "",
        loading: false,
    },
    extraReducers: (builder) => {
        builder
            .addCase(getTiendaCoordinadores.fulfilled, (state, action) => {
                state.loading = false;
                state.tiendaCoordinadores = action.payload.tiendaCoordinadores;
            })
            .addCase(getTiendaCoordinadores.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

const { reducer } = tiendaCoordinadorSlice;

export default reducer;