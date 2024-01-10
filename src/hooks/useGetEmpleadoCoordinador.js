import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getEmpleadoCoordinador } from "../store/slices/thunks/empleadoCoordinadorThunks";

export const useGetEmpleadoCoordinador = () => {

    const dispatch = useDispatch();

    const empleadoCoordinadores = useSelector((store) => store.empleadoCoordinadores.empleadoCoordinadores);

    useEffect(() => {
        dispatch(getEmpleadoCoordinador());
    }, []);

    return empleadoCoordinadores;
};