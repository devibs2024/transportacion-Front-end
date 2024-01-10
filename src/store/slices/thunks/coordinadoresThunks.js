import { createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../api";

export const getCoordinadores = createAsyncThunk(
    "Coordinador/get",
    async (thunkAPI) => {
        try {
            const response = await API.get("Coordinador");
            return { coordinadores: response.data };
        } catch (error) {
            return thunkAPI.rejectWithValue();
        }
    }
);

export const postCoordinador = createAsyncThunk(
    "Coordinador/post",
    async (coordinador, thunkAPI) => {


        console.log(coordinador)

        try {
            const response = await API.post("Coordinador", coordinador);

            return { coordinador: response.data };
        } catch (error) {

            console.log(error)
            return thunkAPI.rejectWithValue();
        }
    }
);
