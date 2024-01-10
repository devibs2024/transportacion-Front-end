import { useDispatch, useSelector } from "react-redux";
import { getClientes } from "../store/slices/thunks/ClienteThunks";
import { useEffect } from "react";

export const useDataCliente = () => {
    
  const dispatch = useDispatch();

  const clientes = useSelector((store) => store.cliente.clientes);

  useEffect(() => {
    dispatch(getClientes());
  }, []);

  return clientes;
};
