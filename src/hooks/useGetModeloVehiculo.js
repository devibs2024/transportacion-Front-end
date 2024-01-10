import { useDispatch, useSelector } from "react-redux";
import { getModeloVehiculos } from "../store/slices/thunks/modeloVehiculoThunks";
import { useEffect } from "react";

export const useGetModeloVehiculo = () => {
  const dispatch = useDispatch();

  const modeloVehiculos = useSelector((store) => store.modeloVehiculo.modeloVehiculos);

  useEffect(() => {
    dispatch(getModeloVehiculos());
  }, []);

  return modeloVehiculos;
};
