import { useEffect, useState } from "react";
import { Button, Card, Table } from "react-bootstrap";
import { ModalCrearOperadorVehiculo } from "./ModalCrearOperadorVehiculo";
import API from "../../../../store/api";
import { OperadorVehiculoTable } from "./OperadorVehiculoTable";
import { procesarErrores } from '../../../../shared/Utils/procesarErrores';


export const CardOperadorVehiculo = ({ vehiculo }) => {

    const [show, setShow] = useState(false);
    const handleShow = () => setShow(true);
    const [idEmpleado, setIdEmpleado] = useState(0);
    const [operadorVehiculos, setOperadorVehiculos] = useState([]);

    useEffect(() => {

        if (idEmpleado != 0 && vehiculo.idVehiculo != 0) {

            getOperadorVehiculos(idEmpleado,vehiculo.idVehiculo);
        } else {
            getAsignacionVehiculo(vehiculo.idVehiculo);
        }
    }, [...operadorVehiculos])

    const getAsignacionVehiculo = async (idVehiculo) => {

        const response = await API.get(`AsignacionarVehiculo/${idVehiculo}`);

        if (response.status == 200 || response.status == 204) {

            response.data.map(o => {
                setIdEmpleado(o.idEmpleado)
            })
        }

    }

    const getOperadorVehiculos = async (idEmpleado,idVehiculo) => {

        if (idEmpleado != 0) {
            console.log(idEmpleado);
            const response = await API.get(`OperadorVehiculo/${idEmpleado},${idVehiculo}`);

            if (response.status === 200 || response.status === 204) {
                // Actualizar el estado con la data recibida de la respuesta
                setOperadorVehiculos([response.data]);
            }
        }
    };
    return (
        <div className="col col-sm-12">
            <Card>
                <div className="d-flex justify-content-start mt-2 ms-3 me-3">
                    <Button onClick={handleShow} variant="custom" className="me-3 mt-3" >Asignar un Vehiculo <i className="fa-solid fa-plus"></i></Button>
                </div>
                <ModalCrearOperadorVehiculo getOperadorVehiculos={getOperadorVehiculos(idEmpleado,vehiculo.idVehiculo)} setIdEmpleado={setIdEmpleado} idEmpleado={idEmpleado} vehiculo={vehiculo} show={show} setShow={setShow} />
                <Card.Body>
                    <div className="p-3">
                        <OperadorVehiculoTable vehiculo={vehiculo} operadorVehiculos={operadorVehiculos} setOperadorVehiculos={setOperadorVehiculos } />
                    </div>
                </Card.Body>
            </Card>
        </div>)
}