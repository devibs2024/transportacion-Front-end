import { useEffect, useState } from "react";
import { Button, Card } from "react-bootstrap";
import { SucursalTable } from "./SucursalTable";
import { ModalCrearSucursal } from "./ModalCrearSucursal";
import API from "../../../../store/api";

export const CardSucursal = ({ operador }) => {

    const [show, setShow] = useState(false);

    const [operadorSucursales, setOperadorSucursales] = useState([]);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    useEffect(() => {
        getOperadorSucursales();
    }, []);

    const getOperadorSucursales = async () => {

        const response = await API.get(`OperadorSucursal/${operador.idEmpleado}`);

        if (response.status == 200 || response.status == 204) {
            setOperadorSucursales(response.data)
        }
    }

    return (<>
        <div className="col col-sm-12">
            <ModalCrearSucursal operador={operador} show={show} setShow={setShow} handleClose={handleClose} setOperadorSucursales={setOperadorSucursales} getOperadorSucursales={getOperadorSucursales} operadorSucursales={operadorSucursales} />
            <Card>
                <div className="d-flex justify-content-start mt-2 ms-3 me-3">
                    <Button disabled={operador.idEmpleado == 0 ? true : false} onClick={handleShow} variant="custom" className="me-3 mt-3">Agregar Nueva Sucursal <i className="fa-solid fa-plus"></i></Button>
                </div>
                <Card.Body >
                    <div className="p-3">
                        <SucursalTable operador={operador} operadorSucursales={operadorSucursales}  setOperadorSucursales={setOperadorSucursales} />
                    </div>
                </Card.Body>
            </Card>
        </div>
    </>);
}