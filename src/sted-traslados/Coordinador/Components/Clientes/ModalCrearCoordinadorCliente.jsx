import { useEffect, useState } from "react";
import { useFormik } from 'formik';
import API from "../../../../store/api";
import { Button, Card, Table, Modal, Form } from "react-bootstrap";
import * as Yup from 'yup';
import { useDataCliente } from "../../../../hooks/useDataCliente";
import { accionExitosa, accionFallida } from '../../../../shared/Utils/modals';
import { procesarErrores } from "../../../../shared/Utils/procesarErrores";


export const ModalCrearCoordinadorCliente = ({ coordinador, getCoordinadorClientes, coordinadorClientes, setCoordinadorClientes, show, setShow }) => {

    const [formState, setFormState] = useState(true);
    const handleClose = () => setShow(false);
    /*     const [clientesOptions, setClientesOptions] = useState([]);
     */
    const [tiendasOptions, setTiendasOptions] = useState([]);
    const [zonaStedsOptions, setZonaStedsOptions] = useState([]);

    const clientes = useDataCliente();

    const clientesOptions = clientes.map((data) => ({
        value: data.idCliente,
        label: data.nombreCliente
    }));

    const formik = useFormik({

        initialValues: {
            idTienda: ''
        },
        validationSchema: Yup.object({
            idTienda: Yup.number().required('Este campo es obligatorio'),
        }),

        onSubmit: (values) => {

            let nuevoTienda = {
                idCoordinador: coordinador.idEmpleado,
                idTienda: values.idTienda
            }

            postCoordinadorTienda(nuevoTienda);
        }
    });

    const getZonaStedsByIdCliente = async (idCliente) => {

        const response = await API.get("ZonaSteds");

        if (response.status === 200 || response.status === 204) {

            const data = response.data.filter(x => x.idCliente == idCliente).map((data) => ({
                value: data.idZonaSted,
                label: data.nombreZona
            }));

            setZonaStedsOptions(data);
        }
    }

    const getTiendasByIdZonaSted = async (idZonaSted) => {

        const response = await API.get(`TiendasCoordinador/${idZonaSted}`);

        if (response.status === 200 || response.status === 204) {

            const data = response.data.map((tienda) => ({
                value: tienda.idTienda,
                label: tienda.nombreTienda
            }));

            setTiendasOptions(data);
        }
    }

    const postCoordinadorTienda = async (tienda) => {

        try {

            const response = await API.post(`TiendasCoordinador/${tienda.idCoordinador},${tienda.idTienda}`);

            if (response.status == 200 || response.status == 204) {

                accionExitosa({ titulo: 'Tienda Agregado', mensaje: ' ¡La Tienda ha sido creado satisfactoriamente!' });
                handleClose();
                formik.resetForm();

                await getCoordinadorClientes();


            } else {

                accionFallida({ titulo: 'La Tienda no pudo ser Agregado', mensaje: '¡Ha ocurrido un error al intentar agregar la tienda' });
                handleClose();
                formik.resetForm();
            }

        } catch (e) {

            let errores = e.response.data;

            accionFallida({ titulo: 'La Tienda no pudo ser Agregado', mensaje: procesarErrores(errores) });
        }


    }

    const onChangeCliente = (event) => {

        formik.handleChange(event);

        const idCliente = document.getElementById('idCliente').value;

        if (idCliente != 0) {

            getZonaStedsByIdCliente(idCliente);
        }
    }

    const onChangeZonaSteds = (event) => {

        formik.handleChange(event);

        const idZonaSted = document.getElementById('idZonaSted').value;

        if (idZonaSted != 0) {

            getTiendasByIdZonaSted(idZonaSted);
        }
    }

    return (
        <Modal centered show={show} onHide={handleClose}>
            <Form onSubmit={formik.handleSubmit}>
                <Modal.Header closeButton>
                    <Modal.Title>Agregar Nueva Tienda</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group controlId="idCliente">
                        <Form.Label>Clientes:</Form.Label>
                        <Form.Control as="select"
                            value={formik.values.idCliente}
                            onChange={onChangeCliente}
                            onBlur={formik.handleBlur}>
                            <option value="">Seleccione un Cliente</option>
                            {clientesOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </Form.Control>
                        <Form.Text className="text-danger">
                            {formik.touched.idCliente && formik.errors.idCliente ? (<div className="text-danger">{formik.errors.idCliente}</div>) : null}
                        </Form.Text>
                    </Form.Group>

                    <Form.Group controlId="idZonaSted">
                        <Form.Label>Zona Steds:</Form.Label>
                        <Form.Control as="select"
                            value={formik.values.idZonaSted}
                            onChange={onChangeZonaSteds}
                            onBlur={formik.handleBlur}>
                            <option value="">Seleccione una ZonaSted</option>
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

                    <Form.Group controlId="idTienda">
                        <Form.Label>Tiendas:</Form.Label>
                        <Form.Control as="select"
                            value={formik.values.idTienda}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}>
                            <option value="">Seleccione una Tienda</option>
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