import { createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../api";

export const getCoordinadorClientes = createAsyncThunk(
    "CoordinadorCliente/get",
    async (idCoordinador,thunkAPI) => {
        try {
            const response = await API.get(`CoordinadorCliente/${idCoordinador}`);
            return { coordinadorCliente: response.data };
        } catch (error) {
            return thunkAPI.rejectWithValue();
        }
    }
);

export const postCoordinadorCliente = createAsyncThunk(
    "CoordinadorCliente/post",
    async (coordinadorCliente, thunkAPI) => {


        console.log(coordinadorCliente)

        try {
            const response = await API.post("CoordinadorCliente", coordinadorCliente);

            return { coordinador: response.data };
        } catch (error) {

            console.log(error)
            return thunkAPI.rejectWithValue();
        }
    }
);
