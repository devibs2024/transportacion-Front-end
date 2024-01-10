import { Table, Button } from "react-bootstrap";
import API from "../../../../store/api";
import Swal from "sweetalert2";
import { accionExitosa, accionFallida, confirmarAccion } from '../../../../shared/Utils/modals';
import { procesarErrores } from "../../../../shared/Utils/procesarErrores";

export const ZonaStedsTable = ({ cliente, clienteZonaSteds, setClienteZonaSteds }) => {

    const eliminarZonaSted = async (zonaSted) => {


        confirmarAccion({ titulo: 'Eliminar Zona', mensaje: 'Estas seguro que deseas eliminar la zona?' }).then(async (result) => {
            try {
                if (result.isConfirmed) {
                    const response = await API.delete(`zonaSteds/${zonaSted.idZonaSted}`);

                    if (response.status == 200 || response.status == 204) {

                        const filtersClienteZonaSteds = clienteZonaSteds.filter(x => x.idZonaSted != zonaSted.idZonaSted);
                        setClienteZonaSteds(filtersClienteZonaSteds);

                        accionExitosa({ titulo: 'ZonaSted Eliminada', mensaje: 'El zonaSted ha sido eliminado Exitosamente' });

                    } else {

                        accionFallida({ titulo: 'ZonaSted no pudo ser Eliminada', mensaje: 'Ha ocurrido un error al intentar eliminar la zonaSted' })
                    }
                }
            } catch (e) {
                let errores = e.response.data;

                accionFallida({ titulo: 'ZonaSted no pudo ser Eliminada', mensaje: procesarErrores(errores) })
            }

        })
    }

    return (<Table>
        <thead>
            <tr>
                <th>ZonaSted</th>
                <th>ClaveDET</th>
                <th>Activa</th>
                <th className="text-center">Acción</th>
            </tr>
        </thead>
        <tbody>
            {
                clienteZonaSteds.map((zonaSted) => {
                    return (<tr key={cliente.idZonaSted}>
                        <td>{zonaSted.nombreZona}</td>
                        <td>{zonaSted.claveDET}</td>
                        <td>{zonaSted.activa == true ? "SI" : "NO"}</td>
                        <td><div className="text-center"><Button variant="link" onClick={() => eliminarZonaSted(zonaSted)}><i className="align-center fa-solid fa-trash text-danger"></i></Button></div></td>
                    </tr>)
                })
            }
        </tbody>
    </Table>);
}