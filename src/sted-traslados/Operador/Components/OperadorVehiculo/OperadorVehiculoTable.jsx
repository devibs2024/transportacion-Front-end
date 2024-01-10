import { Table } from "react-bootstrap";
import API from "../../../../store/api";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { Button } from 'react-bootstrap'
import { accionExitosa, confirmarAccion } from "../../../../shared/Utils/modals";

export const OperadorVehiculoTable = ({ operador, operadorVehiculos, setOperadorVehiculos }) => {


    console.log(operadorVehiculos)
    const MySwal = withReactContent(Swal)

    const eliminarVehiculo = (vehiculo) => {

        confirmarAccion({ titulo: 'Eliminar Vehiculo', mensaje: 'Estas seguro que deseas eliminar el Vehiculo?' }).then(async (result) => {

            if (result.isConfirmed) {
                const response = await API.delete(`OperadorVehiculo/${operador.idEmpleado},${vehiculo.idVehiculo}?id=${vehiculo.idVehiculo}`);

                console.log(response)
                if (response.status == 200 || response.status == 204) {


                    accionExitosa({ titulo: 'Vehiculo Eliminado', mensaje: 'El vehiculo ha sido Eliminado satisfactoriamente' });

                    console.log(operadorVehiculos)
                    const filteredOperadorVehiculos = operadorVehiculos.filter(x => x.vehiculo.idVehiculo != vehiculo.idVehiculo);

                    setOperadorVehiculos(filteredOperadorVehiculos)
                }
            }
        });


    }




    return (<Table>
        <thead><tr><th>Número de Placa</th><th>Tipo</th><th>Marca</th><th>Modelo</th><th>Año</th><th>Propio</th><th className="text-center">Acción</th></tr></thead>
        <tbody>
            {


                operadorVehiculos.map((operadorVehiculo) => {
                    return (<tr key={operadorVehiculo.vehiculo.idVehiculo}>
                        <td>{operadorVehiculo.vehiculo.nombreVehiculo}</td>
                        <td>{operadorVehiculo.vehiculo.tipoVehiculoDescr}</td>
                        <td>{operadorVehiculo.vehiculo.marcaVehiculoDescr}</td>
                        <td>{operadorVehiculo.vehiculo.modeloVehiculoDescr}</td>
                        <td>{operadorVehiculo.vehiculo.emisionVehiculo}</td>
                        <td>{operadorVehiculo.vehiculoPropio ? "Sí" : "No"}</td>

                        <td><div className="text-center"><Button variant="link" onClick={() => eliminarVehiculo(operadorVehiculo.vehiculo)}><i className="fa-solid fa-trash text-danger"></i></Button></div></td>
                    </tr>)
                })
            }
        </tbody>
    </Table>);
}