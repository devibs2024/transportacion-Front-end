import { useEffect, useState } from "react";
import { useFormik } from 'formik';
import API from "../../../../store/api";
import { Button, Modal, Form } from "react-bootstrap";
import * as Yup from 'yup';
import { accionExitosa, accionFallida } from '../../../../shared/Utils/modals';
import { useGetEstados } from "../../../../hooks/useGetEstados";
import { procesarErrores } from "../../../../shared/Utils/procesarErrores";


export const ModalCrearZonaStedTienda = ({ cliente, zonaStedTiendas ,zonaStedTienda, setZonaStedTiendas, getTiendas, show, setShow }) => {

    const [formState, setFormState] = useState(true);
    const [subGerenteOptions, setSubGerenteOptions] = useState([]);
    const [zonaStedsOptions, setZonaStedsOptions] = useState([]);
    const [idTienda, setIdTienda] = useState(0);
    const handleClose = () => setShow(false);
    const estados = useGetEstados();

    useEffect(() => {
        getSubGerente();
        getZonaSted();
    }, [])

    if (zonaStedTienda != null) {

        formik.setValues({
            nombreTienda: zonaStedTienda.nombreTienda,
            idSubGerente: zonaStedTienda.idSubGerente,
            idEstado: zonaStedTienda.idEstado,
            idZonaSted: zonaStedTienda.idZonaSted,
            numUnidades: zonaStedTienda.numUnidades,
            unidadesMaximas: zonaStedTienda.unidadesMaximas,
            tarifa: zonaStedTienda.tarifa,
            tarifaDescanso: zonaStedTienda.tarifaDescanso,
            cntEmpleadosInterno: zonaStedTienda.cntEmpleadosInterno,
            cntEmpleadosExterno: zonaStedTienda.cntEmpleadosExterno,
            cntEmpleadosSpot: zonaStedTienda.cntEmpleadosSpot,
            activa: zonaStedTienda.activa
        });

    } else if (idTienda != 0) {

        formik.setValues(zonaStedTienda);
    }
    const updateTienda = (updatedTienda) => {
        setZonaStedTiendas((prevTienda) => ({
            ...prevTienda,
            ...updatedTienda
        }));
    };


    const formik = useFormik({

        initialValues: {
            nombreTienda: '',
            idSubGerente: '',
            idEstado: '',
            idZonaSted: '',
            numUnidades: '',
            unidadesMaximas: '',
            tarifa: '',
            tarifaDescanso: '',
            cntEmpleadosInterno: '',
            cntEmpleadosExterno: '',
            cntEmpleadosSpot:'',
            activa: false
        },
        validationSchema: Yup.object({
            nombreTienda: Yup.string().required('Este campo es obligatorio'),
            idSubGerente: Yup.number().required('Este campo es obligatorio'),
            idEstado: Yup.number().required('Este campo es obligatorio'),
            idZonaSted: Yup.number().required('Este campo es obligatorio'),
            numUnidades: Yup.number().required('Este campo es obligatorio'),
            unidadesMaximas: Yup.number().required('Este campo es obligatorio'),
            tarifa: Yup.number().required('Este campo es obligatorio'),
            tarifaDescanso: Yup.number().required('Este campo es obligatorio'),
            cntEmpleadosInterno: Yup.number().required('Este campo es obligatorio'),
            cntEmpleadosExterno:Yup.number().required('Este campo es obligatorio'),
            cntEmpleadosSpot: Yup.number().required('Este campo es obligatorio'),
        }),

        onSubmit: (values) => {

            let nuevoZonaStedTienda = {
                nombreTienda: values.nombreTienda,
                idSubGerente: values.idSubGerente,
                idEstado: values.idEstado,
                idZonaSted: values.idZonaSted,
                numUnidades: values.numUnidades,
                unidadesMaximas: values.unidadesMaximas,
                tarifa: values.tarifa,
                tarifaDescanso: values.tarifaDescanso,
                cntEmpleadosInterno: values.cntEmpleadosInterno,
                cntEmpleadosExterno: values.cntEmpleadosExterno,
                cntEmpleadosSpot: values.cntEmpleadosSpot,
                activa: values.activa
            }

            postClienteZonaSted(nuevoZonaStedTienda);
        }
    });


    const getSubGerente = async () => {

        const response = await API.get(`GerenteSubGerente/${cliente.idCliente}`)

        if (response.status === 200) {

            const data = response.data.map((data) => ({
                value: data.idSubGerente,
                label: data.nombreSubGerente
            }));

            setSubGerenteOptions(data);
        }
    }

    const getZonaSted = async () => {

        const response = await API.get('ZonaSteds')

        if (response.status === 200) {

            let data = response.data.filter(x => x.idCliente == cliente.idCliente).map((data) => ({
                value: data.idZonaSted,
                label: data.nombreZona
            }));

            setZonaStedsOptions(data);
        }
    }

    const estadosOptions = estados.map((data) => ({
        value: data.idEstado,
        label: data.nombreEstado
    }));
    const postClienteZonaSted = async (tienda) => {

        try {

            let response;

            if (idTienda == 0) {

                response = await API.post(`Tiendas`, tienda);

                if (response.status === 200 || response.status === 204) {
    
                    accionExitosa({ titulo: 'Tienda Agregada', mensaje: ' ¡La Tienda ha sido creada satisfactoriamente!' }).then(() => {
                        setShow(false);
                        formik.resetForm();
                    });


                    await getTiendas();

                } else {

                    accionFallida({ titulo: 'La Tienda no pudo ser Agregada', mensaje: '¡Ha ocurrido un error al intentar agregar la tienda' }).then(() => {
                        setShow(false);
                        formik.resetForm();
                    });

                }
            } else {

                try {
                    response = await API.put(`Tiendas/${idTienda}`, tienda);

                    if (response.status == 200 || response.status == 204) {


                        accionExitosa({ titulo: 'Tienda Actualizada', mensaje: '¡La Tienda ha sido actualizado satisfactoriamente!' });

                        updateTienda({
                            nombreTienda: tienda.nombreTienda,
                            idSubGerente: tienda.idSubGerente,
                            idEstado: tienda.idEstado,
                            idZonaSted: tienda.idZonaSted,
                            numUnidades: tienda.numUnidades,
                            unidadesMaximas: tienda.unidadesMaximas,
                            tarifa: tienda.tarifa,
                            tarifaDescanso: tienda.tarifaDescanso,
                            cntEmpleadosInterno: tienda.cntEmpleadosInterno,
                            cntEmpleadosExterno: tienda.cntEmpleadosExterno,
                            cntEmpleadosSpot: tienda.cntEmpleadosSpot,
                            activa: tienda.activa
                        });

                    } else {
                        accionFallida('La Tienda no puedo ser Actualizado', '¡Ha ocurrido un error al intentar actualizar la tienda!')

                    }
                } catch (e) {

                    let errores = e.response.data;

                    accionFallida({ titulo: 'La Tienda no puedo ser Actualizado', mensaje: procesarErrores(errores) })
                }

            }

        } catch (e) {

            console.log('Segundo catch',e);

            let errores = e.response.data;

            accionFallida({ titulo: 'La Tienda no pudo ser Agregada', mensaje: procesarErrores(errores) });
        }
    }

    return (
        <Modal centered show={show} onHide={handleClose}>
            <Form onSubmit={formik.handleSubmit}>
                <Modal.Header closeButton>
                    <Modal.Title>Agregar Nueva Tienda</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="row">
                        <CampoFormulario
                            controlId="nombreTienda"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.nombreTienda}
                            label="Nombre de la Tienda:"
                            placeholder="Introduzca el Nombre de la Tienda"
                            name="nombreTienda"
                            error={formik.touched.nombreTienda && formik.errors.nombreTienda ? (<div className="text-danger">{formik.errors.nombreTienda}</div>) : null} />

                        <div className='col col-sm-6 mt-1'>
                            <Form.Group controlId="idSubGerente">
                                <Form.Label>Sub-Gerentes:</Form.Label>
                                <Form.Control as="select"
                                    value={formik.values.idSubGerente}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}>
                                    <option value="">Seleccione un Sub-Gerente</option>
                                    {subGerenteOptions.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </Form.Control>
                                <Form.Text className="text-danger">
                                    {formik.touched.idSubGerente && formik.errors.idSubGerente ? (<div className="text-danger">{formik.errors.idSubGerente}</div>) : null}
                                </Form.Text>
                            </Form.Group>
                        </div>

                        <div className='col col-sm-6 mt-1'>
                            <Form.Group controlId="idZonaSted">
                                <Form.Label>zonaSteds:</Form.Label>
                                <Form.Control as="select"
                                    value={formik.values.idZonaSted}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}>
                                    <option value="">Seleccione una zonaSted</option>
                                    {zonaStedsOptions.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </Form.Control>
                                <Form.Text className="text-danger">
                                    {formik.touched.idZonaSted && formik.errors.idZonaSted ? (<div className="text-danger">{formik.errors.idZonaSted}</div>) : null}
                                </Form.Text>
                            </Form.Group>
                        </div>

                        <div className='col col-sm-6 mt-1'>
                            <Form.Group controlId="idEstado">
                                <Form.Label>Estados:</Form.Label>
                                <Form.Control as="select"
                                    value={formik.values.idEstado}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}>
                                    <option value="">Seleccione un Estado</option>
                                    {estadosOptions.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </Form.Control>
                                <Form.Text className="text-danger">
                                    {formik.touched.idEstado && formik.errors.idEstado ? (<div className="text-danger">{formik.errors.idEstado}</div>) : null}
                                </Form.Text>
                            </Form.Group>
                        </div>

                        <CampoFormulario
                            controlId="numUnidades"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.numUnidades}
                            label="Número de Unidades:"
                            placeholder="Introduzca el Número  de Unidades:"
                            name="numUnidades"
                            error={formik.touched.numUnidades && formik.errors.numUnidades ? (<div className="text-danger">{formik.errors.numUnidades}</div>) : null} />

                        <CampoFormulario
                            controlId="unidadesMaximas"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.unidadesMaximas}
                            label="Unidad Máxima:"
                            placeholder="Introduzca la Unidad Máxima"
                            name="unidadesMaximas"
                            error={formik.touched.unidadesMaximas && formik.errors.unidadesMaximas ? (<div className="text-danger">{formik.errors.unidadesMaximas}</div>) : null} />

                        <CampoFormulario
                            controlId="tarifa"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.tarifa}
                            label="Tarifa:"
                            placeholder="Introduzca la Tarifa"
                            name="tarifa"
                            error={formik.touched.tarifa && formik.errors.tarifa ? (<div className="text-danger">{formik.errors.tarifa}</div>) : null} />

                        <CampoFormulario
                            controlId="tarifaDescanso"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.tarifaDescanso}
                            label="Tarifa Descanso:"
                            placeholder="Introduzca la Tarifa Descanso"
                            name="tarifaDescanso"
                            error={formik.touched.tarifaDescanso && formik.errors.tarifaDescanso ? (<div className="text-danger">{formik.errors.tarifaDescanso}</div>) : null} />

                        <CampoFormulario
                            controlId="cntEmpleadosInterno"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.cntEmpleadosInterno}
                            label="Cantidad Empleados Internos:"
                            placeholder="Introduzca la Cantidad Empleados Internos"
                            name="cntEmpleadosInterno"
                            error={formik.touched.cntEmpleadosInterno && formik.errors.cntEmpleadosInterno ? (<div className="text-danger">{formik.errors.cntEmpleadosInterno}</div>) : null} />
                        
                        <CampoFormulario
                            controlId="cntEmpleadosExterno"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.cntEmpleadosExterno}
                            label="Cantidad Empleados Externos:"
                            placeholder="Introduzca la Cantidad Empleados Externos"
                            name="cntEmpleadosExterno"
                            error={formik.touched.cntEmpleadosExterno && formik.errors.cntEmpleadosExterno ? (<div className="text-danger">{formik.errors.cntEmpleadosExterno}</div>) : null} />
                        
                        <CampoFormulario
                            controlId="cntEmpleadosSpot"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.cntEmpleadosSpot}
                            label="Cantidad Empleados Spot:"
                            placeholder="Introduzca la Cantidad Empleados Spot"
                            name="cntEmpleadosSpot"
                            error={formik.touched.cntEmpleadosSpot && formik.errors.cntEmpleadosSpot ? (<div className="text-danger">{formik.errors.cntEmpleadosSpot}</div>) : null} />
                        
                        <Form.Check
                            controlId="activa"
                            type="switch"
                            label="Estatus Tienda"
                            checked={formik.values.activo}
                            onChange={() => { formik.setFieldValue('activa', !formik.values.activa) }}
                            className='mx-3'
                        />
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cerrar
                    </Button>
                    <Button type="submit" variant="custom" onClick={values => setFormState(values)}>
                        Guardar
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>)

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