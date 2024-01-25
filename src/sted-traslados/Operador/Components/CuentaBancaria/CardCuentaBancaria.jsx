import API from "../../../../store/api";

import { useEffect, useState } from "react";
import { Button, Card, Table, Modal, Form } from "react-bootstrap";

import { ModalCrearCuentaBancaria } from "./ModalCrearCuentaBancaria";
import { CuentaBancariaTable } from "./CuentaBancariaTable";


export const CardCuentaBancaria = ({ operador }) => {

    const [show, setShow] = useState(false);

    const handleShow = () => setShow(true);

    const [cuentasBancarias, setCuentasBancarias] = useState([]);

    useEffect(() => {
        getCuentasBancarias();
    }, [])

    const getCuentasBancarias = async () => {

        const response = await API.get(`EmpleadoCuentaBancarias/${operador.idEmpleado}`);

        if (response.status == 200 || response.status == 204) {
            setCuentasBancarias(response.data)
        }

    }

    const [cuentaBancaria, setCuentaBancaria] = useState({
        idCuenta:0,
        idEmpleado: '',
        numeroCuenta: '',
        idBanco: 2,
        cuentaPrincial: false
    });

    return (<>
        <div className="col col-sm-12">
            <ModalCrearCuentaBancaria
                show={show}
                setShow={setShow}
                operador={operador}
                cuentasBancarias={cuentasBancarias}
                cuentaBancaria={cuentaBancaria}
                getCuentasBancarias={getCuentasBancarias} />
            <Card >
                <div className="d-flex justify-content-start mt-2 ms-3 me-3">
                    <Button disabled={operador.idEmpleado == 0 ? true : false} onClick={handleShow} variant="custom" className="me-3 mt-3" >Agregar Nueva Cuenta <i className="fa-solid fa-plus"></i></Button>
                </div>
                <Card.Body >
                    <CuentaBancariaTable cuentasBancarias={cuentasBancarias} setCuentasBancarias={setCuentasBancarias} show={show} setShow={setShow} operador={operador}  getCuentasBancarias={getCuentasBancarias} setCuentaBancaria={setCuentaBancaria}   />

                </Card.Body>
            </Card>
        </div >
    </>);
}