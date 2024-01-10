import { createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../api";

export const  getMunicipios = createAsyncThunk(
  "municipio/get", async (thunkAPI) => {
    try {

      const response = await  API.get("municipio");

      return { municipios: response.data };
    } catch (error) {
      return thunkAPI.rejectWithValue();
    }
  }
);

export const postMunicipios = createAsyncThunk(
  "Municipio/post",
  async (municipio, thunkAPI) => {

    try {
      const response = await API.post("Municipio", municipio);

      return { municipio: response.data };
    } catch (error) {

        console.log(error)
      return thunkAPI.rejectWithValue();
    }
  }
);

