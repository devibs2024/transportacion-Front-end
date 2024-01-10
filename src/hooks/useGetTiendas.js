import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getTiendas } from "../store/slices/thunks/tiendaThunks";

export const useGetTiendas = () => {

    const dispatch = useDispatch();

    const tiendas = useSelector((store) => store.tienda.tiendas);



    useEffect(() => {
        dispatch(getTiendas());
    }, []);

    return tiendas;
};
