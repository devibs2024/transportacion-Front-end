import API from "../../../store/api";

import * as decodeToken from '../../../shared/Utils/decodeToken';

import { useEffect, useState } from "react";

import { useNavigate } from "react-router";
import { useLocation } from "react-router-dom";

import { useFormik } from 'formik';
import { Form, Modal, Button } from "react-bootstrap";

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Calendar } from 'primereact/calendar';

import { accionExitosa, accionFallida } from '../../../shared/Utils/modals';

import { useGetEmpleadoCoordinadores } from "../../../hooks/useGetEmpleadoCoordinador";
import { useGetTiendaCoordinadores } from "../../../hooks/useGetTiendaCoordinador";

export const ModalCrearEjecucionPlanificacion = ({ show, setShow, productividad, detalle, setDetalle }) => {

    //####################################################################################################################################################
    //### VARIABLES GLOBALES

    const navigate = useNavigate();
    const location = useLocation();

    const idCoordinador = decodeToken.tokenDecode();

    const handleClose = () => setShow(false);

    //####################################################################################################################################################
    //### EVENTOS

    useEffect(() => {


    }, [])

    const formik = useFormik({
        initialValues: {
            idPlanificacion: detalle.idPlanificacion,
            idDetallePlanificacion: detalle.idDetallePlanificacion,
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
        },

        onSubmit: values => {

            console.log(values);

            //const detallesPlanificacion = {
            //    //idDetallePlanificacion: detallePlanificacion?.idDetallePlanificacion,
            //    idTienda: values.idTienda,
            //    idOperador: values.idOperador,
            //    //idPlanificacion: detallePlanificacion.idPlanificacion,
            //    fecha: formatDateToYYYYMMDD(values.fecha),
            //    horaE: formatDateToHours(values.horaE),
            //    minutoE: formatDateToMinutes(values.horaE),
            //    horaF: formatDateToHours(values.horaF),
            //    minutoF: formatDateToMinutes(values.horaF),
            //    fechaHasta: showFechaFin ? formatDateToYYYYMMDD(values.fechaHasta) : formatDateToYYYYMMDD(values.fecha),
            //    descanso: values.descanso
            //}
            //postOrPutDetallePlanificacion(detallesPlanificacion, getDetallesPlanificacion, detallePlanificacion, setDetallesPlanificacion);
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

    const obtenerFechaHoraFormateada = (fecha) => {

        const year = fecha.getFullYear();
        const month = (fecha.getMonth() + 1).toString().padStart(2, '0');
        const day = fecha.getDate().toString().padStart(2, '0');
        const Hour = fecha.getHours().toString().padStart(2, '0');
        const Min = fecha.getMinutes().toString().padStart(2, '0');

        console.log(`${year}-${month}-${day}T${Hour}:${Min}`)

        return `${year}-${month}-${day}T${Hour}:${Min}`;
    }

    //####################################################################################################################################################
    //### COMBOS

    const operadoresOptions = useGetEmpleadoCoordinadores(idCoordinador).map((list) => ({ value: list.idOperador, label: list.nombres }));
    const tiendasOptions = useGetTiendaCoordinadores(idCoordinador).map((list) => ({ value: list.idTienda, label: list.nombreTienda }));

    return (
        <Modal show={show} onHide={handleClose}>

            <Form onSubmit={formik.handleSubmit}>

                <Modal.Header closeButton>
                    <Modal.Title>Agregar Registro Individual de Planificación</Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    <div className="row">

                        <div className='col col-sm-6'>
                            <Form.Group controlId="idOperador">
                                <Form.Label>Operador:</Form.Label>
                                <Form.Control as="select"
                                    value={detalle.idOperador}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    disabled="true">
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
                        </div>

                        <div className='col col-sm-6'>
                            <Form.Group controlId="idTienda">
                                <Form.Label>Tienda:</Form.Label>
                                <Form.Control as="select"
                                    value={detalle.idTienda}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    disabled="true">
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
                        </div>

                    </div>

                    <div className="row">

                        <div className='col col-sm-6'>
                            <Form.Group controlId="fecha">
                                <Form.Label> Fecha </Form.Label>
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
                                {formik.touched.fecha && formik.errors.fecha ? (
                                    <Form.Text className="text-danger">{formik.errors.fecha}</Form.Text>
                                ) : null}
                            </Form.Group>
                        </div>

                        <div className='col col-sm-6'>

                        </div>

                        <div className='col col-sm-6'>
                            <Form.Group controlId="horaInicio">
                                <Form.Label>Hora Entrada:</Form.Label>
                                <Calendar
                                    id="horaInicio"
                                    timeOnly
                                    locale="es"
                                    hourFormat="24"
                                    dateFormat="HH:mm:ss"
                                    onChange={(date) => formik.setFieldValue('horaInicio', date)}
                                    value={formik.values.horaFin ? formik.values.horaInicio : null}
                                />
                                {formik.touched.horaInicio && formik.errors.horaInicio ? (<Form.Text className="text-danger">{formik.errors.horaInicio}</Form.Text>) : null}
                            </Form.Group>
                        </div>

                        <div className='col col-sm-6'>
                            <Form.Group controlId="horaFin">
                                <Form.Label>Hora Salida:</Form.Label>
                                <Calendar
                                    id="horaFin"
                                    timeOnly
                                    locale="es"
                                    hourFormat="24"
                                    dateFormat="HH:mm:ss"
                                    onChange={(date) => formik.setFieldValue('horaFin', date)}
                                    value={formik.values.horaFin ? formik.values.horaFin : null}
                                />
                                {formik.touched.horaFin && formik.errors.horaFin ? (<Form.Text className="text-danger">{formik.errors.horaFin}</Form.Text>) : null}
                            </Form.Group>
                        </div>
                        <div className="col col-sm-6">
                            <Form.Group controlId="descanso">
                                <Form.Label>Descanso</Form.Label>
                                <Form.Check
                                    type="switch"
                                    name="descanso"
                                    checked={detalle.descanso}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                                <Form.Text className="text-danger">
                                    {formik.touched.descanso && formik.errors.descanso ? (
                                        <div className="text-danger">{formik.errors.descanso}</div>
                                    ) : null}
                                </Form.Text>
                            </Form.Group>
                        </div>

                    </div>

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