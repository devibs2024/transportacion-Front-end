import { createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../api";

export const getFormatos = createAsyncThunk(
  "formatos/get",
  async (thunkAPI) => {
    try {
      const response = await API.get("Formatos");
       return { formatos: response.data };
      } catch (error) {
      return thunkAPI.rejectWithValue();
    }
  }
);

export const postformatos = createAsyncThunk(
  "formatos/post",
  async (formatos, thunkAPI) => {


    try {
      const response = await API.post("Formatos", formatos);

      return { formatos: response.data };
    } catch (error) {

        console.log(error)
      return thunkAPI.rejectWithValue();
    }
  }
);
