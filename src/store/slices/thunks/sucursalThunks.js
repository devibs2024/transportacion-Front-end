import { createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../api";

export const getSucursales = createAsyncThunk(
  "sucursal/get", async (thunkAPI) => {
    try {

      const response = await  API.get("sucursal");


      return { sucursales: response.data };
    } catch (error) {
      return thunkAPI.rejectWithValue();
    }
  }
);


