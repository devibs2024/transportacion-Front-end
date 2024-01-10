import { useEffect, useState } from "react";
import API from "../../../../store/api";
import { Button, Card } from "react-bootstrap";
import { ModalCrearFormato } from "./ModalCrearFormato";
import { FormatoClienteTable } from "./FormatoClienteTable"

export const CardFormato = ({ cliente }) => {

    const [show, setShow] = useState(false);
    const handleShow = () => setShow(true);


    const [formatoClientes, setFormatoClientes] = useState([]);


    useEffect(() => {
        getFormatoClientes();
    }, [])

    const getFormatoClientes = async () => {
        const response = await API.get(`FormatoClientes`);

        if (response.status == 200 || response.status == 204) {

            console.log(response.data)

            setFormatoClientes([...response.data])
        }
    }
    return (
        <div className="col col-sm-12">
            <Card >
                <ModalCrearFormato cliente={cliente} getFormatoClientes={getFormatoClientes()} show={show} setShow={setShow} setFormatoClientes={setFormatoClientes} formatoClientes={formatoClientes} />
                <div className="d-flex justify-content-start mt-2 ms-3 me-3">
                    <Button onClick={handleShow} variant="custom" className="me-3 mt-3">Agregar Nuevo Formato<i className="fa-solid fa-plus"></i></Button>
                </div>
                <Card.Body >
                    <div className="p-3">
                        <FormatoClienteTable cliente={cliente} setFormatoClientes={setFormatoClientes} formatoClientes={formatoClientes} />
                    </div>
                </Card.Body>
            </Card>
        </div>
    );

}