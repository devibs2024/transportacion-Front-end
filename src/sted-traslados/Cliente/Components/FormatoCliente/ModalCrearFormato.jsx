import { useGetFormatos } from "../../../../hooks/useGetFormatos";
import { postformatos } from "../../../../store/slices/thunks/formatoThunks";
import { useFormik } from "formik";
import API from "../../../../store/api";
import { useState } from "react";
import * as Yup from 'yup';
import { Button, Modal, Form } from "react-bootstrap";
import { accionExitosa, accionFallida } from "../../../../shared/Utils/modals";
import { procesarErrores } from "../../../../shared/Utils/procesarErrores";

export const ModalCrearFormato = ({ cliente, show, setShow, setFormatoClientes, getFormatoClientes, formatoClientes }) => {
    const [formState, setFormState] = useState(true);
    const handleClose = () => setShow(false);


    const [formato, setFormatos] = useState({
        idCliente: '',
        idFormato: '',
    });

    const formatos = useGetFormatos();

    const formatosOptions = formatos.map(f => ({
        value: f.idFormato,
        label: f.descripcionFormato
    }));

    const formik = useFormik({

        initialValues: {
            idFormato: ''
        },
        validationSchema: Yup.object({
            idFormato: Yup.string().required('Este campo es obligatorio'),
        }),

        onSubmit: (values) => {
            let nuevoFormato = {
                idCliente: cliente.idCliente,
                idFormato: values.idFormato
            }
            console.log('posting', nuevoFormato)
            postformatos(nuevoFormato);

        }
    });

    const postformatos = async (formato) => {
        try {

        } catch (e) {
            let errores = e.response.data;

            accionFallida({ titulo: 'Formato no pudo ser Agregado', mensaje: procesarErrores(errores) })
        }
        const response = await API.post("FormatoClientes", formato);
        if (response.status == 200 || response.status == 204) {

            accionExitosa({ titulo: 'Formato Agregado', mensaje: 'El formato ha sido agregado satisfactoriamente' }).then(() => {
                handleClose();
                formik.resetForm();
            })

            await getFormatoClientes();
        } else {
            accionFallida({ titulo: 'Formato no pudo ser Agregado', mensaje: 'El formato ha sido agregado satisfactoriamente' }).then(() => {
                handleClose();
                formik.resetForm();
            })
        }
    }

    return (

        <Modal show={show} onHide={handleClose}>
            <Form onSubmit={formik.handleSubmit}>
                <Modal.Header closeButton>
                    <Modal.Title>Agregar Nuevo Formato</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form.Group controlId="idFormato">
                        <Form.Label>Formato:</Form.Label>
                        <Form.Control as="select"
                            value={formik.values.idFormato}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}>
                            <option value="">Seleccione un Formato</option>
                            {formatosOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </Form.Control>
                        <Form.Text className="text-danger">
                            {formik.touched.idFormato && formik.errors.idFormato ? (<div className="text-danger">{formik.errors.idFormato}</div>) : null}
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
        </Modal>

    );

}