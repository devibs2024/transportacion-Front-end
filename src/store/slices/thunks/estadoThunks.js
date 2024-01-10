import { createAsyncThunk } from "@reduxjs/toolkit";
import API from '../../api'

export const  getEstados = createAsyncThunk(
  "estados/get", async (thunkAPI) => {
    try {

      const response = await  API.get("estados");

      return { estados: response.data };
    } catch (error) {
      return thunkAPI.rejectWithValue();
    }
  }
);


