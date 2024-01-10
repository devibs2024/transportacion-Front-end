import { Button, Table } from "react-bootstrap";
import API from "../../../../store/api";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { confirmarAccion } from "../../../../shared/Utils/modals";

export const CuentaBancariaTable = ({ operador, cuentasBancarias, setCuentasBancarias, setCuentaBancaria, setShow, show, getCuentasBancarias }) => {

    const MySwal = withReactContent(Swal)

    const editarCuentaBancaria = async(cuentaBancaria) => {


        console.log('Cuenta b:', cuentaBancaria)

        setCuentaBancaria(cuentaBancaria)

        setShow(true);
       

    }

    const eliminarCuentaBancaria = async (cuentaBancaria) => {


        confirmarAccion({ titulo: 'Eliminar Cuenta Bancaria', mensaje: 'Estas seguro que deseas eliminar la Cuenta Bancaria?' }).then(async (result) => {

            if (result.isConfirmed) {
                const response = await API.delete(`EmpleadoCuentaBancarias/${cuentaBancaria.idCuenta}`);

                if (response.status == 200 || response.status == 204) {

                    confirmarAccion({ titulo: 'Cuenta Eliminada', mensaje: 'La Cuenta fue eliminada satisfactoriamente' })

                    const filteredCuentasBancarias = cuentasBancarias.filter(x => x.idCuenta != cuentaBancaria.idCuenta);

                    setCuentasBancarias(filteredCuentasBancarias)

                }
            }
        });

    }

    return (<Table>
        <thead><tr><th>Numero de Cuenta</th><th>Cuenta Principal</th><th>Activa</th><th>Banco</th><th className="text-center">Acción</th></tr></thead>
        <tbody>
            {
                cuentasBancarias.map((cuentaBancaria) => {

                 
                    return (<tr key={cuentaBancaria.idCuenta}><td>{cuentaBancaria.cuentaBancaria}</td><td>{cuentaBancaria.cuentaPrincipal ? "Sí" : "No"}</td><td>{cuentaBancaria.activa ? "Sí" : "No"}</td><td>{cuentaBancaria.bancoDesc}</td><th><div className="text-end"><Button variant="link" onClick={() => editarCuentaBancaria(cuentaBancaria)}><i className="fa-solid fa-pencil text-warning"></i></Button><Button variant="link" onClick={() => eliminarCuentaBancaria(cuentaBancaria)}><i className="fa-solid fa-trash text-danger"></i></Button></div></th></tr>)
                })
            }
        </tbody>
    </Table>);
}