import { createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../api";

export const getTiendaCoordinadores = createAsyncThunk(
    "TiendaCoordinadores/get",
    async (idCoordinador, thunkAPI) => {

        try {

            const response = await API.get(`TiendaCoordinador/${idCoordinador}`);

            return { tiendaCoordinadores: response.data };

        }
        catch (error) {
            return thunkAPI.rejectWithValue();
        }

    }
);