import { useEffect, useState } from "react";
import { Button, Card, Table, Modal, Form } from "react-bootstrap";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import API from "../../../../store/api";
import { useGetCoordinador } from "../../../../hooks/useGetCoordinador";
import { ModalCrearNuevoCoordinador } from "./ModalCrearNuevoCoordinador";
import { OperadorCordinadorTable } from "./OperadorCoordinadorTable";

export const CardOperadorCoordinador = ({ operador }) => {

    const [show, setShow] = useState(false);

    const handleShow = () => setShow(true);

    const [coordinadores, setCoordinadores] = useState([]);

    useEffect(() => {
        getCoordinadores();
    }, [])

    const getCoordinadores = async () => {

        const response = await API.get(`OperadorCoordinador/${operador.idEmpleado}`);

        console.log(operador)
        if (response.status == 200 || response.status == 204) {
            console.log(response.data)
            setCoordinadores(response.data)
        }
        return response;
    }

    return (<>
        <div className="col col-sm-12">

            <Card >
                <ModalCrearNuevoCoordinador operador={operador} show={show} setShow={setShow} getCoordinadores={getCoordinadores} />
                <div className="d-flex justify-content-start mt-2 ms-3 me-3">
                    <Button onClick={handleShow} variant="custom" className="me-3 mt-3" disabled={operador.idEmpleado == 0 ? true : false}>Agregar Nuevo coordinador <i className="fa-solid fa-plus"></i></Button>
                </div>
                <Card.Body >
                    <div className="p-3">
                        <OperadorCordinadorTable operador={operador} setCoordinadores={setCoordinadores} coordinadores={coordinadores} />
                    </div>
                </Card.Body>
            </Card>
        </div>
    </>)

}