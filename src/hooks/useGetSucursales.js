import { useDispatch, useSelector } from "react-redux";
import { getSucursales } from "../store/slices/thunks/sucursalThunks";
import { useEffect } from "react";

export const useGetSucursales = () => {
  const dispatch = useDispatch();

  const sucursales = useSelector((store) => store.sucursal.sucursales);

  useEffect(() => {
    dispatch(getSucursales());
  }, []);

  return sucursales;
};
