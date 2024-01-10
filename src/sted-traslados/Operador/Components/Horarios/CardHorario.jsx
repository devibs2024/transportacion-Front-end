import { useEffect, useState } from "react";
import { Button, Card, Table } from "react-bootstrap";
import API from "../../../../store/api";
import { OperadorHorarioTable } from "./OperadorHorarioTable";
import { ModalCrearOperadorHorario } from "./ModalCrearOperadorHorario";

export const CardOperadorHorario = ({ operador }) => {

    const [show, setShow] = useState(false);

    const handleShow = () => setShow(true);
    const [operadorHorarios, setOperadorHorarios] = useState([])

    useEffect(() => {
        getOperadorHorarios();
    }, [])

    const getOperadorHorarios = async () => {

        const response = await API.get(`EmpleadoHorarios/${operador.idEmpleado}`);

        if (response.status == 200 || response.status == 204) {
            setOperadorHorarios(response.data)
        }
    }

    return (
        <div className="col col-sm-12">
            <Card>
                <ModalCrearOperadorHorario operador={operador} operadorHorarios={operadorHorarios} setOperadorHorarios = {setOperadorHorarios} show={show} setShow={setShow} />
                <div className="d-flex justify-content-start mt-2 ms-3 me-3">
                    <Button disabled = { operador.idEmpleado == 0 ? true :false} onClick={handleShow} variant="custom" className="me-3 mt-3" >Agregar Nuevo Horario <i className="fa-solid fa-plus"></i></Button>
                </div>
                <Card.Body >
                    <div className="p-3">
                        <OperadorHorarioTable operador={operador} horarios={operadorHorarios} getHorarios={getOperadorHorarios} />
                    </div>
                </Card.Body>
            </Card>
        </div>)
}