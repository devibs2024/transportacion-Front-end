import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import { useLocation } from 'react-router-dom';
import { rutaServidor } from '../../../../routes/rutaServidor';
import CampoFormulario from '../../../../shared/Components/CampoFormulario/CampoFormulario';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useGetCoordinador } from '../../../../hooks/useGetCoordinador';
import API from '../../../../store/api';
import { accionExitosa, accionFallida } from '../../../../shared/Utils/modals';
import { procesarErrores } from '../../../../shared/Utils/procesarErrores'
import * as Yup from 'yup';


export const FormularioNuevaPlanificacion = ({ setPlanificacion, planificacion }) => {

    const [idPlanificacion, setIdPlanificacion] = useState(0);

    const [formState, setFormState] = useState(true);
    const [selectedValue, setSelectedValue] = useState('');
    const location = useLocation();

    const navigate = useNavigate();

    const coordinadores = useGetCoordinador();

    const coordinadoresOptions = coordinadores.map(s => ({
        value: s.idEmpleado,
        label: s.nombres
    }));

    const validationSchema = Yup.object().shape({
        comentario: Yup.string().required('El comentario es requerido'),
        fechaDesde: Yup.date()
            .min(new Date(), "La fecha de inicio debe ser mayor a la fecha actual")
            .required('La fecha de inicio es requerida'),
        FrecuenciaId: Yup.number().required('La frecuencia es requerida'),
        fechaHasta: Yup.date()
            .required('La fecha final es requerida')
    });
    

    const updatePlanificacion = (updatedPlanificacion) => {
        setPlanificacion((prevPlanificacion) => ({
            ...prevPlanificacion,
            ...updatedPlanificacion
        }));
    };

    useEffect(() => {

        if (location.state?.planificacion) {

            console.log('plani', location.state.planificacion)
            formik.setValues({
                fechaDesde: location.state.planificacion.fechaDesde,
                fechaHasta: location.state.planificacion.fechaHasta,
                comentario: location.state.planificacion.comentario,
                idCoordinador: location.state.planificacion.idCoordinador
            })

            setIdPlanificacion(location.state.planificacion.idPlanificacion);

            setPlanificacion({
                idPlanificacion: location.state.planificacion.idPlanificacion,
                fechaDesde: location.state.planificacion.fechaDesde,
                fechaHasta: location.state.planificacion.fechaHasta,
                comentario: location.state.planificacion.comentario,
                idCoordinador: location.state.planificacion.idCoordinador
            })
        } else if (planificacion.idPlanificacion != 0) {
            formik.setValues(planificacion)
        }

    }, [])

    const limpiarFormulario = () => {

        formik.resetForm();

        setIdPlanificacion(0);

        setPlanificacion({
            idPlanificacion: 0,
            fechaDesde: '',
            fechaHasta: '',
            comentario: '',
            idCoordinador: 0
        });
    }

    const getInitialValues = () => {
        return {
            fechaDesde: '',
            fechaHasta: '',
            comentario: '',
            idCoordinador: 0,
            FrecuenciaId: ''
        }
    }

    const formik = useFormik({
        initialValues: getInitialValues(),
        validationSchema: validationSchema,
        onSubmit: values => {

            const nuevaPlanificacion = {
                idPlanificacion: idPlanificacion,
                fechaDesde: values.fechaDesde,
                fechaHasta: values.fechaHasta,
                comentario: values.comentario,
                idCoordinador: values.idCoordinador
            }

            putOrPostPlanificacion(nuevaPlanificacion);
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

    const putOrPostPlanificacion = async (planificacion) => {

        try {

            let response;

            if (idPlanificacion == 0) {

                response = await API.post("Planificaciones", planificacion);

                if (response.status == 200 || response.status == 204) {

                    console.log(response.data)
                    setIdPlanificacion(response.data);

                    updatePlanificacion({
                        idPlanificacion: response.data
                    })

                    accionExitosa({ titulo: 'Planificación Agregada', mensaje: ' ¡La Planificación fue agregada satisfactoriamente!' });
                }

            } else {

                console.log(planificacion)

                response = await API.put(`Planificaciones/${idPlanificacion}`, planificacion);

                if (response.status == 200 || response.status == 204) {

                    accionExitosa({ titulo: 'Planificacion Actualizada', mensaje: '¡La Planificación ha sido actualizada satisfactoriamente!' });

                    updatePlanificacion({
                        idPlanificacion: response.data
                    })
                }
            }

        } catch (e) {

            accionFallida({ titulo: 'Ha Ocurrido un errror', mensaje: procesarErrores(e.response.data) })
        }
    }

    return (<Form onSubmit={formik.handleSubmit}>
        <div className='mt-3'>
            <div className='row'>
                <div className='row'>
                    <div className='col col-sm-6'>
                        <Form.Group controlId="fechaDesde">
                            <Form.Label>Fecha Desde:</Form.Label>
                            <DatePicker
                                id="fechaDesde"
                                name="fechaDesde"
                                selected={formik.values.fechaDesde ? new Date(formik.values.fechaDesde) : null}
                                onChange={(date) => formik.setFieldValue('fechaDesde', date)}
                                onBlur={formik.handleBlur}
                                showMonthDropdown
                                showYearDropdown
                                customInput={<CustomInput />}
                            />
                            {formik.touched.fechaDesde && formik.errors.fechaDesde ? (
                                <Form.Text className="text-danger">{formik.errors.fechaDesde}</Form.Text>
                            ) : null}
                        </Form.Group>
                    </div>
                    <div className='col col-sm-6'>
                        <Form.Group controlId="fechaHasta">
                            <Form.Label>Fecha Fin:</Form.Label>
                            <DatePicker
                                id="fechaHasta"
                                name="fechaHasta"
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
                        <Form.Group controlId="idCoordinador">
                            <Form.Label>Coordinador:</Form.Label>
                            <Form.Control as="select"
                                value={formik.values.idCoordinador}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}>
                                <option value="">Seleccione al coordinador</option>
                                {coordinadoresOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </Form.Control>
                            <Form.Text className="text-danger">
                                {formik.touched.idCoordinador && formik.errors.idCoordinador ? (<div className="text-danger">{formik.errors.idCoordinador}</div>) : null}
                            </Form.Text>
                        </Form.Group>
                    </div>
                    <CampoFormulario
                        controlId="comentario"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.comentario}
                        label="Comentario"
                        placeholder="Introduzca un Comentario"
                        name="comentario"
                        error={formik.touched.comentario && formik.errors.comentario ? (<div className="text-danger">{formik.errors.comentario}</div>) : null} />
                 <div className='col col-sm-6 mt-1'>
                 <Form.Group controlId="FrecuenciaId">
                        <Form.Label>Frecuencia:</Form.Label>
                        <Form.Control as="select"
                            value={formik.values.FrecuenciaId}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}>
                            <option value="">Seleccione la frecuencia</option>
                            <option value="1">Semanal</option>
                            <option value="2">Quincenal</option>
                        </Form.Control>
                        <Form.Text className="text-danger">
                            {formik.touched.FrecuenciaId && formik.errors.FrecuenciaId ? (<div className="text-danger">{formik.errors.FrecuenciaId}</div>) : null}
                        </Form.Text>
                    </Form.Group>
                 </div>
                 
                </div>

                <div className='mt-5 d-flex justify-content-end'>
                    <Button variant="custom" type="submit" className='me-2' onClick={values => setFormState(values)}>Guardar <i className="fa-solid fa-plus"></i></Button>
                    <Button variant="outline-secondary" type="button" className='me-2' onClick={() => { limpiarFormulario() }}>Nuevo <i className="fas fa-plus"></i></Button>
                    <Button variant="outline-secondary" type="button" className='me-2' onClick={() => navigate(rutaServidor + "/planificacion/planificaciones")}>Regresar <i className="fas fa-arrow-left"></i></Button>
                </div>
            </div>
        </div>
    </Form>);
}