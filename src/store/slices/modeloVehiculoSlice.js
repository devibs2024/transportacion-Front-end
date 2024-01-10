import { createSlice } from "@reduxjs/toolkit";
import { getModeloVehiculos } from "./thunks/modeloVehiculoThunks";

const modeloSlice = createSlice({
    name: "modelo",
    initialState: {
        modeloVehiculos: [],
        loading: false,
        error: "",
    },
    extraReducers: (builder) => {
        builder
            .addCase(getModeloVehiculos.fulfilled, (state, action) => {
                state.loading = false;
                state.modeloVehiculos = action.payload.modeloVehiculos;
            })
            .addCase(getModeloVehiculos.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

const { reducer } = modeloSlice;

export default reducer;
