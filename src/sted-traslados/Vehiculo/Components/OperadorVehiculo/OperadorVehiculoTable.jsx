import { Table, Button } from "react-bootstrap";
import API from "../../../../store/api";
import Swal from 'sweetalert2';
import { accionExitosa, confirmarAccion, accionFallida } from "../../../../shared/Utils/modals"
import { procesarErrores } from "../../../../shared/Utils/procesarErrores";

export const OperadorVehiculoTable = ({ vehiculo, operadorVehiculos, setOperadorVehiculos }) => {

    const eliminarVehiculo = async (operadorVehiculo) => {

        confirmarAccion({ titulo: 'Eliminar Asignación del Vehículo', mensaje: 'Estas seguro que deseas eliminar la Asignación del Vehículo?' }).then(async (result) => {

            try {
                if (result.isConfirmed) {
                    const response = await API.delete(`OperadorVehiculo/${operadorVehiculo.idEmpleado},${vehiculo.idVehiculo}`);

                    if (response.status == 200 || response.status == 204) {

                        accionExitosa({ titulo: 'Asignación del Vehículo', mensaje: 'La Asignación del vehículo fue eliminada satisfactoriamente' })

                        const filteredOperadorVehiculo = operadorVehiculos.filter(x => x.idEmpleado != operadorVehiculo.idEmpleado);

                        setOperadorVehiculos([filteredOperadorVehiculo])

                    }
                } else {

                    accionFallida({ titulo: 'La Asignacion no pudo ser Eliminada', mensaje: '¡Ha ocurrido un error al intentar eliminar la Asignar el vehículo' });
                }

            } catch (e) {

                let errores = e.response.data;

                accionFallida({ titulo: 'La Asignacion no pudo ser Eliminada', mensaje: procesarErrores(errores) });
            }

        });
    }


    return (<Table>
        <thead><tr>
            <th>Nombre Completo</th>
            <th>Placa</th>
            <th>Tipo Vehiculo</th>
            <th>Marca</th>
            <th>Modelo</th>
            <th>Vehiculo Propio</th>
            <th className="text-center">Acción</th></tr></thead>
        <tbody>
            {
                operadorVehiculos.map((operadorVehiculo) => {
                    return (
                        <tr key={operadorVehiculo.vehiculo.idVehiculo}>
                            <td>{operadorVehiculo.empleado.nombres + " " + operadorVehiculo.empleado.apellidoPaterno}</td>
                            <td>{operadorVehiculo.vehiculo.nombreVehiculo}</td>
                            <td>{operadorVehiculo.vehiculo.tipoVehiculoDescr}</td>
                            <td>{operadorVehiculo.vehiculo.marcaVehiculoDescr}</td>
                            <td>{operadorVehiculo.vehiculo.modeloVehiculoDescr}</td>
                            <td>{operadorVehiculo.vehiculoPropio == true ? "Si" : "No"}</td>
                            <td>
                                <div className="text-end">
                                    <a onClick={() => eliminarVehiculo(operadorVehiculo)}><i className="fa-solid fa-trash text-danger"></i>
                                    </a>
                                </div>
                            </td>
                        </tr>)
                })
            }
        </tbody>
    </Table>);
}