import { createAsyncThunk } from "@reduxjs/toolkit";
import API from '../../api'

export const  getCoordinador = createAsyncThunk(
  "coordinadores/get", async (thunkAPI) => {
    try {

      const response = await  API.get("Coordinador");

      return { coordinadores: response.data };
    } catch (error) {
      return thunkAPI.rejectWithValue();
    }
  }
);


