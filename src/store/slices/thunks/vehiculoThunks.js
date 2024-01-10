import { createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../api";

export const getVehiculos = createAsyncThunk(
  "vehiculos/get",
  async (thunkAPI) => {
    try {
      const response = await API.get("Vehiculos");
      return { vehiculos: response.data };
    } catch (error) {
      return thunkAPI.rejectWithValue();
    }
  }
);

export const postVehiculo = createAsyncThunk(
  "vehiculos/post",
  async (vehiculo, thunkAPI) => {


    console.log(vehiculo)

    try {
      const response = await API.post("Vehiculos", vehiculo);

      return { vehiculos: response.data };
    } catch (error) {

        console.log(error)
      return thunkAPI.rejectWithValue();
    }
  }
);
