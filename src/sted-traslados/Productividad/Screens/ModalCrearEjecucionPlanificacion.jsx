import API from "../../../store/api";

import { useEffect, useState } from "react";

import { useNavigate } from "react-router";
import { useLocation } from "react-router-dom";

import { useFormik } from 'formik';
import { Form, Modal, Button } from "react-bootstrap";

import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import { Calendar } from 'primereact/calendar';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import { accionExitosa, accionFallida } from '../../../shared/Utils/modals';

export const ModalCrearEjecucionPlanificacion = ({ show, setShow, productividad, detalle, setDetalle, ejecuciones, setEjecuciones, operadoresOptions, tiendasOptions, operadorVehiculosOptions }) => {

    //####################################################################################################################################################
    //### VARIABLES GLOBALES

    const navigate = useNavigate();
    const location = useLocation();

    const [error, setError] = useState(null);

    const handleClose = () => setShow(false);

    //####################################################################################################################################################
    //### EVENTOS

    useEffect(() => {


    }, [])

    const formik = useFormik({
        initialValues: {
            idPlanificacion: detalle.idPlanificacion,
            idDetallePlanificacion: 0,
            idEjecucionPlanificacion: 0,
            idOperador: detalle.idOperador,
            idTienda: detalle.idTienda,
            fecha: '',
            horaInicio: '',
            horaE: 0,
            minutoE: 0,
            horaFin: '',
            horaF: 0,
            minutoF: 0,
            descanso: false,
            incentivoFactura: 0,
            descuentoTardanza: 0,
            montoHorasExtras: 0,
            justificacion: '',
            idVehiculo: 0,
        },

        onSubmit: values => {

            let ejecucion = {
                idPlanificacion: detalle.idPlanificacion,
                idDetallePlanificacion: 0,
                idEjecucionPlanificacion: 0,
                idOperador: detalle.idOperador,
                idTienda: detalle.idTienda,
                fecha: formik.values.fecha,
                horaInicio: formik.values.horaInicio,
                horaE: 0,
                minutoE: 0,
                horaFin: formik.values.horaFin,
                horaF: 0,
                minutoF: 0,
                descanso: formik.values.descanso,
                incentivoFactura: 0,
                descuentoTardanza: 0,
                montoHorasExtras: 0,
                justificacion: '',
                idVehiculo: formik.values.idVehiculo,
            };

            postDetallePlanificacion(ejecucion);

        }

    });

    const CustomInput = ({ value, onClick }) => (
        <Form.Control
            className="form-control"
            type="text"
            onClick={onClick}
            value={value}
            readOnly
        />
    );

    //####################################################################################################################################################
    //### FUNCIONES

    const strFecha = (date) => {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');

        return `${year}-${month}-${day}`;
    };

    //####################################################################################################################################################
    //### API

    const getEjecuciones = async (pDetalle) => {

        try {

            setEjecuciones([])

            const response = await API.get(`Productividad/${pDetalle.idPlanificacion},${Number(pDetalle.idOperador)}`);

            if (response.status == 200 || response.status == 204) {
                setEjecuciones(response.data);
            }

        }
        catch (er) {

            if (er.response?.data) {
                setError(er.response.data);
                accionFallida({ titulo: 'E R R O R', mensaje: JSON.stringify(er.response.data) });
            }
            else {
                accionFallida({ titulo: 'E R R O R', mensaje: er.message });
            }

        }
    }

    const postDetallePlanificacion = async (pEjecucion) => {

        try {

            let HoraEntrada = new Date(pEjecucion.horaInicio)
            let HoraSalida = new Date(pEjecucion.horaFin)

            let pEjecucionPlanificacion =
            {
                idPlanificacion: pEjecucion.idPlanificacion,
                idDetallePlanificacion: pEjecucion.idDetallePlanificacion,
                idEjecucionPlanificacion: pEjecucion.idEjecucionPlanificacion,
                idOperador: pEjecucion.idOperador,
                idTienda: pEjecucion.idTienda,
                fecha: strFecha(pEjecucion.fecha),
                horaE: HoraEntrada.getHours(),
                minutoE: HoraEntrada.getMinutes(),
                horaF: HoraSalida.getHours(),
                minutoF: HoraSalida.getMinutes(),
                descanso: pEjecucion.descanso,
                incentivoFactura: pEjecucion.incentivoFactura,
                descuentoTardanza: pEjecucion.descuentoTardanza,
                montoHorasExtras: pEjecucion.montoHorasExtras,
                justificacion: pEjecucion.justificacion,
                tipoRegistro: 1,
                idVehiculo: pEjecucion.idVehiculo,
            }

            const response = await API.post("EjecucionPlanificaciones", pEjecucionPlanificacion);

            if (response.status == 200 || response.status == 204) {

                getEjecuciones(detalle);
                accionExitosa({ titulo: "Registro Individual de Productividad", mensaje: "¡Registro satisfactorio!" });
                setShow(false);

            }

        }
        catch (er) {

            if (er.response?.data) {
                setError(er.response.data);
                accionFallida({ titulo: 'E R R O R', mensaje: JSON.stringify(er.response.data) });
            }
            else {
                accionFallida({ titulo: 'E R R O R', mensaje: er.message });
            }

        }

    };

    //####################################################################################################################################################
    //### COMBOS   

    return (
        <Modal show={show} onHide={handleClose}>

            <Form onSubmit={formik.handleSubmit}>

                <Modal.Header closeButton>
                    <Modal.Title>Agregar Registro Individual de Planificación</Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    <Container>

                        <Row>

                            <Col>

                                <Form.Group controlId="idOperador">
                                    <Form.Label>Operador:</Form.Label>
                                    <Form.Control as="select"
                                        value={detalle.idOperador}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        disabled
                                    >
                                        <option value="">Seleccione el Operador</option>
                                        {operadoresOptions.map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </Form.Control>
                                    <Form.Text className="text-danger">
                                        {formik.touched.idOperador && formik.errors.idOperador ? (<div className="text-danger">{formik.errors.idOperador}</div>) : null}
                                    </Form.Text>
                                </Form.Group>

                            </Col>

                            <Col>

                                <Form.Group controlId="idTienda">
                                    <Form.Label>Tienda:</Form.Label>
                                    <Form.Control as="select"
                                        value={detalle.idTienda}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        disabled
                                    >
                                        <option value="">Seleccione la Tienda</option>
                                        {tiendasOptions.map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </Form.Control>
                                    <Form.Text className="text-danger">
                                        {formik.touched.idTienda && formik.errors.idTienda ? (<div className="text-danger">{formik.errors.idTienda}</div>) : null}
                                    </Form.Text>
                                </Form.Group>

                            </Col>

                        </Row>

                        <Row>

                            <Col>

                                <Form.Group controlId="idVehiculo">
                                    <Form.Label>Vehículo:</Form.Label>
                                    <Form.Control as="select"
                                        value={formik.values.idVehiculo}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    >
                                        <option value="">Seleccione el Vehículo</option>
                                        {operadorVehiculosOptions.map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </Form.Control>
                                    <Form.Text className="text-danger">
                                        {formik.touched.idVehiculo && formik.errors.idVehiculo ? (<div className="text-danger">{formik.errors.idVehiculo}</div>) : null}
                                    </Form.Text>
                                </Form.Group>

                            </Col>

                            <Col>
                            </Col>

                        </Row>

                        <Row>

                            <Col>

                                <Form.Group controlId="fecha">
                                    <Form.Label> Fecha: </Form.Label>
                                    <br />
                                    <DatePicker
                                        id="fecha"
                                        name="fecha"
                                        selected={formik.values.fecha ? new Date(formik.values.fecha) : null}
                                        includeDateIntervals={[{ start: new Date(productividad.fechaDesde), end: new Date(productividad.fechaHasta) }]}
                                        onChange={(date) => formik.setFieldValue('fecha', date)}
                                        onBlur={formik.handleBlur}
                                        showMonthDropdown
                                        showYearDropdown
                                        customInput={<CustomInput />}
                                    />
                                    {formik.touched.fecha && formik.errors.fecha ? (<Form.Text className="text-danger">{formik.errors.fecha}</Form.Text>) : null}
                                </Form.Group>

                            </Col>

                            <Col>
                            </Col>

                        </Row>

                        <Row>

                            <Col>

                                <Form.Group controlId="horaInicio">
                                    <Form.Label>Hora Entrada:</Form.Label>
                                    <br />
                                    <Calendar
                                        id="horaInicio"
                                        inputId="horaInicio"
                                        timeOnly
                                        hourFormat="24"
                                        dateFormat="HH:mm:ss"
                                        readOnlyInput
                                        inline
                                        onChange={(e) => formik.setFieldValue('horaInicio', new Date(e.target.value))}
                                        value={formik.values.horaInicio ? new Date(formik.values.horaInicio) : new Date()}
                                    />
                                    {formik.touched.horaInicio && formik.errors.horaInicio ? (<Form.Text className="text-danger">{formik.errors.horaInicio}</Form.Text>) : null}
                                </Form.Group>

                            </Col>

                            <Col>

                                <Form.Group controlId="horaFin">
                                    <Form.Label>Hora Salida:</Form.Label>
                                    <br />
                                    <Calendar
                                        id="horaFin"
                                        inputId="horaFin"
                                        timeOnly
                                        hourFormat="24"
                                        dateFormat="HH:mm:ss"
                                        readOnlyInput
                                        inline
                                        onChange={(e) => formik.setFieldValue('horaFin', new Date(e.target.value))}
                                        value={formik.values.horaFin ? new Date(formik.values.horaFin) : new Date()}
                                    />
                                    {formik.touched.horaFin && formik.errors.horaFin ? (<Form.Text className="text-danger">{formik.errors.horaFin}</Form.Text>) : null}
                                </Form.Group>

                            </Col>

                        </Row>

                        <Row>

                            <Col>

                                <Form.Group controlId="descanso">
                                    <Form.Label>Descanso</Form.Label>
                                    <Form.Check
                                        type="switch"
                                        name="descanso"
                                        checked={formik.values.descanso}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                    {formik.touched.descanso && formik.errors.descanso ? (<Form.Text className="text-danger">{formik.errors.descanso}</Form.Text>) : null}
                                </Form.Group>

                            </Col>

                            <Col>
                            </Col>

                        </Row>

                    </Container>

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cerrar
                    </Button>
                    <Button type="submit" variant="custom">
                        Guardar
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal >
    );
}