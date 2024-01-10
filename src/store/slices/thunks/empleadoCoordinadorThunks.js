import { createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../api";

export const getEmpleadoCoordinador = createAsyncThunk(
    "EmpleadoCoordinador/get",
    async (idCoordinador,thunkAPI) => {
        try{
            const response = await API.get(`EmpleadoCoordinador/${idCoordinador}`);
            return { empleadoCoordinador: response.data };
            
        }catch (error){
            return thunkAPI.rejectWithValue();
        }
    }
);