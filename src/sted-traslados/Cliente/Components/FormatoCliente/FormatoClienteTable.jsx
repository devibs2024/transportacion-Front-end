import { accionExitosa, accionFallida, confirmarAccion } from "../../../../shared/Utils/modals";
import { procesarErrores } from "../../../../shared/Utils/procesarErrores";
import API from "../../../../store/api";
import { Table, Button } from "react-bootstrap";


export const FormatoClienteTable = ({ cliente, formatoClientes, setFormatoClientes }) => {

    const eliminarFormato = async (formato) => {

        confirmarAccion({ titulo: 'Eliminar Formato', mensaje: 'Estas Seguro de eliminar este Formato?' }).then(async (result) => {

            try {
                if (result.isConfirmed) {
                    const response = await API.delete(`FormatoClientes/${formato.idFormato},${cliente.idCliente}`);

                    if (response.status == 200 || response.status == 204) {

                        accionExitosa({ titulo: 'Formato Eliminado', mensaje: 'El formato ha sido eliminado satisfactoriamente' })

                        const filteredFormatos = formatoClientes.filter(x => x.idFormato != formato.idFormato)

                        setFormatoClientes(filteredFormatos);
                    } else {
                        accionFallida({ titulo: 'Formato Eliminado', mensaje: 'El formato ha sido eliminado satisfactoriamente' })
                    }
                }
            } catch (error) {

                let errores = error.response.data;
                accionFallida({ titulo: 'Formato Eliminado', mensaje: procesarErrores(errores) })
            }

        });

    }

    return (<Table>
        <thead><tr><th>Formato</th><th>Estatus</th><th className="text-center">Acción</th></tr></thead>
        <tbody>
            {
                formatoClientes.map((formato) => {
                    return (<tr key={formato.idFormato}>
                        <td>{formato.descripcionFormato}</td>
                        <td>{formato.estado == true ? "SI" : "NO"}</td>
                        <td>
                            <div className="text-center">
                                <Button variant="link" onClick={() => eliminarFormato(formato)}><i className="align-center fa-solid fa-trash text-danger"></i></Button>
                            </div>
                        </td>
                    </tr>)
                })
            }
        </tbody>
    </Table>

    );


}