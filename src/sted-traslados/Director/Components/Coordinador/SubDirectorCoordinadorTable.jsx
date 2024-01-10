import { Table } from "react-bootstrap";
import API from "../../../../store/api";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { accionExitosa, confirmarAccion } from "../../../../shared/Utils/modals";

export const SubDirectorCordinadorTable = ({ subDirector, coordinadores, setCoordinadores }) => {

    const MySwal = withReactContent(Swal)

    const eliminarCoordinador = async (coordinador) => {


        confirmarAccion({ titulo: 'Eliminar Coordinador', mensaje: 'Estas seguro que deseas eliminar el Coordinador?' }).then(async (result) => {
            if (result.isConfirmed) {
                const response = await API.delete(`DirectorCoordinadores`, {
                    headers: {},
                    data: {
                        idSubDirector: subDirector.idEmpleado,
                        idCoordinador: coordinador.idCoordinador
                    }
                });

                if (response.status == 200 || response.status == 204) {

                    accionExitosa({ titulo: 'Coordinador Eliminado', mensaje: 'El coordinador ha sido eliminado satisfactoriamente' })

                    const filteredCoordinadores = coordinadores.filter(x => x.idSubDirector != subDirector.idSubDirector)

                    setCoordinadores(filteredCoordinadores);
                }
            }
        });


    }

    return (<Table>
        <thead>
            <tr>
                <th>Nombre</th>
                <th className="text-center">Acción</th>
            </tr>
        </thead>
        <tbody>


            {
                coordinadores.map((coordinador) => {
                    return (<tr key={coordinador.idCoordinador}><td>{coordinador.nombreCoordinador}</td><th><div className="text-end"><a href="javascript:void(0)" onClick={() => eliminarCoordinador(coordinador)}><i className="fa-solid fa-trash text-danger"></i></a></div></th></tr>)
                })
            }
        </tbody>
    </Table>);
}