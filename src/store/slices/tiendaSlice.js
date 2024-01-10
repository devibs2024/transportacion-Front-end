import { createSlice } from "@reduxjs/toolkit";
import { getTiendas } from "./thunks/tiendaThunks";

const tiendaSlice = createSlice({
    name: "tiendas",
    initialState: {
        tiendas: [],
        error: "",
        loading: false,
    },
    extraReducers: (builder) => {
        builder
            .addCase(getTiendas.fulfilled, (state, action) => {
                state.loading = false;
                state.tiendas = action.payload.tiendas;
            })
            .addCase(getTiendas.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

const { reducer } = tiendaSlice;

export default reducer;
