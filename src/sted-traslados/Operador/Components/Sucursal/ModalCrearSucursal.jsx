import { useEffect, useState } from "react";
import { useGetSucursales } from "../../../../hooks/useGetSucursales";
import API from "../../../../store/api";
import { useFormik } from "formik";
import * as Yup from 'yup';
import { Button, Card, Table, Modal, Form } from "react-bootstrap";
import { useSelector } from "react-redux";
import { accionExitosa } from "../../../../shared/Utils/modals";

export const ModalCrearSucursal = ({ operador, handleClose, operadorSucursales, setOperadorSucursales, show, setShow }) => {

    const [formState, setFormState] = useState(true);

    const [sucursalesOptions, setSucursalesOptions] = useState([]);


    const sucursales = useGetSucursales();

    useEffect(() => {
        const filterSucursales = sucursales.filter(x => !operadorSucursales.some(s => s.idSucursal == x.idSucursal)).map(s => ({
            value: s.idSucursal,
            label: s.nombreSucursal
        }));
        setSucursalesOptions(filterSucursales);

    }, [operadorSucursales])


    const eliminarSucursalSeleccionada = (idSucursalSeleccionada) => {
        const nuevasOpciones = sucursalesOptions.filter(s => s.value !== idSucursalSeleccionada);
        formik.setFieldValue('idSucursal', '');
        formik.setFieldTouched('idSucursal', false);
        setSucursalesOptions(nuevasOpciones);
    };

    const postOperadorSucursal = async (operadorSucursal) => {

        const response = await API.post("OperadorSucursal", operadorSucursal);

        if (response.status == 200 || response.status == 204) {

            const nuevoOperadorSucursal = sucursales.find(x => x.idSucursal == operadorSucursal.idSucursal)

            setOperadorSucursales([...operadorSucursales, nuevoOperadorSucursal]);

            eliminarSucursalSeleccionada(operadorSucursal.idSucursal);

            accionExitosa({ titulo: 'Sucursal Creada!', mensaje: 'La sucursal ha sido creada satisfactoriamente' });

            setShow(true);

        } else {

        }
    }


    const formik = useFormik({

        initialValues: {
            idSucursal: ''
        },
        validationSchema: Yup.object({
            idSucursal: Yup.string().required('Este campo es obligatorio'),
        }),
        onSubmit: (values) => {

            let nuevoOperadorSucursal = {
                idEmpleado: operador.idEmpleado,
                idSucursal: values.idSucursal
            }
            postOperadorSucursal(nuevoOperadorSucursal);
        }
    });



    return (


        <Modal show={show} onHide={handleClose}>
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
                                <option key={option.value} value={option.value}
                                >
                                    {option.label}
                                </option>
                            ))
                            }
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