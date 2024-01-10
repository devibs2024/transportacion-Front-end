import { useDispatch, useSelector } from "react-redux";
import { getFormatos} from '../store/slices/thunks/formatoThunks';
import { useEffect } from "react";

export const useGetFormatos = () => {
  const dispatch = useDispatch();

  const formatos = useSelector((store) => store.formato.formatos);

  useEffect(() => {
    dispatch(getFormatos());
  }, []);

  return formatos;
};
