import { createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../api";

export const getTipoVehiculos = createAsyncThunk(
    "TipoVehiculos/get",
    async (thunkAPI) => {
    try {

      const response = await  API.get("TipoVehiculos");
      
      return { tipoVehiculos: response.data };
    } catch (error) {
      return thunkAPI.rejectWithValue();
    }
  }
);

export const postTipoVehiculos = createAsyncThunk(
  "TipoVehiculos/post",
  async (tipoVehiculos, thunkAPI) => {

    try {
      const response = await API.post("TipoVehiculos", tipoVehiculos);

      return { tipoVehiculos: response.data };
    } catch (error) {

        console.log(error)
      return thunkAPI.rejectWithValue();
    }
  }
);


