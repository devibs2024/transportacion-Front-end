import { createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../api";

export const getClientes = createAsyncThunk(
  "Clientes/get",
  async (thunkAPI) => {
    try {
      const response = await API.get("clientes");
      return { clientes: response.data };
    } catch (error) {
      return thunkAPI.rejectWithValue();
    
    }
  }
);

export const postClientes = createAsyncThunk(
  "Clientes/post",
  async (cliente, thunkAPI) => {

    try {
      const response = await API.post("Clientes", cliente);

      return { cliente: response.data };
    } catch (error) {

        console.log(error)
      return thunkAPI.rejectWithValue();
    }
  }
);


