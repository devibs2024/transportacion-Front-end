
import { Button, Card, Table, Modal, Form } from "react-bootstrap";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import API from "../../../../store/api";
import { useGetCoordinador } from "../../../../hooks/useGetCoordinador";
import { useState } from "react";
import { accionExitosa, accionFallida } from "../../../../shared/Utils/modals";
import { procesarErrores } from "../../../../shared/Utils/procesarErrores";

export const ModalCrearNuevoCoordinador = ({ director, show, setShow, getCoordinadores }) => {

    const [formState, setFormState] = useState(true);
    const handleClose = () => setShow(false);


    const [coordinador, setCoordinador] = useState({
        idEmpleado: '',
        idCoordinador: ''
    });

    const coordinadores = useGetCoordinador();

    const coordinadoresOptions = coordinadores.map(s => ({
        value: s.idEmpleado,
        label: s.nombres
    }));

    const formik = useFormik({

        initialValues: {
            idCoordinador: ''
        },
        validationSchema: Yup.object({
            idCoordinador: Yup.string().required('Este campo es obligatorio'),
        }),
        onSubmit: (values) => {

            let nuevoCoordinador = {
                idEmpleado: director.idEmpleado,
                idCoordinador: values.idCoordinador
            }

            console.log('posting ', nuevoCoordinador);
            postcoordinador(nuevoCoordinador);
        }
    });


    const postcoordinador = async (coordinador) => {

        try {
            const response = await API.post("DirectorCoordinadores", {
                idDirector: coordinador.idEmpleado,
                idCoordinador: coordinador.idCoordinador,
            });

            if (response.status == 200 || response.status == 204) {

                accionExitosa({ titulo: 'Coordinador Agregado ', mensaje: '¡El Coordinador ha sido creado satisfactoriamente!' });
                formik.resetForm();
                setShow(false);
                await getCoordinadores();

            } else {
                accionFallida({
                    titulo: 'Coordinador no pudo ser Agregado ', mensaje: '¡Ha ocurrido un error al intentar agregar el coordinador' });
            }
        } catch (e) {
            let errores = e.response.data;

            accionFallida({titulo: 'EL Coordinador no se pudo Agregar', mensaje:procesarErrores(errores)})
        }

    }


    return (<Modal centered show={show} onHide={handleClose}>
        <Form onSubmit={formik.handleSubmit}>
            <Modal.Header closeButton>
                <Modal.Title>Agregar Nueva coordinador</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form.Group controlId="idCoordinador">
                    <Form.Label>Coordinador:</Form.Label>
                    <Form.Control as="select"
                        value={formik.values.idCoordinador}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}>
                        <option value="">Seleccione la coordinador</option>
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