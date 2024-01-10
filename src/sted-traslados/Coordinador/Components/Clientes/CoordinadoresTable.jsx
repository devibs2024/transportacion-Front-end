import { Table, Button } from "react-bootstrap";
import API from "../../../../store/api";
import Swal from "sweetalert2";
import { accionExitosa, accionFallida, confirmarAccion } from '../../../../shared/Utils/modals';

export const CoordinadorTable = ({ coordinador, coordinadorClientes, setCoordinadorClientes, setShow, show }) => {


    const handleShow = () => setShow(true);
    const eliminarCliente = async (cliente) => {

console.log(cliente);



        confirmarAccion({ titulo: 'Eliminar Cliente', mensaje: 'Estas seguro que deseas eliminar la cliente?' }).then(async (result) => {
            if (result.isConfirmed) {
                const response = await API.delete(`TiendasCoordinador/${cliente.idCoordinador},${cliente.idTienda}`);

                if (response.status == 200 || response.status == 204) {

                    const filtersCoordinadorCliente = coordinadorClientes.filter(x => x.idTienda != cliente.idTienda);
                    setCoordinadorClientes(filtersCoordinadorCliente);

                    accionExitosa({ titulo: 'Cliente Eliminado', mensaje: 'El cliente ha sido eliminado Exitosamente' });

                } else {

                    accionExitosa({ titulo: 'Cliente no pudo ser Eliminado', mensaje: 'Ha ocurrido un error al intentar eliminar el cliente' })
                }
            }
        })
    }

    return (<Table>
        <thead>
            <tr>
                <th>Cliente</th>
                <th>Zona Sted</th>
                <th>Tienda</th>
                <th>Estado</th>
                <th>Sub Gerente</th>
                <th className="text-center">Acción</th>
            </tr>
        </thead>
        <tbody>
            {
                coordinadorClientes.map((cliente) => {
                    return (<tr key={cliente.idTienda}>
                        <td>{cliente.nombreCliente}</td>
                        <td>{cliente.nombreZonaSted}</td>
                        <td>{cliente.nombreTienda}</td>
                        <td>{cliente.nombreEstado}</td>
                        <td>{cliente.subGerente}</td>
                        <td><div className="text-center"><Button variant="link" onClick={() => eliminarCliente(cliente)}><i className="align-center fa-solid fa-trash text-danger"></i></Button></div>
                        </td>
                    </tr>)
                })
            }
        </tbody>
    </Table>);
}