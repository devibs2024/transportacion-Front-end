import { useDispatch, useSelector } from "react-redux";
import { getZona } from "../store/slices/thunks/ZonaThunks";
import { useEffect } from "react";

export const useGetZona = () => {
    
  const dispatch = useDispatch();

  const zona = useSelector((store) => store.zona.zona);

  useEffect(() => {
    dispatch(getZona());
  }, []);

  return zona;
};
