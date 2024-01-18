import API from "../../../store/api";

import { accionExitosa, accionFallida, confirmarAccion, } from "../../../shared/Utils/modals";
import * as decodeToken from '../../../shared/Utils/decodeToken';

import { procesarErrores } from "../../../shared/Utils/procesarErrores";

export const postOrPutDetallePlanificacion = async (detallePlanificacion, getDetallesPlanificacion, planificacion, setDetallesPlanificacion) => {

    try {

        let response;

        if (!detallePlanificacion.idDetallePlanificacion) {

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
                } catch (e) { }
            }

        } else {

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

        let errores = e.response.data;

        accionFallida({ titulo: "El detalle de Planificacion no pudo ser agregado", mensaje: procesarErrores(errores), })
    }
};

export const eliminarDetallePlanificacion = (idDetallePlanificacion, detallesPlanificacion, setDetallesPlanificacion) => {

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


