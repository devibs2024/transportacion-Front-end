import API from "../../../../store/api";
import {
  accionFallida,
  confirmarAccion,
  accionExitosa,
} from "../../../../shared/Utils/modals";
import { procesarErrores } from "../../../../shared/Utils/procesarErrores";


export const postOperador = async (API, operador) => {
  return await API.post("Operador", operador);
};

export const putOperador = async (API, operador) => {
  return await API.put(`Operador/${operador.idEmpleado}`, operador);
};
export const postOrPutOperador = async (operador, setIdEmpleado, idEmpleado, updateOperador) => {
  try {
    const response =
      operador.idEmpleado == 0
        ? await postOperador(API, operador)
        : await putOperador(API, operador);

    if (response.status == 200 || response.status == 204) {
      const actionMessage =
        operador.idEmpleado == 0
          ? {
            titulo: "Operador Agregado",
            mensaje: " ¡El Operador ha sido creado satisfactoriamente!",
          }
          : {
            titulo: "Operador Actualizado",
            mensaje: "¡El Operador ha sido actualizado satisfactoriamente!",
          };

      if (operador.idEmpleado == 0) {
        setIdEmpleado(response.data);
        updateOperador(createOperador(response.data, operador));
      } else {
        updateOperador(createOperador(operador.idEmpleado, operador));
      }

      accionExitosa(actionMessage);

    }
  } catch (e) {
    console.log(e);

    accionFallida({
      titulo: "El Operador no pudo ser Agregado",
      mensaje: procesarErrores(e.response.data),
    });
  }
};

const createOperador = (idEmpleado, operadorData) => {
  return {
    idEmpleado: idEmpleado,
    numeroContrato: operadorData.numeroContrato,
    nombres: operadorData.nombres,
    apellidoMaterno: operadorData.apellidoMaterno,
    apellidoPaterno: operadorData.apellidoPaterno,
    direccion: operadorData.direccion,
    idMunicipio: operadorData.idMunicipio,
    telefono: operadorData.telefono,
    correo: operadorData.correo,
    salario: operadorData.salario,
    idEstado: operadorData.idEstado,
    idSegmento: operadorData.idSegmento,
  };
};


