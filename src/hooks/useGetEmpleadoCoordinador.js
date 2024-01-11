import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getEmpleadoCoordinadores } from "../store/slices/thunks/empleadoCoordinadorThunk";

export const useGetEmpleadoCoordinadores = (idCoordinador) => {

    const dispatch = useDispatch();

    const empleadoCoordinadores = useSelector((store) => store.empleadoCoordinador.empleadoCoordinadores);

    useEffect(() => {
        dispatch(getEmpleadoCoordinadores(idCoordinador));
    }, []);

    return empleadoCoordinadores;
};