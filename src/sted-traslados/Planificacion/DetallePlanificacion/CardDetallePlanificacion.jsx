import { useEffect, useState } from "react";

import { ModalCrearDetallePlanificacion } from "./ModalCrearDetallePlanificacion";
import { Button, Card, Table, Modal, Form } from "react-bootstrap";
import { PlanificacionDetalleTable } from "./CardDetallePlanificacionTable";
import { getDetallesPlanificacion } from "./detallePlanificacionUtils";


export const CardDetallePlanificacion = ({ setPlanificacion, planificacion }) => {

    const [show, setShow] = useState(false);
    const handleShow = () => setShow(true);
    const [detallePlanificacion, setDetallePlanificacion] = useState({});
    const [detallesGeneralesPlanificacion, setDetallesGeneralesPlanificacion] = useState([]);

    const [detallesPlanificacion, setDetallesPlanificacion] = useState([]);

    useEffect(() => {
        getDetallesPlanificacion(planificacion, setDetallesPlanificacion);
    }, [])

    useEffect(() => {

    }, []);

    return (
        <>
            <Card>
                <div className="col col-sm-12">
                    <ModalCrearDetallePlanificacion planificacion={planificacion}
                        show={show}
                        setShow={setShow}
                        detallePlanificacion={detallePlanificacion}
                        getDetallesPlanificacion={getDetallesPlanificacion}
                        setDetallePlanificacion={setDetallePlanificacion}
                        setDetallesPlanificacion={setDetallesPlanificacion}
                    />

                    <Card.Body>

                        <Card.Body>
                            <div className="d-flex justify-content-start mt-2 ms-3 me-3">
                                <Button onClick={() => { setDetallePlanificacion({}); handleShow(); }} variant="custom" className="me-3 mt-3" >Agregar Nuevo Detalle de Planificacion <i className="fa-solid fa-plus"></i></Button>
                            </div>
                            <div className="p-3">
                                {/* <PlanificacionDetalleTable detallePlanificacion={detallePlanificacion} setDetallePlanificacion={setDetallePlanificacion} detallesPlanificacion={detallesPlanificacion} setDetallesPlanificacion={setDetallesPlanificacion} handleShow={handleShow} /> */}
                                <PlanificacionDetalleTable handleShow={handleShow} setDetallePlanificacion={setDetallePlanificacion}   detallePlanificacion={detallePlanificacion} planificacion={planificacion} detallesGeneralesPlanificacion={detallesGeneralesPlanificacion}  setDetallesGeneralesPlanificacion={setDetallesGeneralesPlanificacion} />

                            </div>
                        </Card.Body>
                    </Card.Body>

                </div >
            </Card>
        </>
    );
};
