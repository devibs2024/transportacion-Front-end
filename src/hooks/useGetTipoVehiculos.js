import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getTipoVehiculos } from "../store/slices/thunks/tipoVehiculoThunk";

export const  useGetTipoVehiculos = () => {

  const dispatch = useDispatch();

  const tipoVehiculos = useSelector((store) => store.tipoVehiculo.tipoVehiculos);



  useEffect(() => {
    dispatch(getTipoVehiculos());
  }, []);

  return tipoVehiculos;
};
