import API from "../../../../store/api";
import {
  accionFallida,
  confirmarAccion,
  accionExitosa,
} from "../../../../shared/Utils/modals";
import { procesarErrores } from "../../../../shared/Utils/procesarErrores";

export const postTarjeta = async (
  tarjeta,
  tarjetas,
  setTarjetas,
  handleClose,
  formik
) => {
  try {
    const response = await API.post("AsignacionTarjetas", {
      idEmpleado: tarjeta.idEmpleado,
      numTarjeta: tarjeta.numTarjeta,
      numeroInterno: tarjeta.numeroInterno,
      montoDiario: tarjeta.montoDiario,
    });

    if (response.status === 200 || response.status === 204) {
      setTarjetas([...tarjetas, { ...tarjeta, idTarjeta: response.data }]);

      confirmarAccion({
        titulo: "Tarjeta de Gasolina Agregada",
        mensaje: "¡La Tarjeta de Gasolina ha sido agregada satisfactoriamente!",
      }).then(async () => {
        handleClose();
        formik.resetForm();
      });
    }
  } catch (e) {
    accionFallida({
      titulo: "La Tarjeta de Gasolina no pudo ser Agregada",
      mensaje: procesarErrores(e.response.data),
    });
  }
};

export const eliminarTarjeta = (tarjeta, tarjetas, setTarjetas) => {
  confirmarAccion({
    titulo: "Eliminar Tarjeta",
    mensaje: "Estas seguro que deseas eliminar la Tarjeta?",
  }).then(async (result) => {
    if (result.isConfirmed) {
      const response = await API.delete(
        `AsignacionTarjetas/${tarjeta.idTarjeta}`
      );

      if (response.status == 200 || response.status == 204) {
        accionExitosa({
          titulo: "Tarjeta Eliminada",
          mensaje: "La tarjeta ha sido eliminada satisfactoriamente",
        });

        const filteredTarjetas = tarjetas.filter(
          (x) => x.idTarjeta != tarjeta.idTarjeta
        );

        setTarjetas(filteredTarjetas);
      }
    }
  });
};

export const putTarjeta = async (
  tarjeta,
  tarjetas,
  setTarjetas,
  handleClose,
  formik
) => {
  try {
    //  alert('Editando...')
    const response = await API.put(`AsignacionTarjetas/${tarjeta.idTarjeta}`, {
      idTarjeta: tarjeta.idTarjeta,
      idEmpleado: tarjeta.idEmpleado,
      numTarjeta: "",
      montoDiario: tarjeta.montoDiario,
      numeroInterno: tarjeta.numeroInterno,
    });

    if (response.status === 200 || response.status === 204) {
      setTarjetas([{ ...tarjeta }]);

      confirmarAccion({
        titulo: "Tarjeta de Gasolina Actualizada",
        mensaje: "¡La Tarjeta de Gasolina ha sido actualizada satisfactoriamente!",
      }).then(async () => {
        handleClose();
        formik.resetForm();
      });
    }
  } catch (e) {
    console.log(e);
    accionFallida({
      titulo: "La Tarjeta de Gasolina no pudo ser Agregada",
      mensaje: procesarErrores(e.response.data),
    });
  }
};

export const getTarjetas = async (idEmpleado, setTarjetas) => {
  const response = await API.get(`AsignacionTarjetas/${idEmpleado}`);

  if (response.status == 200 || response.status == 204) {
    setTarjetas(response.data);
  }
  return response;
};
