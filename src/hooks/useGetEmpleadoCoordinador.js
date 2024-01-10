import { useDispatch, useSelector } from "react-redux";
import { getEmpleadoCoordinadores } from "../store/slices/thunks/empleadoCoordinadorThunks";
import { useEffect } from "react";

export const useGetEmpleadoCoordinadores = () => {

    const dispatch = useDispatch();

    const empleadoCoordinadores = useSelector((store) => store.empleadoCoordinador.empleadoCoordinadores);

    useEffect(() => {
        dispatch(getEmpleadoCoordinadores());
    }, []);

    return empleadoCoordinadores;
};