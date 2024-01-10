import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getCoordinador } from "../store/slices/thunks/coordinadorThunks";

export const useGetCoordinador = () => {
    
  const dispatch = useDispatch();

  const coordinadores = useSelector((store) => store.coordinador.coordinadores);

  useEffect(() => {
    dispatch(getCoordinador());
  }, []);

  return coordinadores;
};
