import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

export const accionExitosa = ({ titulo, mensaje, buttonText="Ok" }) => {
  return MySwal.fire({
    icon: "success",
    iconColor: "#2596be",
    confirmButtonColor: "#2596be",
    confirmButtonText: buttonText,
    title: titulo,
    text: mensaje,
  });
};
export const accionFallida = ({ titulo, mensaje }) => {
  return MySwal.fire({
    icon: "warning",
    iconColor: "#2596be",
    confirmButtonColor: "#2596be",
    title: titulo,
    text: mensaje,
  });
};

export const confirmarAccion = ({ titulo, mensaje }) => {

    return  Swal.fire({
        title: titulo,
        text: mensaje,
        icon: 'warning',
        iconColor: "#2596be",
        showCancelButton: true,
        confirmButtonColor: "#2596be",
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Ok',
        cancelButtonText: 'Cancelar'
    })
}
