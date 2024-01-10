import { createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../api";

export const getTiendas = createAsyncThunk(
    "Tiendas/get", async (thunkAPI) => {
        try {

            const response = await API.get("Tiendas");

            return { tiendas: response.data };
        } catch (error) {
            return thunkAPI.rejectWithValue();
        }
    }
);


