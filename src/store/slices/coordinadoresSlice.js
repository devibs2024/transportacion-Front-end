import { createSlice } from "@reduxjs/toolkit";
import { getCoordinadores } from "./thunks/coordinadoresThunks";

const coordinadoresSlice = createSlice({
    name: "Coordinador",
    initialState: {
        coordinadores: [],
        loading: false,
        error: "",
    },
    extraReducers: (builder) => {
        builder
            .addCase(getCoordinadores.fulfilled, (state, action) => {
                state.loading = false;
                state.coordinadores = action.payload.coordinadores;
            })
            .addCase(getCoordinadores.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

const { reducer } = coordinadoresSlice;

export default reducer;