import { createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../api";

export const getClienteCoordinadores = createAsyncThunk(
    "ClienteCoordinadores/get",
    async (idCoordinador, thunkAPI) => {

        try {

            const response = await API.get(`CoordinadorCliente/${idCoordinador}`);

            return { clienteCoordinadores: response.data };

        }
        catch (error) {
            return thunkAPI.rejectWithValue();
        }

    }
);