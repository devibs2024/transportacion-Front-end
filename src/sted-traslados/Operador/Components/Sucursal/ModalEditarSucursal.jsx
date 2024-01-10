import { useEffect, useState } from "react";
import { useGetSucursales } from "../../../../hooks/useGetSucursales";
import API from "../../../../store/api";
import { useFormik } from "formik";
import * as Yup from 'yup';
import { Button, Modal, Form } from "react-bootstrap";

export const ModalEditarSucursal = ({ operador, sucursal, handleClose, show }) => {

    const [formState, setFormState] = useState(true);

    const sucursalesOptions = useGetSucursales().map(s => ({
        value: s.idSucursal,
        label: s.nombreSucursal
    }));



    const formik = useFormik({

        initialValues: {
            idSucursal: ''
        },
        validationSchema: Yup.object({
            idSucursal: Yup.string().required('Este campo es obligatorio'),
        }),
        onSubmit: (values) => {

            let nuevaSucursal = {
                idEmpleado: operador.idEmpleado,
                idSucursal: values.idSucursal
            }

            putSucursal(nuevaSucursal);
        }
    });
    const putSucursal = async (sucursal) => {

        const response = await API.put("OperadorSucursal", {
            idEmpleado: sucursal.idEmpleado,
            idSucursal: sucursal.idSucursal,
        });

        if (response.status == 200 || response.status == 204) {



        } else {

        }
    }

    return (<Modal show={show} onHide={handleClose}>
        <Form onSubmit={formik.handleSubmit}>
            <Modal.Header closeButton>
                <Modal.Title>Agregar Nueva Sucursal</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form.Group controlId="idSucursal">
                    <Form.Label>Sucursal:</Form.Label>
                    <Form.Control as="select"
                        value={formik.values.idSucursal}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}>
                        <option value="">Seleccione un estado</option>
                        {sucursalesOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </Form.Control>
                    <Form.Text className="text-danger">
                        {formik.touched.idSucursal && formik.errors.idSucursal ? (<div className="text-danger">{formik.errors.idSucursal}</div>) : null}
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
    </Modal>);
}