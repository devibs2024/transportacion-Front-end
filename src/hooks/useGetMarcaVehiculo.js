import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getMarcaVehiculos } from "../store/slices/thunks/marcaVehiculoThunk";

export const useGetMarcaVehiculo = () => {

    const dispatch = useDispatch();

    const marcaVehiculos = useSelector((store) => store.marcaVehiculo.marcaVehiculos);

    useEffect(() => {
        dispatch(getMarcaVehiculos());
    }, []);

    return marcaVehiculos;
};
