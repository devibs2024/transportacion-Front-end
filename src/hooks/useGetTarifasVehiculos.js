import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getTarifaVehiculos } from "../store/slices/thunks/TarifaVehiculosThunks";

export const useGetTarifasVehiculos = () => {

    const dispatch = useDispatch();

    const tarifaVehiculos = useSelector((store) => store.tarifaVehiculos.tarifa);

    useEffect(() => {
        dispatch(getTarifaVehiculos());
    }, []);

    return tarifaVehiculos;
};
