import { useDispatch, useSelector } from "react-redux";
import { getMarcaVehiculos } from "../store/slices/thunks/marcaVehiculoThunk";
import { useEffect } from "react";

export const useGetMarchasVehiculos = () => {
    
  const dispatch = useDispatch();

  const marcaVehiculos = useSelector((store) => store.marcaVehiculo.marcaVehiculos);

  useEffect(() => {
    dispatch(getMarcaVehiculos());
  }, []);

  return marcaVehiculos;
};
