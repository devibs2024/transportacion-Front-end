import { useEffect, useState } from "react";
import { useFormik } from 'formik';
import API from "../../../../store/api";
import { Button, Modal, Form } from "react-bootstrap";
import * as Yup from 'yup';
import { accionExitosa, accionFallida } from '../../../../shared/Utils/modals';
import { procesarErrores } from "../../../../shared/Utils/procesarErrores";


export const ModalCrearClienteZonaSted = ({ cliente, clienteZonaSteds, setClienteZonaSteds, getZonaSteds,show, setShow, zonaSted, setZonaSted }) => {

    const [formState, setFormState] = useState(true);
    
    const handleClose = () => setShow(false);

    const formik = useFormik({

        initialValues: {
            nombreZona: '',
            claveDET: '',
            activa: false
        },
        validationSchema: Yup.object({
            nombreZona: Yup.string().required('Este campo es obligatorio'),
            claveDET: Yup.string().required('Este campo es obligatorio'),
        }),

        onSubmit: (values) => {

            let nuevoClienteZonaSted = {
                idCliente: cliente.idCliente,
                nombreZona: values.nombreZona,
                claveDET: values.claveDET,
                activa: values.activa
            }

            postClienteZonaSted(nuevoClienteZonaSted);
        }
    });


    const postClienteZonaSted = async (zonaSted) => {

        try {
            const response = await API.post(`ZonaSteds`, zonaSted);

            if (response.status === 200 || response.status === 204) {

                handleClose();


                setClienteZonaSteds(clienteZonaSteds)


                setZonaSted(response.data)
                accionExitosa({ titulo: 'ZonaSted Agregada', mensaje: ' ¡La ZonaSted ha sido creado satisfactoriamente!' }).then(() => {
                    formik.resetForm();
                });


                await getZonaSteds();


            } else {

                accionFallida({ titulo: 'La ZonaSted no pudo ser Agregada', mensaje: '¡Ha ocurrido un error al intentar agregar la zonaSted' }).then(() => {
                    handleClose();
                    formik.resetForm();
                });

            }

        } catch (e) {

            let errores = e.response.data;

            accionFallida({ titulo: 'La ZonaSted no pudo ser Agregada', mensaje: procesarErrores(errores) });
        }

    }

    return (
        <Modal centered show={show} onHide={handleClose}>
            <Form onSubmit={formik.handleSubmit}>
                <Modal.Header closeButton>
                    <Modal.Title>Agregar Nueva ZonaSted</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="row">
                        <CampoFormulario
                            controlId="nombreZona"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.nombreZona}
                            label="Nombre ZonaSted:"
                            placeholder="Introduzca el Nombre de la ZonaSted"
                            name="nombreZona"
                            error={formik.touched.nombreZona && formik.errors.nombreZona ? (<div className="text-danger">{formik.errors.nombreZona}</div>) : null} />

                        <CampoFormulario
                            controlId="claveDET"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.claveDET}
                            label="Clave DET:"
                            placeholder="Introduzca la clave DET"
                            name="claveDET"
                            error={formik.touched.claveDET && formik.errors.claveDET ? (<div className="text-danger">{formik.errors.claveDET}</div>) : null} />

                        <Form.Check
                            controlId="activa"
                            type="switch"
                            label="Estatus ZonaSted"
                            checked={formik.values.activa}
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