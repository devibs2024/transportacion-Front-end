import { useEffect, useState } from "react";
import { Button, Card, Table } from "react-bootstrap";
import API from "../../../../store/api";
import { TiendasTable } from "./TiendasTable";
import { ModalCrearZonaStedTienda } from "./ModalCrearZonaStedTienda";

export const CardShowZonaStedTienda = ({ cliente }) => {

    const [show, setShow] = useState(false);

    const handleShow = () => setShow(true);
    const [zonaStedTiendas, setZonaStedTiendas] = useState([])

    useEffect(() => {
        getTiendas();
    }, [])

    const getTiendas = async () => {

        const response = await API.get(`Tiendas/${cliente.idCliente}`);

        if (response.status == 200 || response.status == 204) {
            setZonaStedTiendas(response.data)
        }

    }
    return (
        <div className="col col-sm-12">
            <Card>
                <ModalCrearZonaStedTienda cliente={cliente} getTiendas={getTiendas} zonaStedTiendas={zonaStedTiendas} setZonaStedTiendas={setZonaStedTiendas} show={show} setShow={setShow} />
                <div className="d-flex justify-content-start mt-2 ms-3 me-3">
                    <Button onClick={handleShow} variant="custom" className="me-3 mt-3" >Agregar Nueva Tienda <i className="fa-solid fa-plus"></i></Button>
                </div>
                <Card.Body >
                    <div className="p-3">
                        <TiendasTable show={show} setShow={setShow} cliente={cliente} zonaStedTiendas={zonaStedTiendas} setZonaStedTiendas={setZonaStedTiendas} />
                    </div>
                </Card.Body>
            </Card>
        </div>
    )

}