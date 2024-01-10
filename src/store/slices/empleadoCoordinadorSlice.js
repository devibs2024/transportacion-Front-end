import { createSlice } from "@reduxjs/toolkit";
import { getEmpleadoCoordinador } from "./thunks/empleadoCoordinadorThunks";

const empleadoCoordinadorSlice = createSlice({
    name: "EmpleadoCoordinador",
    initialState: {
        empleadoCoordinador: [],
        loading: false,
        error: "",
    },
    extraReducers: (builder) => {
        builder
            .addCase(getEmpleadoCoordinador.fulfilled, (state, action) => {
                state.loading = false;
                state.empleadoCoordinador = action.payload.empleadoCoordinador;
            })
            .addCase(getEmpleadoCoordinador.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

const { reducer } = empleadoCoordinadorSlice;

export default reducer;