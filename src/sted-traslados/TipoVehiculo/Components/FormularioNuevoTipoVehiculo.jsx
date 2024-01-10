import { useFormik } from 'formik';
import * as Yup from 'yup';
import React, { useEffect, useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useGetEstados } from '../../../hooks/useGetEstados';
import { useGetMunicipios } from '../../../hooks/useGetMunicipios';
import { useGetMarcaVehiculo } from '../../../hooks/useGetMarcaVehiculo';
import { useGetModeloVehiculo } from '../../../hooks/useGetModeloVehiculo';
import API from '../../../store/api';
import { useNavigate } from 'react-router';
import { accionExitosa, accionFallida } from '../../../shared/Utils/modals';
import { useLocation } from 'react-router-dom';
import { rutaServidor } from '../../../routes/rutaServidor';
import { procesarErrores } from '../../../shared/Utils/procesarErrores';

export const FormularioTipoVehiculo = ({ setTipoVehiculo, tipoVehiculo }) => {

    const [idTipoVehiculo, setIdTipoVehiculo] = useState(0);

    const [formState, setFormState] = useState(true);
    const [selectedValue, setSelectedValue] = useState('');
    const location = useLocation();

    const navigate = useNavigate();

    const updateTipoVehiculo = (updatedTipoVehiculo) => {
        setTipoVehiculo((prevTipoVehiculo) => ({
            ...prevTipoVehiculo,
            ...updatedTipoVehiculo
        }));
    };

    useEffect(() => {

        if (location.state?.tipovehiculo) {

            formik.setValues(location.state.tipovehiculo)

            setIdTipoVehiculo(location.state.tipovehiculo.idTipoVehiculo);
            setTipoVehiculo(location.state.tipovehiculo)
        } else if (tipoVehiculo.idTipoVehiculo != 0) {
            formik.setValues(tipoVehiculo)
        }

    }, [])

    const limpiarFormulario = () => {

        formik.resetForm();

        setIdTipoVehiculo(0);

        setTipoVehiculo({
            idTipoVehiculo: 0,
            tipoVehiculo: '',
            activo: true

        });

    }

    const getInitialValues = () => {

        return {
            idTipoVehiculo: 0,
            tipoVehiculo: '',
            activo: true
        }
    }

    const formik = useFormik({

        initialValues: getInitialValues(),
        validationSchema: Yup.object({
            tipoVehiculo: Yup.string().required('Este campo es obligatorio'),
            activo: Yup.string().required('Este campo es obligatorio')
        })
        ,
        onSubmit: values => {

            let nuevoTipoVehiculo = {
                idTipoVehiculo: idTipoVehiculo,
                tipoVehiculo: values.tipoVehiculo,
                activo: values.activo
            };
            postOrPutTipoVehiculo(nuevoTipoVehiculo);
        }
    });

    const createTipoVehiculo = (idTipoVehiculo, tipoVehiculoData) => {
        return {
            idTipoVehiculo: idTipoVehiculo,
            tipoVehiculo: tipoVehiculoData.tipoVehiculo,
            activo: tipoVehiculoData.activo
        };
    };

    const postTipoVehiculo = async (API, tipovehiculo) => {
        return await API.post("TipoVehiculos", tipovehiculo);
    };

    const putTipoVehiculo = async (API, idTipoVehiculo, tipovehiculo) => {
        return await API.put(`TipoVehiculos/${idTipoVehiculo}`, tipovehiculo);
    };

    const postOrPutTipoVehiculo = async (tipovehiculo) => {


        try {
            const response = (idTipoVehiculo == 0)
                ? await postTipoVehiculo(API, tipovehiculo)
                : await putTipoVehiculo(API, idTipoVehiculo, tipovehiculo);

            if (response.status == 200 || response.status == 204) {

                const actionMessage = (idTipoVehiculo == 0)
                    ? { titulo: 'Tipo Vehiculo Agregado', mensaje: ' ¡El Tipo Vehiculo ha sido creado satisfactoriamente!' }
                    : { titulo: 'Tipo Vehiculo Actualizado', mensaje: '¡El Tipo Vehiculo ha sido actualizado satisfactoriamente!' };

                if (idTipoVehiculo == 0) setIdTipoVehiculo(response.data);

                accionExitosa(actionMessage);
                updateTipoVehiculo(createTipoVehiculo(idTipoVehiculo, tipovehiculo));
            }
        } catch (e) {

            console.log(e)

            accionFallida({ titulo: 'El Tipo Vehiculo no pudo ser Agregado', mensaje: procesarErrores(e.response.data) });
        }
    };


    return (<Form onSubmit={formik.handleSubmit}>
        <div className='mt-3'>
            <div className='row'>
                <CampoFormulario
                    controlId="tipoVehiculo"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.tipoVehiculo}
                    label="Tipo Vehiculo"
                    placeholder="Introduzca el Tipo Vehiculo"
                    name="tipoVehiculo"
                    error={formik.touched.tipoVehiculo && formik.errors.tipoVehiculo ? (<div className="text-danger">{formik.errors.tipoVehiculo}</div>) : null} />

                <div className='col col-sm-6 mt-1'>
                    <Form.Group controlId="activo">
                        <Form.Label>Activo:</Form.Label>
                        <Form.Check
                            type="switch"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            checked={formik.values.activo}
                            name="activo"
                            className="mt-2"
                        />
                        <Form.Text className="text-danger">
                            {formik.touched.activo && formik.errors.activo ? (
                                <div className="text-danger">{formik.errors.activo}</div>
                            ) : null}
                        </Form.Text>
                    </Form.Group>
                </div>

            </div>
            <div className='mt-5 d-flex justify-content-end'>
                <Button variant="custom" type="submit" className='me-2' onClick={values => setFormState(values)}>Guardar <i className="fa-solid fa-plus"></i></Button>
                <Button variant="outline-secondary" type="button" className='me-2' onClick={() => { limpiarFormulario() }}>Nuevo <i className="fas fa-plus"></i></Button>
                <Button variant="outline-secondary" type="button" className='me-2' onClick={() => navigate(rutaServidor + "/tipovehiculo/TipoVehiculos")}>Regresar <i className="fas fa-arrow-left"></i></Button>
            </div>
        </div>
    </Form>);
}

const CampoFormulario = (prop) => {

    return (
        <div className='col col-sm-6 mt-1'>
            <Form.Group controlId={prop.controlId}>
                <Form.Label >{prop.label}</Form.Label>
                <Form.Control
                    type="text"
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





