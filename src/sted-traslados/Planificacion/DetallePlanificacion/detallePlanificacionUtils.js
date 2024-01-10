import {
  accionExitosa,
  accionFallida,
  confirmarAccion,
} from "../../../shared/Utils/modals";
import { procesarErrores } from "../../../shared/Utils/procesarErrores";
import API from "../../../store/api";
import * as decodeToken from '../../../shared/Utils/decodeToken';

export const getDetallesPlanificacion = async (
  planificacion,
  setDetallesPlanificacion
) => {
  const response = await API.get(
    `PlanificacionDetalleGeneral/${planificacion.idPlanificacion},0`
  );

  if (response.status == 200 || response.status == 204) {
    setDetallesPlanificacion(response.data);
  }
};

export const postOrPutDetallePlanificacion = async (
  detallePlanificacion,
  getDetallesPlanificacion,
  planificacion,
  setDetallesPlanificacion
) => {
  try {
    let response;

    if (!detallePlanificacion.idDetallePlanificacion) {
      console.log("posting detalle planifacacion", detallePlanificacion);
      response = await API.post("DetallePlanificaciones", detallePlanificacion);

      if (response.status == 200 || response.status == 204) {
        accionExitosa({
          titulo: "Detalle de Planificacion Agregado",
          mensaje:
            "¡El detalle de Planificacion ha sido agregado satisfactoriamente!",
        });
        
        try {
          await getDetallesPlanificacion(
            planificacion,
            setDetallesPlanificacion
          );
        } catch (e) {}
      }
    } else {
      console.log("updating detalle planifacacion", detallePlanificacion);
      response = await API.put(
        `DetallePlanificaciones/${detallePlanificacion.idDetallePlanificacion}`,
        detallePlanificacion
      );

      if (response.status == 200 || response.status == 204) {
        accionExitosa({
          titulo: "Detalle de Planificacion Actualizado",
          mensaje:
            "¡El detalle de Planificacion ha sido actualizado satisfactoriamente!",
        });

        await getDetallesPlanificacion(planificacion, setDetallesPlanificacion);
      }
    }
  } catch (e) {
    console.log(e);

    let errores = e.response.data;

    console.log(errores);
    accionFallida({
      titulo: "El detalle de Planificacion no pudo ser agregado",
      mensaje: procesarErrores(errores),
    }).then(() => {
      //    handleClose();
    });
  }
};

export const eliminarDetallePlanificacion = (
  idDetallePlanificacion,
  detallesPlanificacion,
  setDetallesPlanificacion
) => {
  confirmarAccion({
    titulo: "Eliminar Detalle de Planificación",
    mensaje: "Estas seguro que deseas eliminar el Detalle de Planificación?",
  }).then(async (result) => {
    if (result.isConfirmed) {
      const response = await API.delete(
        `DetallePlanificaciones/${idDetallePlanificacion}`
      );

      if (response.status == 200 || response.status == 204) {
        accionExitosa({
          titulo: "Detalle de Planificación",
          mensaje:
            "El detalle de Planificación  ha sido eliminado satisfactoriamente",
        });

        const filteredDetallesPlanificacion = detallesPlanificacion.filter(
          (x) => x.idDetallePlanificacion != idDetallePlanificacion
        );

        setDetallesPlanificacion(filteredDetallesPlanificacion);
      }
    }
  });
};

export const getOperadores = async (setOperadores) => {
  const response = await API.get(`Operador`);

  if (response.status == 200 || response.status == 204) {
    const filteredOperadores = response.data.filter(
      (o) => o.idTipoEmpleado == 1
    );
    setOperadores(filteredOperadores);
  }
};

export const getTiendas = async (setTiendas) => {

  const idCoordinador = decodeToken.tokenDecode()

  console.log(idCoordinador)
  try {
    const response = await API.get(`TiendasCoordinador/${idCoordinador},3`);

    if (response.status == 200 || response.status == 204) {
      setTiendas(response.data);

      console.log("Data", response.data);
    }
  } catch (e) {
    console.log(e);
  }
};
