import { useFormik } from 'formik';
import * as Yup from 'yup';
import React, { useEffect, useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useGetEstados } from '../../../../hooks/useGetEstados';
import { useGetMunicipios } from '../../../../hooks/useGetMunicipios';
import { useNavigate } from 'react-router';
import { useLocation } from 'react-router-dom';
import { rutaServidor } from '../../../../routes/rutaServidor';
import CampoFormulario from '../../../../shared/Components/CampoFormulario/CampoFormulario';
import { postOrPutOperador } from './operadorUtils';
import { accionFallida } from '../../../../shared/Utils/modals';

export const FormularioOperador = ({ setOperador, operador }) => {

    const [idEmpleado, setIdEmpleado] = useState(0);

    const [formState, setFormState] = useState(true);
    const [selectedValue, setSelectedValue] = useState('');
    const [idEstado, setIdEstado] = useState(0)
    const location = useLocation();

    const navigate = useNavigate();

    const updateOperador = (updatedOperador) => {
        setOperador((prevOperador) => ({
            ...prevOperador,
            ...updatedOperador
        }));
    };

    useEffect(() => {

        if (location.state?.operador) {


            console.log(location.state.operador)

            setIdEstado(location.state.operador.municipio.estado.idEstado)
            formik.setValues({
                idEmpleado: location.state.operador.idEmpleado,
                idEstado: location.state.operador.municipio.estado.idEstado,
                numeroContrato: location.state.operador.numeroContrato,
                nombres: location.state.operador.nombres,
                apellidoMaterno: location.state.operador.apellidoMaterno,
                apellidoPaterno: location.state.operador.apellidoPaterno,
                direccion: location.state.operador.direccion,
                idMunicipio: location.state.operador.idMunicipio,
                telefono: location.state.operador.telefono,
                correo: location.state.operador.correo,
                salario: location.state.operador.salario,
                idSegmento: location.state.operador.idSegmento,
                smg: location.state.operador.smg
            })

          

            setIdEmpleado(location.state.operador.idEmpleado);
            setOperador({
                idEmpleado: location.state.operador.idEmpleado,
                idEstado: location.state.operador.municipio.estado.idEstado,
                numeroContrato: location.state.operador.numeroContrato,
                nombres: location.state.operador.nombres,
                apellidoMaterno: location.state.operador.apellidoMaterno,
                apellidoPaterno: location.state.operador.apellidoPaterno,
                direccion: location.state.operador.direccion,
                idMunicipio: location.state.operador.idMunicipio,
                telefono: location.state.operador.telefono,
                correo: location.state.operador.correo,
                salario: location.state.operador.salario,
                empleadoInterno: location.state.operador.idSegmento,
                smg: location.state.operador.smg
            });

        } else if (operador.idEmpleado != 0) {
            formik.setValues(operador)
        }

    }, [])

    const limpiarFormulario = () => {

        formik.resetForm();

        setIdEmpleado(0);

        setOperador({
            idEmpleado: 0,
            idEstado: '',
            numeroContrato: '',
            nombres: '',
            apellidoMaterno: '',
            apellidoPaterno: '',
            direccion: '',
            idMunicipio: '',
            telefono: '',
            correo: '',
            salario: '',
            idSegmento: 1,
            smg: 0
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
    const municipiosOptions = municipios.filter(x => x.estado.idEstado == idEstado).map(municipio => ({
        value: municipio.idMunicipio,
        label: municipio.nombreMunicipio
    }));

    const onChangeEstado = (event) => {

        formik.handleChange(event);

        const idEstado = document.getElementById('idEstado').value;

        setIdEstado(idEstado);

    }
    const getInitialValues = () => {

        return {
            numeroContrato: '',
            nombres: '',
            apellidoMaterno: '',
            apellidoPaterno: '',
            direccion: '',
            idEstado: '',
            idMunicipio: '',
            telefono: '',
            correo: '',
            salario: '',
            idSegmento: 1,
            smg: 0
        }
    }

    const formik = useFormik({

        initialValues: getInitialValues(),
        validationSchema: Yup.object({
            numeroContrato: Yup.string().required('Este campo es obligatorio'),
            nombres: Yup.string().required('Este campo es obligatorio'),
            direccion: Yup.string().required('Este campo es obligatorio'),
            idEstado: Yup.string().required('Este campo es obligatorio'),
            idMunicipio: Yup.string().required('Este campo es obligatorio'),
            telefono: Yup.string().required('Este campo es obligatorio').length(10, "La longitud debe de ser de 10 caracteres"),
            correo: Yup.string().email('Dirección de correo electrónico no válida').required('Este campo es obligatorio'),
            salario: Yup.number().typeError('El salario debe ser un número.')
            .required('El campo salario es obligatorio'),
            smg: Yup.number().typeError('El salario debe ser un número.')
            .required('El campo salario es obligatorio')
        })
        ,
        onSubmit: values => {

            if (!values.apellidoMaterno && !values.apellidoPaterno) {

                accionFallida({ titulo: 'Error', mensaje: 'Se debe especificar al menos el Apellido Materno o el Paterno' })
                return;
            }


            let nuevoOperador = {
                idEmpleado: idEmpleado,
                numeroContrato: values.numeroContrato,
                nombres: values.nombres,
                apellidoMaterno: values.apellidoMaterno,
                apellidoPaterno: values.apellidoPaterno,
                direccion: values.direccion,
                idMunicipio: values.idMunicipio,
                telefono: values.telefono,
                correo: values.correo,
                salario: values.salario,
                idEstado: values.idEstado,
                idSegmento: values.idSegmento,
                smg: values.smg
            };

            postOrPutOperador(nuevoOperador, setIdEmpleado, idEmpleado, updateOperador);
        }
    });


    return (<Form onSubmit={formik.handleSubmit}>
        <div className='mt-3'>
            <div className='row'>
                <CampoFormulario
                    controlId="numeroContrato"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.numeroContrato}
                    label="Nro. Contrato"
                    placeholder="Introduzca el Nro. Contracto"
                    name="numeroContrato"
                    error={formik.touched.numeroContrato && formik.errors.numeroContrato ? (<div className="text-danger">{formik.errors.numeroContrato}</div>) : null} />

                <CampoFormulario
                    controlId="nombres"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.nombres}
                    label="Nombre"
                    placeholder="Introduzca el Nombre"
                    name="nombres"
                    error={formik.touched.nombres && formik.errors.nombres ? (<div className="text-danger">{formik.errors.nombres}</div>) : null} />

                <CampoFormulario
                    controlId="apellidoPaterno"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.apellidoPaterno}
                    label="Apellido Paterno" placeholder="Introduzca el Apellido Paterno"
                    name="apellidoPaterno" error={formik.touched.apellidoPaterno && formik.errors.apellidoPaterno ? (<div className="text-danger">{formik.errors.apellidoPaterno}</div>) : null} />

                <CampoFormulario
                    controlId="apellidoMaterno"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.apellidoMaterno}
                    label="Apellido Materno"
                    placeholder="Introduzca el Apellido Materno"
                    name="apellidoMaterno"
                    error={formik.touched.apellidoMaterno && formik.errors.apellidoMaterno ? (<div className="text-danger">{formik.errors.apellidoMaterno}</div>) : null} />
                <CampoFormulario controlId="direccion"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.direccion}
                    label="Dirección" placeholder="Introduzca la Dirección"
                    name="direccion"
                    error={formik.touched.nombre && formik.errors.direccion ? (<div className="text-danger">{formik.errors.direccion}</div>) : null} />

                <div className='col col-sm-6 mt-1'>
                    <Form.Group controlId="idEstado">
                        <Form.Label>Estado:</Form.Label>
                        <Form.Control as="select"
                            value={formik.values.idEstado}
                            onChange={onChangeEstado}
                            onBlur={formik.handleBlur}>
                            <option value="">Seleccione un estado</option>
                            {estadosOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                    <Form.Text className="text-danger">
                        {formik.touched.idEstado && formik.errors.idEstado ? (<div className="text-danger">{formik.errors.idEstado}</div>) : null}
                    </Form.Text>
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
                    <Form.Text className="text-danger">
                        {formik.touched.idMunicipio && formik.errors.idMunicipio ? (<div className="text-danger">{formik.errors.idMunicipio}</div>) : null}
                    </Form.Text>
                </div>
                <CampoFormulario
                    controlId="telefono"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.telefono}
                    label="Teléfono"
                    placeholder="Introduzca el Teléfono"
                    name="telefono"
                    error={formik.touched.telefono && formik.errors.telefono ? (<div className="text-danger">{formik.errors.telefono}</div>) : null} />
                <CampoFormulario
                    controlId="correo"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.correo}
                    label="E-mail"
                    placeholder="Introduzca el E-mail"
                    name="correo"
                    error={formik.touched.correo && formik.errors.correo ? (<div className="text-danger">{formik.errors.correo}</div>) : null} />
                <CampoFormulario controlId="salario"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.salario}
                    label="Salario" placeholder="Introduzca el Salario"
                    name="salario"
                    error={formik.touched.salario && formik.errors.salario ? (<div className="text-danger">{formik.errors.salario}</div>) : null} />
                <div className="col col-sm-6 mt-1">
                    <Form.Group controlId="idSegmento">
                        <Form.Label>Tipo Empleado:</Form.Label>
                        <Form.Control as="select"
                            value={formik.values.idSegmento}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}>
                            <option value="">Seleccione un tipo de empleado</option>
                            <option value="1">Interno</option>
                            <option value="2">Externo</option>
                            <option value="3">Spot</option>
                        </Form.Control>
                    </Form.Group>
                </div>
                <CampoFormulario controlId="smg"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.smg}
                    label="smg" placeholder="Introduzca el descuento"
                    name="smg"
                    error={formik.touched.smg && formik.errors.smg ? (<div className="text-danger">{formik.errors.smg}</div>) : null} />
            </div>
            <div className='mt-5 d-flex justify-content-end'>
                <Button variant="custom" type="submit" className='me-2' onClick={values => setFormState(values)}>Guardar <i className="fa-solid fa-plus"></i></Button>
                <Button variant="outline-secondary" type="button" className='me-2' onClick={() => { limpiarFormulario() }}>Nuevo <i className="fas fa-plus"></i></Button>
                <Button variant="outline-secondary" type="button" className='me-2' onClick={() => navigate(rutaServidor + "/operador/operadores")}>Regresar <i className="fas fa-arrow-left"></i></Button>
            </div>
        </div>
    </Form>);
}





