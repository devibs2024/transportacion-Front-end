import { useState } from "react";
import { Button, Modal, Form, Card } from "react-bootstrap";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import API from "../../../../store/api";
import { useGetOperadores } from "../../../../hooks/useGetOperadores";
import { accionExitosa, accionFallida } from '../../../../shared/Utils/modals';
import { procesarErrores } from '../../../../shared/Utils/procesarErrores';

export const ModalCrearOperadorVehiculo = ({ setIdEmpleado, idEmpleado, vehiculo, show, setShow, getOperadorVehiculos }) => {

    const handleClose = () => setShow(false);
    const [formState, setFormState] = useState(true);


    const formik = useFormik({

        initialValues: {
            idEmpleado: '',
        },
        validationSchema: Yup.object({
            idEmpleado: Yup.string().required('Este campo es obligatorio'),
        }),


        onSubmit: (values) => {

            let nuevoVehiculo = {
                idVehiculo: vehiculo.idVehiculo,
                idEmpleado: values.idEmpleado,
            }
            postVehiculo(nuevoVehiculo);
        }
    });
    const operadoresOptions = useGetOperadores().filter(x => x.empleadoInterno === true).map(p => ({
        value: p.idEmpleado,
        label: p.nombres
    }));

    const postVehiculo = async (vehiculo) => {

        try {
            const response = await API.post(`AsignacionarVehiculo/${vehiculo.idEmpleado},${vehiculo.idVehiculo}`);

            if (response.status == 200 || response.status == 204) {

                setIdEmpleado(response.data);
                accionExitosa({ titulo: 'Asignación de Vehículo Agregada', mensaje: ' ¡La Asignación de Vehículo ha sido creada satisfactoriamente!' });
                formik.resetForm();
                setShow(false);

                await getOperadorVehiculos(vehiculo.idEmpleado, vehiculo.idVehiculo);
            } else {

                accionFallida({ titulo: 'La Asignacion no pudo ser Agregado', mensaje: '¡Ha ocurrido un error al intentar agregar la Asignar el vehículo' });
                setShow(false);
                formik.resetForm();
            }
        } catch (e) {

            let errores = e.response.data;

            accionFallida({ titulo: 'La Asignacion no pudo ser Agregado', mensaje: procesarErrores(errores) });
        }

    }

    return (
        <Modal centered show={show} onHide={handleClose}>
            <Form onSubmit={formik.handleSubmit}>
                <Modal.Header closeButton>
                    <Modal.Title>Asignar Vehiculo a un Operador</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group controlId="idEmpleado">
                        <Form.Label>Clientes:</Form.Label>
                        <Form.Control as="select"
                            value={formik.values.idEmpleado}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}>
                            <option value="">Seleccione un Operador</option>
                            {operadoresOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </Form.Control>
                        <Form.Text className="text-danger">
                            {formik.touched.idCliente && formik.errors.idCliente ? (<div className="text-danger">{formik.errors.idCliente}</div>) : null}
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
    )

}