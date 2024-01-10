import { useDispatch, useSelector } from "react-redux";
import { getEstados } from "../store/slices/thunks/estadoThunks";
import { useEffect } from "react";

export const useGetEstados = () => {
    
  const dispatch = useDispatch();

  const estados = useSelector((store) => store.estado.estados);

  useEffect(() => {
    dispatch(getEstados());
  }, []);

  return estados;
};
