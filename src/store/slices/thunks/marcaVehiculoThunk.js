import { createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../api";

export const getMarcaVehiculos = createAsyncThunk(
  "MarcaVehiculo/get", async (thunkAPI) => {
    try {
      const response = await API.get("MarcaVehiculo");

      return { marcaVehiculos: response.data };
    } catch (error) {
      return thunkAPI.rejectWithValue();
    }
  }
);

export const getMarcasByTipoVehiculo = createAsyncThunk(
  "MarcaVehiculo/get", async ({ idTipoVehculo },thunkAPI) => {
    try {
      const response = await API.get(`MarcaVehiculo/${idTipoVehculo}`);

      return { marcaVehiculos: response.data };
    } catch (error) {
      return thunkAPI.rejectWithValue();
    }
  }
);


