import API from "../../../store/api";

import { useEffect, useState } from "react";

import { useFormik } from 'formik';
import { Form, Modal, Button } from "react-bootstrap";

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import { getOperadores, getTiendas, postOrPutDetallePlanificacion } from "./ejecucionPlanificacionUtils";
import { useGetEmpleadoCoordinadores } from "../../../hooks/useGetEmpleadoCoordinador";
import { useGetTiendaCoordinadores } from "../../../hooks/useGetTiendaCoordinador";

export const ModalCrearEjecucionPlanificacion = ({ show, setShow, ejecucion, getEjecuion}) => {

    //####################################################################################################################################################
    //### VARIABLES GLOBALES

    const [showFechaFin, setShowFechaFin] = useState(false);

    const handleSwitchChange = (e) => {

        setShowFechaFin(e.target.checked);
    };

    const [idCoordinador, setIdCoordinador] = useState(0);

    const handleClose = () => setShow(false);

    const CustomInput = ({ value, onClick }) => (
        <Form.Control
            className="form-control"
            type="text"
            onClick={onClick}
            value={value}
            readOnly
        />
    );


    const handleShow = () => setShow(true);

    const parseDateString = (dateString) => {
        const date = new Date(dateString);
        return date;
    }
    const formatDateToHours = (date) => {
        const hours = date.getHours();
        return hours.toString().padStart(2, '0');
    };

    const formatDateToMinutes = (date) => {
        const minutes = date.getMinutes();
        return minutes.toString().padStart(2, '0');
    };

    const formatDateToYYYYMMDD = (date) => {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');

        return `${year}-${month}-${day}`;
    };

    //####################################################################################################################################################
    //### EVENTOS

    useEffect(() => {

    }, [])

    //useEffect(() => {


    //    if (Object.keys(detallePlanificacion).length !== 0) {
    //        formik.setValues({
    //            idOperador: detallePlanificacion.idOperador,
    //            idTienda: detallePlanificacion.idTienda,
    //            fecha: parseDateString(detallePlanificacion.fecha),
    //            horaE: timeStringToDate(detallePlanificacion.horaInicio.substring(0, 5)),
    //            horaF: timeStringToDate(detallePlanificacion.horaFin.substring(0, 5)),
    //            descanso: detallePlanificacion.descanso
    //        })
    //    } else {
    //        formik.setValues({
    //            idOperador: 0,
    //            idTienda: 0,
    //            fecha: '',
    //            horaE: '',
    //            horaF: '',
    //            descanso: false
    //        });
    //    }
    //}, [detallePlanificacion])


    function timeStringToDate(timeString) {
        const [hours, minutes] = timeString.split(':').map(Number);

        const date = new Date();
        date.setHours(hours, minutes, 0, 0);

        return date;
    }

    const formik = useFormik({
        initialValues: {
            idOperador: 0,
            idTienda: 0,
            fecha: '',
            fechaHasta: '',
            horaE: '',
            horaF: '',
            descanso: true
        },

        onSubmit: values => {

            console.log(values);

            const detallesPlanificacion = {
                //idDetallePlanificacion: detallePlanificacion?.idDetallePlanificacion,
                idTienda: values.idTienda,
                idOperador: values.idOperador,
                //idPlanificacion: detallePlanificacion.idPlanificacion,
                fecha: formatDateToYYYYMMDD(values.fecha),
                horaE: formatDateToHours(values.horaE),
                minutoE: formatDateToMinutes(values.horaE),
                horaF: formatDateToHours(values.horaF),
                minutoF: formatDateToMinutes(values.horaF),
                fechaHasta: showFechaFin ? formatDateToYYYYMMDD(values.fechaHasta) : formatDateToYYYYMMDD(values.fecha),
                descanso: values.descanso
            }
            //postOrPutDetallePlanificacion(detallesPlanificacion, getDetallesPlanificacion, detallePlanificacion, setDetallesPlanificacion);
        }
    });


    //####################################################################################################################################################
    //### COMBOS

    const operadoresOptions = useGetEmpleadoCoordinadores(idCoordinador).map((list) => ({ value: list.idOperador, label: list.nombres }));
    const tiendasOptions = useGetTiendaCoordinadores(idCoordinador).map((list) => ({ value: list.idTienda, label: list.nombreTienda }));

    return (
        <Modal show={show} onHide={handleClose}>
            <Form onSubmit={formik.handleSubmit}>
                <Modal.Header closeButton>
                    <Modal.Title>Agregar Detalle Planificación</Modal.Title>
                </Modal.Header>
                <Modal.Body>
              
                    <div className="row">
                        <div className='col col-sm-6'>
                            <Form.Group controlId="habilitarFechaFin">
                                <Form.Check
                                    type="switch"
                                    name="habilitarFechaFin"
                                    label="Agregar Rango"
                                    onChange={handleSwitchChange}
                                />
                            </Form.Group>
                        </div>
                    </div> 
                    <div className="row">
                           <div className='col col-sm-6'>
                            <Form.Group controlId="idOperador">
                                <Form.Label>Operador:</Form.Label>
                                <Form.Control as="select"
                                    value={formik.values.idOperador}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}>
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
                                    value={formik.values.idTienda}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}>
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
                     {/*   </div>
                    <div className="row">

                        <div className='col col-sm-6'>
                            <Form.Group controlId="fecha">
                                <Form.Label> Fecha </Form.Label>
                                <DatePicker
                                    id="fecha"
                                    name="fecha"
                                    selected={formik.values.fecha ? new Date(formik.values.fecha) : null}
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
                            <Form.Group controlId="fechaHasta"

                            >
                                <Form.Label>Fecha Hasta:</Form.Label>
                                <DatePicker
                                    style={!showFechaFin ? { backgroundColor: "#D3D3D3" } : {}}
                                    id="fechaHasta"
                                    name="fechaHasta"

                                    disabled={!showFechaFin}
                                    selected={formik.values.fechaHasta ? new Date(formik.values.fechaHasta) : null}
                                    onChange={(date) => formik.setFieldValue('fechaHasta', date)}
                                    onBlur={formik.handleBlur}
                                    showMonthDropdown
                                    showYearDropdown
                                    customInput={<CustomInput />}
                                />
                                {formik.touched.fechaHasta && formik.errors.fechaHasta ? (
                                    <Form.Text className="text-danger">{formik.errors.fechaHasta}</Form.Text>
                                ) : null}
                            </Form.Group>
                        </div>

                        <div className='col col-sm-6'>
                            <Form.Group controlId="horaE">
                                <Form.Label>Hora Entrada:</Form.Label>
                                <DatePicker
                                    id="horaE"
                                    name="horaE"
                                    selected={formik.values.horaE ? new Date(formik.values.horaE) : null}
                                    onChange={(date) => formik.setFieldValue('horaE', date)}
                                    onBlur={formik.handleBlur}
                                    showTimeSelect
                                    showTimeSelectOnly
                                    timeFormat="HH:mm"
                                    dateFormat="HH:mm"
                                    customInput={<CustomInput />}
                                />
                                {formik.touched.horaE && formik.errors.horaE ? (
                                    <Form.Text className="text-danger">{formik.errors.horaE}</Form.Text>
                                ) : null}
                            </Form.Group>
                        </div>


                        <div className='col col-sm-6'>
                            <Form.Group controlId="horaF">
                                <Form.Label>Hora Salida:</Form.Label>
                                <DatePicker
                                    id="horaF"
                                    name="horaF"
                                    selected={formik.values.horaF ? new Date(formik.values.horaF) : null}
                                    onChange={(date) => formik.setFieldValue('horaF', date)}
                                    onBlur={formik.handleBlur}
                                    showTimeSelect
                                    showTimeSelectOnly
                                    timeFormat="HH:mm"
                                    dateFormat="HH:mm"
                                    customInput={<CustomInput />}
                                />
                                {formik.touched.horaF && formik.errors.horaF ? (
                                    <Form.Text className="text-danger">{formik.errors.horaF}</Form.Text>
                                ) : null}
                            </Form.Group>
                        </div>
                        <div className="col col-sm-6">
                            <Form.Group controlId="descanso">
                                <Form.Label>Descanso</Form.Label>
                                <Form.Check
                                    type="switch"
                                    name="descanso"

                                    checked={formik.values.descanso}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                                <Form.Text className="text-danger">
                                    {formik.touched.descanso && formik.errors.descanso ? (
                                        <div className="text-danger">{formik.errors.descanso}</div>
                                    ) : null}
                                </Form.Text>
                            </Form.Group>
                        </div>     */}
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