import { Table } from "react-bootstrap";
import API from "../../../../store/api";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { Button } from 'react-bootstrap'
import { accionExitosa, confirmarAccion } from "../../../../shared/Utils/modals";

export const OperadorHorarioTable = ({ operador, horarios, getHorarios }) => {



    const MySwal = withReactContent(Swal)

    const eliminarHorario = async (horario) => {

        await confirmarAccion({ titulo: 'Eliminar Horario', mensaje: 'Estas seguro que deseas eliminar el Horario?' }).then(async (result) => {

            if (result.isConfirmed) {

                const response = await API.delete(`EmpleadoHorarios`, {
                    headers: {},
                    data:
                    {
                        idHorario: horario.idHorario,
                        idEmpleado: operador.idEmpleado
                    }


                });


                if (response.status == 200 || response.status == 204) {


                    getHorarios();
                    
                    accionExitosa({ titulo: 'Eliminar Horario', mensaje: 'Horario Eliminado satisfactoriamente' })

                }
            }
        });
    }

    return (<Table>
        <thead><tr><th>Dia</th><th>Hora Inicio</th><th>Hora Fin</th><th className="text-center">Acción</th></tr></thead>
        <tbody>
            {
                horarios.map((horario) => {

                    console.log(horario)

                    return (<tr key={horario.idHorario}>
                        <td>{horario.descripcion}</td> <td>{horario.horaInicio}</td> <td>{horario.horaFin}</td>
                        <td><div className="text-center"><Button variant="link" onClick={() => eliminarHorario(horario)}><i className="fa-solid fa-trash text-danger"></i></Button></div></td>
                    </tr>)
                })
            }
        </tbody>
    </Table>);
}