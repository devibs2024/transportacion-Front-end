import { useFormik } from 'formik';
import * as Yup from 'yup';
import React, { useEffect, useState } from 'react';
import { Form, Select, Button } from 'react-bootstrap';
import { useGetEstados } from '../../../hooks/useGetEstados';
import { useGetMunicipios } from '../../../hooks/useGetMunicipios';
import API from '../../../store/api';
import { accionExitosa, accionFallida, confirmarAccion } from '../../../shared/Utils/modals';
import { useNavigate } from 'react-router';
import { useLocation } from 'react-router-dom';
import { rutaServidor } from '../../../routes/rutaServidor';
import { procesarErrores } from '../../../shared/Utils/procesarErrores';

export const FormularioDirector = ({ setDirector, director, id }) => {

    const [idEmpleado, setIdEmpleado] = useState(0);
    const location = useLocation();

    const [formState, setFormState] = useState(true);
    const [selectedValue, setSelectedValue] = useState('');
    const [idEstado, setIdEstado] = useState(0)
    const navigate = useNavigate();

    useEffect(() => {

        if (location.state?.director) {

            console.log(location.state?.director);


            setIdEstado(location.state.director.municipio.estado.idEstado);

            formik.setValues({
                idEmpleado: location.state.director.idEmpleado,
                nombres: location.state.director.nombres,
                direccion: location.state.director.direccion,
                idMunicipio: location.state.director.idMunicipio,
                idEstado: location.state.director.municipio.estado.idEstado,
                telefono: location.state.director.telefono,
                correo: location.state.director.correo,
                idSegmento: 1
            })

            setIdEmpleado(location.state.director.idEmpleado);

            setDirector({
                idEmpleado: location.state.director.idEmpleado,
                nombres: location.state.director.nombres,
                direccion: location.state.director.direccion,
                idMunicipio: location.state.director.idMunicipio,
                idEstado: location.state.director.municipio.estado.idEstado,
                telefono: location.state.director.telefono,
                correo: location.state.director.correo,
                idSegmento: 1
            })

        } else if (director.idEmpleado != 0) {

            console.log(director)

            formik.setValues(director)
        }


    }, []);


    const updateDirector = (updatedDirector) => {
        setDirector((prevDirector) => ({
            ...prevDirector,
            ...updatedDirector
        }));
    };

    const limpiarFormulario = () => {
        formik.resetForm();

        setIdEmpleado(0);

        setDirector({
            idEmpleado: 0,
            nombres: '',
            direccion: '',
            idMunicipio: '',
            idEstado: '',
            telefono: '',
            correo: '',
            empleadoInterno: false,
            idSegmento: 1
        });

    }

    const [estados, setEstados] = useState([]);
    const [municipios, setMunicipios] = useState([]);

    const fetchedEstados = useGetEstados();
    const fetchedMunicipios = useGetMunicipios();

    useEffect(() => {
        if (estados.length === 0 && fetchedEstados.length > 0) {
            setEstados(fetchedEstados);

           
        }
    }, [estados, fetchedEstados]);

    useEffect(() => {
        if (municipios.length === 0 && fetchedMunicipios.length > 0) {
            setMunicipios(fetchedMunicipios);
        }
    }, [municipios, fetchedMunicipios]);

    const estadosOptions = estados.map(estado => ({
        value: estado.idEstado,
        label: estado.nombreEstado
    }));

    const municipiosOptions = municipios.map(municipio => ({
        value: municipio.idMunicipio,
        label: municipio.nombreMunicipio
    }));

    const onChangeEstado = (event) => {

        formik.handleChange(event);

        const idEstado = document.getElementById('idEstado').value;

     
        setIdEstado(idEstado);

    }

    const getInitialValues = () => {

        //  if (location.state?.operador) return location.state?.operador
        //  if (operador.idEmpleado != 0) return operador
        return {
            nombres: '',
            direccion: '',
            idEstado: '',
            idMunicipio: '',
            telefono: '',
            correo: '',
        }
    }

    const formik = useFormik({

        initialValues: getInitialValues(),
        validationSchema: Yup.object({
            nombres: Yup.string().required('Este campo es obligatorio'),
            direccion: Yup.string().required('Este campo es obligatorio'),
            telefono: Yup.string().required('Este campo es obligatorio').length(10, "La longitud debe de ser de 10 caracteres"),
            correo: Yup.string().email('Dirección de correo electrónico no válida').required('Este campo es obligatorio'),
        }),
        onSubmit: values => {

            let nuevoDirector = {
                idEmpleado: idEmpleado,
                nombres: values.nombres,
                direccion: values.direccion,
                idMunicipio: values.idMunicipio,
                telefono: values.telefono,
                correo: values.correo,
                idSegmento: 1
            };

            postOrPutDirector(nuevoDirector);

        }
    });


    const postOrPutDirector = async (director) => {

        try {
            let response;

            if (idEmpleado == 0) {

                response = await API.post("Director", director);

                if (response.status == 200 || response.status == 204) {


                    setIdEmpleado(response.data);

                    updateDirector({
                        idEmpleado: response.data,
                        nombres: director.nombres,
                        direccion: director.direccion,
                        idMunicipio: director.idMunicipio,
                        telefono: director.telefono,
                        correo: director.correo,
                        idSegmento: 1
                    });

                    accionExitosa({ titulo: 'Director Agregado', mensaje: ' ¡El Director ha sido creado satisfactoriamente!' });

                } else {
                    accionFallida({ titulo: 'El Director no puedo se Agregado', mensaje: '¡Ha ocurrido un error al intentar agregar el Director!' });
                    updateDirector({ idEmpleado: response.data })
                }

            } else {

                try {
                    response = await API.put(`Director/${idEmpleado}`, director);

                    if (response.status == 200 || response.status == 204) {


                        accionExitosa({ titulo: 'Director Actualizado', mensaje: '¡El Director ha sido actualizado satisfactoriamente!' });
                        updateDirector({
                            idEmpleado: idEmpleado,
                            nombres: director.nombres,
                            direccion: director.direccion,
                            idMunicipio: director.idMunicipio,
                            telefono: director.telefono,
                            correo: director.correo,
                            idEstado: director.idEstado,
                            idSegmento: 1
                        });
                    } else {
                        accionFallida('El Director no puedo ser Actualizado', '¡Ha ocurrido un error al intentar actualizar el Director!')
                        updateDirector({ idEmpleado: response.data })
                    }
                } catch (e) {

                    let errores = e.response.data;

                    accionFallida({ titulo: 'El Director no puedo ser Actualizado', mensaje: procesarErrores(errores) })
                }

            }
        } catch (e) {

            let errores = e.response.data;

            accionFallida({ titulo: 'El Director no puedo se Agregado', mensaje: procesarErrores(errores) })

        }
    }

    return (
        <Form onSubmit={formik.handleSubmit}>
            <div className='mt-3'>
                <div className='row'>
                    <CampoFormulario
                        controlId="nombres"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.nombres}
                        label="Nombre Completo:"
                        placeholder="Introduzca el Nombre Completo"
                        name="Nombre Completo"
                        error={formik.touched.nombres && formik.errors.nombres ? (<div className="text-danger">{formik.errors.nombres}</div>) : null} />

                    <CampoFormulario controlId="direccion"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.direccion}
                        label="Dirección:" placeholder="Introduzca la Dirección"
                        name="direccion"
                        error={formik.touched.nombre && formik.errors.direccion ? (<div className="text-danger">{formik.errors.direccion}</div>) : null} />

                    <div className='col col-sm-6 mt-1'>
                        <Form.Group controlId="idEstado">
                            <Form.Label>Estado:</Form.Label>
                            <Form.Control as="select"
                                value={formik.values.idEstado}
                                onChange={onChangeEstado}
                                onBlur={formik.handleBlur}>
                                <option value="">Seleccione un Estado</option>
                                {estadosOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                    </div>

                    <div className='col col-sm-6 mt-1'>
                        <Form.Group controlId="idMunicipio">
                            <Form.Label>Municipio:</Form.Label>
                            <Form.Control as="select"
                                value={formik.values.idMunicipio}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}>
                                <option value="">Seleccione un municipio</option>
                                {municipiosOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                    </div>

                    <CampoFormulario
                        controlId="telefono"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.telefono}
                        label="Teléfono:"
                        placeholder="Introduzca el Teléfono"
                        name="telefono"
                        error={formik.touched.telefono && formik.errors.telefono ? (<div className="text-danger">{formik.errors.telefono}</div>) : null} />

                    <CampoFormulario
                        controlId="correo"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.correo}
                        label="E-mail:"
                        placeholder="Introduzca el E-mail"
                        name="correo"
                        error={formik.touched.correo && formik.errors.correo ? (<div className="text-danger">{formik.errors.correo}</div>) : null} />

                </div>
                <div className='mt-5 d-flex justify-content-end'>
                    <Button variant="custom" type="submit" className='me-2' onClick={values => setFormState(values)}> Guardar <i className="fa-solid fa-plus"></i></Button>
                    <Button variant="outline-secondary" type="button" className='me-2' onClick={() => { limpiarFormulario() }}>Nuevo <i className="fas fa-plus"></i></Button>
                    <Button variant="outline-secondary" type="button" className='me-2' onClick={() => navigate(rutaServidor + "/director/CatalogoDirectores")}>Regresar <i className="fas fa-arrow-left"></i></Button>
                </div>
            </div>
        </Form>

    );
}
const CampoFormulario = (prop) => {

    return (
        <div className='col col-sm-6 mt-1'>
            <Form.Group controlId={prop.controlId}>
                <Form.Label>{prop.label}</Form.Label>
                <Form.Control
                    type="text"
                    placeholder={prop.placeholder}
                    onChange={prop.onChange}
                    onBlur={prop.onBlur}
                    value={prop.value}
                />
                <Form.Text className="text-danger">
                    {prop.error}
                </Form.Text>
            </Form.Group>
        </div>
    );
}