import { createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../api";

export const getModeloVehiculos = createAsyncThunk(
    "ModeloVehiculo/get",
    async (thunkAPI) => {
        try {
            const response = await API.get("ModeloVehiculo");

            return { modeloVehiculos: response.data };
        } catch (error) {
            return thunkAPI.rejectWithValue();
        }
    }
);


