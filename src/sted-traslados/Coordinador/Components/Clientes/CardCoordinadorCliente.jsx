import API from "../../../../store/api";

import { useEffect, useState } from "react";
import { Button, Card, Table } from "react-bootstrap";

import { ModalCrearCoordinadorCliente } from "./ModalCrearCoordinadorCliente";
import { CoordinadorTable } from "./CoordinadoresTable";

export const CardCoordinadorCliente = ({ coordinador }) => {

    const [show, setShow] = useState(false);

    const handleShow = () => setShow(true);
    const [coordinadorClientes, setCoordinadorClientes] = useState([])

    useEffect(() => {
        getCoordinadorClientes();
    }, [])

    const getCoordinadorClientes = async () => {

        const response = await API.get(`TiendasCoordinador/${coordinador.idEmpleado},${3}`);

        if (response.status == 200 || response.status == 204) {
            setCoordinadorClientes(response.data)
        }

    }
    return (
        <div className="col col-sm-12">
            <Card>
                <ModalCrearCoordinadorCliente
                    coordinador={coordinador}
                    getCoordinadorClientes={getCoordinadorClientes}
                    coordinadorClientes={coordinadorClientes}
                    setCoordinadorClientes={setCoordinadorClientes}
                    show={show}
                    setShow={setShow} />
                <div className="d-flex justify-content-start mt-2 ms-3 me-3">
                    <Button onClick={handleShow} variant="custom" className="me-3 mt-3" >Asignación de Tienda <i className="fa-solid fa-plus"></i></Button>
                </div>
                <Card.Body >
                    <div className="p-3">
                        <CoordinadorTable coordinador={coordinador} coordinadorClientes={coordinadorClientes} setCoordinadorClientes={setCoordinadorClientes} />
                    </div>
                </Card.Body>
            </Card>
        </div>
    )

}