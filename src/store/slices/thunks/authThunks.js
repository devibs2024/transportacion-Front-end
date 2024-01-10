import { createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../api";
import { accionFallida } from "../../../shared/Utils/modals";
import { procesarErrores } from "../../../shared/Utils/procesarErrores";

export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }, thunkAPI) => {
    try {
      const response = await API.post("userAccount/login", {
        email,
        password,
      });

      localStorage.setItem("user", JSON.stringify(response.data));

      return { user: response.data };
    } catch (e) {
     
      accionFallida({titulo: 'Ha ocurrido un error', mensaje: procesarErrores(e.response.data)  })
  

      return thunkAPI.rejectWithValue();
    }
  }
);

export const logout = createAsyncThunk("auth/logout", async () => {
  await localStorage.removeItem("user");
});
