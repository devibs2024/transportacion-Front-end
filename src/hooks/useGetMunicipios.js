import { useDispatch, useSelector } from "react-redux";
import { getMunicipios } from "../store/slices/thunks/municipioThunks";
import { useEffect } from "react";

export const useGetMunicipios = () => {
  const dispatch = useDispatch();

  const municipios = useSelector((store) => store.municipio.municipios);

  useEffect(() => {
    dispatch(getMunicipios());
  }, []);

  return municipios;
};
