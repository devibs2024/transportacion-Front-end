import { createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../api";

export const getOperadores = createAsyncThunk(
  "operadores/get",
  async (thunkAPI) => {
    try {
      const response = await API.get("operador");
      return { operadores: response.data };
    } catch (error) {
      return thunkAPI.rejectWithValue();
    }
  }
);

export const postOperador = createAsyncThunk(
  "operadores/post",
  async (operador, thunkAPI) => {
    try {
      const response = await API.post("Operador", operador);

      return { operador: response.data };
    } catch (error) {
      console.log(error);
      return thunkAPI.rejectWithValue();
    }
  }
);
