import { configureStore } from "@reduxjs/toolkit";

import operadorReducer from "./slices/operadorSlice";
import authReducer from './slices/auth';
import estadoReducer from './slices/estadoSlice';
import municipioReducer from './slices/municipioSlice';
import sucursalReducer from './slices/sucursalSlice';
import tipoVehiculoReducer from './slices/tipoVehiculoSlice';
import clienteReducer from './slices/ClienteSlice'
import zonaReducer from './slices/ZonaSlice'
import formatoReducer from './slices/formatoSlice'
import marcaVehiculoReducer from './slices/marcaVehiculoSlice'
import vehiculoReducer from './slices/vehiculoSlice';
import coordinadorReducer from './slices/coordinadorSlice';
import modeloReducer from './slices/modeloVehiculoSlice';
import tiendaReducer from './slices/tiendaSlice';
import empleadoCoordinadorReducer from './slices/empleadoCoordinadorSlice'
import tiendaCoordinadorReducer from './slices/tiendaCoordinadorSlice'
import clienteCoordinadorReducer from './slices/clienteCoordinadorSlice'

const reducers = {
  operador: operadorReducer,
  auth: authReducer,
  estado: estadoReducer,
  municipio: municipioReducer,
  sucursal: sucursalReducer,
  vehiculo: vehiculoReducer,
  tipoVehiculo: tipoVehiculoReducer,
  marcaVehiculo: marcaVehiculoReducer,
  cliente: clienteReducer,
  zona: zonaReducer,
  formato: formatoReducer,
  modeloVehiculo: modeloReducer,
  coordinador: coordinadorReducer,
  tienda: tiendaReducer,
  empleadoCoordinador: empleadoCoordinadorReducer,
  tiendaCoordinador: tiendaCoordinadorReducer,
  clienteCoordinador: clienteCoordinadorReducer
};

export const store = configureStore({
  reducer: reducers,
  devTools: true,
});
