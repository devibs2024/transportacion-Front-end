import { useEffect, useState } from "react";
import { Button, Card, Table } from "react-bootstrap";
import { ModalCrearTarifaTipoVehiculo } from "./ModalCrearTarifaTipoVehiculo";
import API from "../../../../store/api";
import { TarifaTipoVehiculoTable } from "./TarifaTipoVehiculoTable";

export const CardTarifaTipoVehiculo = ({ tipovehiculo }) => {

    const [show, setShow] = useState(false);
    const handleShow = () => setShow(true);
    const [tipovehiculoTarifa, setTipoVehiculoTarifa] = useState([])

    useEffect(() => {
        getTipoVehiculoTarifa();
    }, [])

    const getTipoVehiculoTarifa = async () => {

        const response = await API.get(`TarifaTipoVehiculo`);

        if (response.status == 200 || response.status == 204) {
            setTipoVehiculoTarifa(response.data)
        }

    }

    return (
        <div className="col col-sm-12">
            <Card>

                <ModalCrearTarifaTipoVehiculo setTipoVehiculoTarifa={setTipoVehiculoTarifa} tipovehiculoTarifa= {tipovehiculoTarifa} show={show} setShow={setShow} />
                <div className="d-flex justify-content-start mt-2 ms-3 me-3">
                    <Button onClick={handleShow} variant="custom" className="me-3 mt-3" >Agregar Nueva Tarifa <i className="fa-solid fa-plus"></i></Button>
                </div>
                <Card.Body >
                    <div className="p-3">
                        <TarifaTipoVehiculoTable getTipoVehiculoTarifa={getTipoVehiculoTarifa} tipovehiculo={tipovehiculo} tipovehiculoTarifa={tipovehiculoTarifa} setTipoVehiculoTarifa={setTipoVehiculoTarifa} />
                    </div>
                </Card.Body>
            </Card>
        </div>)
}