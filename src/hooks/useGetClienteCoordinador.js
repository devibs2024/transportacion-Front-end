import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getClienteCoordinadores } from "../store/slices/thunks/clienteCoordinadorThunk";

export const useGetClienteCoordinadores = (idCoordinador) => {

    const dispatch = useDispatch();

    const clienteCoordinadores = useSelector((store) => store.clienteCoordinador.clienteCoordinadores);

    useEffect(() => {
        dispatch(getClienteCoordinadores(idCoordinador));
    }, []);

    return clienteCoordinadores;
};