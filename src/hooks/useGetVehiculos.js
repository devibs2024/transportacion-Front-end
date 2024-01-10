import { useDispatch, useSelector } from "react-redux";
import { getVehiculos } from '../store/slices/thunks/vehiculoThunks';
import { useEffect } from "react";

export const useGetVehiculo = () => {

  const dispatch = useDispatch();

  const vehiculos = useSelector((store) => store.vehiculo.vehiculos);

  useEffect(() => {
    dispatch(getVehiculos());
  }, []);

  return vehiculos;
};
