import { createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../api";

export const getEmpleadoCoordinadores = createAsyncThunk(
    "EmpleadoCoordinadores/get",
    async (idCoordinador, thunkAPI) => {

        try {

            const response = await API.get(`EmpleadoCoordinador/${idCoordinador}`);

            return { empleadoCoordinadores: response.data };

        }
        catch (error) {
            return thunkAPI.rejectWithValue();
        }

    }
);