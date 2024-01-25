import { useEffect, useState } from "react";
import { Button, Card, Table } from "react-bootstrap";
import API from "../../../../store/api";
import { ZonaStedsTable } from "./ZonaStedsTable";
import { ModalCrearClienteZonaSted } from "./ModalCrearClienteZonaSted";

export const CardShowClienteZonaSted = ({ cliente, zonaSted, setZonaSted }) => {

    const [show, setShow] = useState(false);

    const handleShow = () => setShow(true);
    const [clienteZonaSteds, setClienteZonaSteds] = useState([])

    useEffect(() => {
        getZonaSteds();
    }, [])

    const getZonaSteds = async () => {

        const response = await API.get(`ZonaSteds`);

        if (response.status == 200 || response.status == 204) {
            setClienteZonaSteds(response.data.filter(x => x.idCliente === cliente.idCliente))
        }

    }
    return (
        <div className="col col-sm-12">
            <Card>
                <ModalCrearClienteZonaSted zonaSted={zonaSted} getZonaSteds={getZonaSteds} setZonaSted={setZonaSted} cliente={cliente} clienteZonaSteds={clienteZonaSteds} setClienteZonaSteds={setClienteZonaSteds} show={show} setShow={setShow} />
                <div className="d-flex justify-content-start mt-2 ms-3 me-3">
                    <Button onClick={handleShow} variant="custom" className="me-3 mt-3" >Agregar Nueva ZonaSted <i className="fa-solid fa-plus"></i></Button>
                </div>
                <Card.Body >
                    <div className="p-3">
                        <ZonaStedsTable cliente={cliente} clienteZonaSteds={clienteZonaSteds} setClienteZonaSteds={setClienteZonaSteds} />
                    </div>
                </Card.Body>
            </Card>
        </div>
    )

}