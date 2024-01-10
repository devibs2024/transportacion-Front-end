import { createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../api";

export const getZona = createAsyncThunk(
  "Zonas/get",
  async (thunkAPI) => {
    try {
      const response = await API.get("Zonas");
      console.log(response.data)
      return { zona: response.data };
    } catch (error) {
      return thunkAPI.rejectWithValue();
    
    }
  }
);

export const postZona = createAsyncThunk(
  "Zonas/post",
  async (zona, thunkAPI) => {


    console.log(zona)

    try {
      const response = await API.post("Zonas", zona);

      return { zona: response.data };
    } catch (error) {

        console.log(error)
      return thunkAPI.rejectWithValue();
    }
  }
);
