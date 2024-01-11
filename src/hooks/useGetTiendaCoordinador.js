import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getTiendaCoordinadores } from "../store/slices/thunks/tiendaCoordinadorThunk";

export const useGetTiendaCoordinadores = (idCoordinador) => {

    const dispatch = useDispatch();

    const tiendaCoordinadores = useSelector((store) => store.tiendaCoordinador.tiendaCoordinadores);

    useEffect(() => {
        dispatch(getTiendaCoordinadores(idCoordinador));
    }, []);

    return tiendaCoordinadores;
};