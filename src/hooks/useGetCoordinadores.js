import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getCoordinadores } from "../store/slices/thunks/coordinadoresThunks"; 
export const useGetCoordinadores = () => {

    const dispatch = useDispatch();

    const coordinadores = useSelector((store) => store.coordinador.coordinadores);

    useEffect(() => {
        dispatch(getCoordinadores());
    }, []);

    return coordinadores;
};
