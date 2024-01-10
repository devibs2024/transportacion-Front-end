import { useEffect, useState } from "react";
import { Button, Card } from "react-bootstrap";
import { MarcasTable } from "./MarcasTable";
import { ModalCrearMarcas } from "./ModalCrearMarcas";
import API from "../../../../store/api";

export const CardMarcas = () => {

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);


    const [tipovehiculoMarcas, setTipoVehiculoMarcas] = useState([]);

    useEffect(() => {
        getTipoVehiculoMarcas();
    }, []);

    const getTipoVehiculoMarcas = async () => {

        const response = await API.get(`MarcaVehiculo`);

        if (response.status == 200 || response.status == 204) {
            setTipoVehiculoMarcas(response.data)
        }
    }

    return (<>
        <div className="col col-sm-12">
            <ModalCrearMarcas  show={show} setShow={setShow} handleClose={handleClose} setTipoVehiculoMarcas={setTipoVehiculoMarcas}  tipovehiculoMarcas={tipovehiculoMarcas} />
            <Card>
                <div className="d-flex justify-content-start mt-2 ms-3 me-3">
                    <Button  onClick={handleShow} variant="custom" className="me-3 mt-3">Agregar Nueva Marca <i className="fa-solid fa-plus"></i></Button>
                </div>
                <Card.Body >
                    <div className="p-3">
                        <MarcasTable getTipoVehiculoMarcas={getTipoVehiculoMarcas} tipovehiculoMarcas={tipovehiculoMarcas}  setTipoVehiculoMarcas={setTipoVehiculoMarcas} />
                    </div>
                </Card.Body>
            </Card>
        </div>
    </>);
}