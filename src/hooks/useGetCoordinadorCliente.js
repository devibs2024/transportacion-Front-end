import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getCoordinadorClientes } from "../store/slices/thunks/coordinadorClienteThunks";

export const useGetCoordinadorClientes = (idCoordinador) => {

    const dispatch = useDispatch();

    const coordinadorClientes = useSelector((store) => store.coordinadorCliente.coordinadorClientes);

    useEffect(() => {
        dispatch(getCoordinadorClientes(idCoordinador));
    }, []);

    return coordinadorClientes;
};
