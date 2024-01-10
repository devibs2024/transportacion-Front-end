import { useDispatch, useSelector } from "react-redux";
import { getOperadores } from "../store/slices/thunks/operadorThunks";
import { useEffect } from "react";

export const useGetOperadores = () => {
  const dispatch = useDispatch();

  const operadores = useSelector((store) => store.operador.operadores);

  useEffect(() => {
    dispatch(getOperadores());
  }, []);

  return operadores;
};
