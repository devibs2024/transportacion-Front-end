import { createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../api";

export const getTarifaVehiculos = createAsyncThunk(
  "TarifaTipoVehiculo/get", async (thunkAPI) => {
    try {

      const response = await  API.get("TarifaTipoVehiculo");
      
      return { tarifaVehiculos: response.data };
    } catch (error) {
      return thunkAPI.rejectWithValue();
    }
  }
);