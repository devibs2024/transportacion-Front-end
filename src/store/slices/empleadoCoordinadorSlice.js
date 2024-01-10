import { createSlice } from "@reduxjs/toolkit";
import { getEmpleadoCoordinadores } from "./thunks/empleadoCoordinadorThunks";

const empleadoCoordinadorSlice = createSlice({
    name: "empleadoCoordinador",
    initialState: {
        empleadoCoordinadores: [],
        loading: false,
        error: "",
    },
    extraReducers: (builder) => {
        builder
            .addCase(getEmpleadoCoordinadores.fulfilled, (state, action) => {
                state.loading = false;
                state.empleadoCoordinadores = action.payload.empleadoCoordinadores;
            })
            .addCase(getEmpleadoCoordinadores.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

const { reducer } = empleadoCoordinadorSlice;

export default reducer;