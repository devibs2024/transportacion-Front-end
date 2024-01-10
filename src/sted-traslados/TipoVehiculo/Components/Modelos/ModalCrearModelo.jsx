import { useEffect, useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import API from "../../../../store/api";
import { procesarErrores } from "../../../../shared/Utils/procesarErrores";
import { accionExitosa, accionFallida } from "../../../../shared/Utils/modals";
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export const ModalCrearModelo = ({ show, setShow, setTipoVehiculoModelo, tipovehiculoModelo,getTipoVehiculoModelo }) => {

    const handleClose = () => setShow(false);
    const [marcasVehiculo, setMarcaVehiculo] = useState([]);

    const [formState, setFormState] = useState(true);

    useEffect(() => {
        getMarcas()
    }, [])

    const formik = useFormik({

        initialValues: {
            modelo: "",
            idMarca: 0
        },
        validationSchema: Yup.object({
            idMarca: Yup.string().required('Este campo es obligatorio'),
            modelo: Yup.string().required('Este campo es obligatorio')
        }),

        onSubmit: (values) => {

            let nuevoModelo = {
                idMarca: values.idMarca,
                modelo: values.modelo,
            }

            postModelo(nuevoModelo);
        }
    });
    const getModelo = async (idMarcaVehiculo, idModelo) => {

        const response = await API.get(`ModeloVehiculo/${idMarcaVehiculo},${idModelo}`);

        if (response.status == 200 || response.status == 204) {

            console.log('getModelos',response.data)

            getTipoVehiculoModelo()
        //    setTipoVehiculoModelo([...tipovehiculoModelo, response.data])
        }

    }
    const getMarcas = async () => {
        try {
            const response = await API.get("MarcaVehiculo");

            if (response.status == 200 || response.status == 204) {

                formik.resetForm();
                handleClose();

                console.log(response.data)
                setMarcaVehiculo(response.data)
            }
        } catch (e) {
            accionFallida({ titulo: 'Ha ocurrido un error', mensaje: procesarErrores(e.response.data) })
        }
    }

    const postModelo = async (modelo) => {

        try {
            const response = await API.post("ModeloVehiculo", modelo);

            if (response.status == 200 || response.status == 204) {
                  getModelo(modelo.idMarca, response.data)
                formik.resetForm();
                handleClose();

                accionExitosa({ titulo: 'Modelo Agregado', mensaje: 'El Modelo ha sido Agregado satisfatoriamente' })
            }
        } catch (e) {
            console.log(e)

            accionFallida({ titulo: 'Ha ocurrido un error', mensaje: procesarErrores(e.response.data) })
        }
    }

    return (
        <Modal show={show} onHide={handleClose}>
            <Form onSubmit={formik.handleSubmit}>
                <Modal.Header closeButton>
                    <Modal.Title>Agregar Nuevo Modelo</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="row">
                        <div className="col col-sm-6">
                            <Form.Group controlId="idMarca">
                                <Form.Label>Marca</Form.Label>
                                <Form.Select
                                    value={formik.values.idMarca}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    name="idMarca">
                                    <option value="">Seleccione la Marca</option>
                                    {marcasVehiculo.map((marchaVehiculo) => (
                                        <option key={marchaVehiculo.idMarca} value={marchaVehiculo.idMarca}>
                                            {marchaVehiculo.marca}
                                        </option>
                                    ))}
                                </Form.Select>
                                <Form.Text className="text-danger">
                                    {formik.touched.idMarca && formik.errors.idMarca ? (
                                        <div className="text-danger">{formik.errors.idMarca}</div>
                                    ) : null}
                                </Form.Text>
                            </Form.Group>
                        </div>
                        <div className="col col-sm-6">
                            <Form.Group controlId="modelo">
                                <Form.Label>Modelo</Form.Label>
                                <Form.Control
                                    value={formik.values.modelo}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}>
                                </Form.Control>
                                <Form.Text className="text-danger">
                                    {formik.touched.modelo && formik.errors.modelo ? (<div className="text-danger">{formik.errors.modelo}</div>) : null}
                                </Form.Text>
                            </Form.Group>
                        </div>
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
        </Modal>
    )
}