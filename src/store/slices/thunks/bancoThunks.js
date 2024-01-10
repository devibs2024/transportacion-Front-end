import { createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../api";

export const  getBancos = createAsyncThunk(
  "municipio/get", async (thunkAPI) => {
    try {

      const response = await  API.get("municipio");

      return { municipios: response.data };
    } catch (error) {
      return thunkAPI.rejectWithValue();
    }
  }
);


