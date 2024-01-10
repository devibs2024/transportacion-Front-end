import { Button, Modal, Form } from "react-bootstrap";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { postTarjeta } from "./tarjetaUtils";

export const ModalCrearAsignacionTarjeta = ({ show, setShow, operador, tarjetas, setTarjetas }) => {

    const handleClose = () => setShow(false);

    const formik = useFormik({
        initialValues: {
            numTarjeta: '',
            montoDiario: 0,   
            numeroInterno: ''
        },
        validationSchema: Yup.object({
            numTarjeta: Yup.string().required('Este campo es obligatorio'),
            numeroInterno: Yup.string().required('Este campo es obligatorio'),
            montoDiario:  Yup.string().required('Este campo es obligatorio')
        }),
        onSubmit: values => {
            const nuevaTarjeta = { idEmpleado: operador.idEmpleado, numTarjeta: values.numTarjeta, numeroInterno: values.numeroInterno, montoDiario: values.montoDiario };
            postTarjeta(nuevaTarjeta, tarjetas, setTarjetas, handleClose, formik);
        }
    });

    return (
        <Modal show={show} onHide={handleClose}>
            <Form onSubmit={formik.handleSubmit}>
                <Modal.Header closeButton>
                    <Modal.Title>Agregar Nueva Tarjeta de Gasolina</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group controlId="numTarjeta">
                        <Form.Label>Tarjeta de Gasolina</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Introduzca el número de Tarjeta"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.numTarjeta}
                        />
                        <Form.Text className="text-danger">
                            {formik.touched.numTarjeta && formik.errors.numTarjeta ? (<div className="text-danger">{formik.errors.numTarjeta}</div>) : null}
                        </Form.Text>
                    </Form.Group>
                    <Form.Group controlId="numeroInterno">
                        <Form.Label>Número Interno</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Introduzca el Número Interno de la Tarjeta"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.numeroInterno}
                        />
                        <Form.Text className="text-danger">
                            {formik.touched.numeroInterno && formik.errors.numeroInterno ? (<div className="text-danger">{formik.errors.numeroInterno}</div>) : null}
                        </Form.Text>
                    </Form.Group>
                    <Form.Group controlId="montoDiario">
                        <Form.Label>Monto Diario</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Introduzca el Monto Diario"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.montoDiario}
                        />
                        <Form.Text className="text-danger">
                            {formik.touched.montoDiario && formik.errors.montoDiario ? (<div className="text-danger">{formik.errors.montoDiario}</div>) : null}
                        </Form.Text>
                    </Form.Group>
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
        </Modal>
    );
}