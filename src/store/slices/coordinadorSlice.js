import { createSlice } from "@reduxjs/toolkit";
import { getCoordinador } from "./thunks/coordinadorThunks";

const coordinadorSlice = createSlice({
    name: "coordinador",
    initialState: {
        coordinadores: [],
        loading: false,
        error: "",
    },
    extraReducers: (builder) => {
        builder
            .addCase(getCoordinador.fulfilled, (state, action) => {
                state.loading = false;
                state.coordinadores = action.payload.coordinadores;
            })
            .addCase(getCoordinador.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

const { reducer } = coordinadorSlice;

export default reducer;
