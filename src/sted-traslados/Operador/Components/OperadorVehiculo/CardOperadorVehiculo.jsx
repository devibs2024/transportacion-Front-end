import { useEffect, useState } from "react";
import { Button, Card, Table } from "react-bootstrap";
import { ModalCrearOperadorVehiculo } from "./ModalCrearOperadorVehiculo";
import API from "../../../../store/api";
import { OperadorVehiculoTable } from "./OperadorVehiculoTable";

export const CardOperadorVehiculos = ({ operador }) => {

    const [show, setShow] = useState(false);
    const handleShow = () => setShow(true);
    const [operadorVehiculos, setOperadorVehiculos] = useState([])

    useEffect(() => {
        getOperadorVehiculos();
    }, [])

    const getOperadorVehiculos = async () => {

        const response = await API.get(`OperadorVehiculo/${operador.idEmpleado}`);

        if (response.status == 200 || response.status == 204) {
            setOperadorVehiculos(response.data)
        }

    }

    return (
        <div className="col col-sm-12">
            <Card>
                <ModalCrearOperadorVehiculo operador={operador} getOperadorVehiculos={getOperadorVehiculos} show={show} setShow={setShow} />
                <div className="d-flex justify-content-start mt-2 ms-3 me-3">
                    <Button disabled={operador.idEmpleado == 0 ? true : false} onClick={handleShow} variant="custom" className="me-3 mt-3" >Agregar Nuevo Vehiculo <i className="fa-solid fa-plus"></i></Button>
                </div>
                <Card.Body >
                    <div className="p-3">
                        <OperadorVehiculoTable operador={operador} operadorVehiculos={operadorVehiculos} setOperadorVehiculos={setOperadorVehiculos} />
                    </div>
                </Card.Body>
            </Card>
        </div>)
}