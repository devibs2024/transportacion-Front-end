import { Table } from "react-bootstrap";
import API from "../../../../store/api";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import Button from 'react-bootstrap/Button';
import { accionExitosa, confirmarAccion } from "../../../../shared/Utils/modals";

export const SucursalTable = ({ operador, operadorSucursales, setOperadorSucursales }) => {

    const MySwal = withReactContent(Swal)

    const eliminarSucursal = async (operadorSucursal) => {


        confirmarAccion({ titulo: 'Eliminar Sucursal', mensaje: 'Estas seguro que deseas eliminar la Sucursal?' }).then(async (result) => {
            if (result.isConfirmed) {
                const response = await API.delete(`OperadorSucursal`, {
                    headers: {},
                    data: {
                        idEmpleado: operador.idEmpleado,
                        idSucursal: operadorSucursal.idSucursal
                    }
                });

                if (response.status == 200 || response.status == 204) {

                    const filtersOperadorSucursales = operadorSucursales.filter(x => x.idSucursal != operadorSucursal.idSucursal);
                    setOperadorSucursales(filtersOperadorSucursales);

                    accionExitosa({ titulo: 'Sucursal Eliminada', mensaje: 'La sucursal ha sido eliminada Exitosamente' });

                } else {

                    accionExitosa({ titulo: 'Sucursal no pudo ser Eliminada', mensaje: 'Ha ocurrido un error al intentar eliminar la sucursal' })
                }
            }
        })
    }

    return (<Table>
        <thead><tr><th>Nombre de Sucursal</th><th className="text-center">Acción</th></tr></thead>
        <tbody>
            {
                operadorSucursales.map((operadorSucursal) => {

                    return (<tr key={operadorSucursal.idSucursal}><td>{operadorSucursal.nombreSucursal}</td><th><div className="text-end"><Button variant="link" onClick={() => eliminarSucursal(operadorSucursal)}><i className="fa-solid fa-trash text-danger"></i></Button></div></th></tr>)
                })
            }
        </tbody>
    </Table>);
}