import { useEffect, useState } from "react";
import { useGetMarcaVehiculo } from "../../../../hooks/useGetMarcaVehiculo";
import API from "../../../../store/api";
import { useFormik } from "formik";
import * as Yup from 'yup';
import { Button, Card, Table, Modal, Form } from "react-bootstrap";
import { useSelector } from "react-redux";
import { accionExitosa, accionFallida } from "../../../../shared/Utils/modals";
import { procesarErrores } from "../../../../shared/Utils/procesarErrores";

export const ModalCrearMarcas = ({ handleClose, show, setShow, tipovehiculoMarcas, setTipoVehiculoMarcas }) => {

    const [formState, setFormState] = useState(true);

    const [tipoVehiculo, setTipoVehiculo] = useState([]);

    useEffect(() => {
        getTipoVehiculo()
    }, [])

    const getTipoVehiculo = async () => {
        try {
            const response = await API.get("TipoVehiculo");

            if (response.status == 200 || response.status == 204) {

                formik.resetForm();
                handleClose();

                setTipoVehiculo(response.data)
            }
        } catch (e) {
            accionFallida({ titulo: 'Ha ocurrido un error', mensaje: procesarErrores(e.response.data) })
        }
    }

    const getMarcaVehiculo = async (idTipoVehiculo, idMarcaVehiculo) => {
        try {
            const response = await API.get(`MarcaVehiculo${idTipoVehiculo},${idMarcaVehiculo}`);

            if (response.status == 200 || response.status == 204) {

                formik.resetForm();
                handleClose();


                console.log(response.data)

                setTipoVehiculoMarcas([...tipovehiculoMarcas, response.data])
            }
        } catch (e) {
            accionFallida({ titulo: 'Ha ocurrido un error', mensaje: procesarErrores(e.response.data) })
        }
    }

    const postMarca = async (marca) => {

        try {
            const response = await API.post("MarcaVehiculo", marca);

            if (response.status == 200 || response.status == 204) {
                formik.resetForm();
                handleClose();

                console.log(response.data)

                getMarcaVehiculo(marca.idTipo, response.data)
                accionExitosa({ titulo: 'Marca Agregada', mensaje: 'La Marca ha sigo agregada satisfactoriamente' })
            }
        } catch (e) {


            accionFallida({ titulo: 'Ha ocurrido un error', mensaje: procesarErrores(e.response.data) })
        }
    }

    const formik = useFormik({

        initialValues: {
            idTipoVehiculo: 0,
            marca: '',
        },
        validationSchema: Yup.object({
            idTipoVehiculo: Yup.string().required('Este campo es obligatorio'),
            marca: Yup.string().required('Este campo es obligatorio')
        }),

        onSubmit: (values) => {

            console.log(values)
            let marca = {
                idTipo: values.idTipoVehiculo,
                marca: values.marca
            }

            postMarca(marca);
        }
    });



    return (

        <Modal show={show} onHide={handleClose}>
            <Form onSubmit={formik.handleSubmit}>
                <Modal.Header closeButton>
                    <Modal.Title>Agregar Nueva Marca</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="row">
                        <div className="col col-sm-6">
                            <Form.Group controlId="idTipoVehiculo">
                                <Form.Label>Tipo de Vehículo</Form.Label>
                                <Form.Select
                                    value={formik.values.idTipoVehiculo}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    name="idTipoVehiculo"
                                >
                                    <option value="">Seleccione un tipo de vehículo</option>
                                    {tipoVehiculo.map((tipo) => (
                                        <option key={tipo.idTipoVehiculo} value={tipo.idTipoVehiculo}>
                                            {tipo.tipoVehiculo}
                                        </option>
                                    ))}
                                </Form.Select>
                                <Form.Text className="text-danger">
                                    {formik.touched.idTipoVehiculo && formik.errors.idTipoVehiculo ? (
                                        <div className="text-danger">{formik.errors.idTipoVehiculo}</div>
                                    ) : null}
                                </Form.Text>
                            </Form.Group>
                        </div>
                        <div className="col col-sm-6">
                            <Form.Group controlId="marca">
                                <Form.Label>Marca</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="marca"
                                    placeholder="Introduzca la marca"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.marca}
                                />
                                <Form.Text className="text-danger">
                                    {formik.touched.marca && formik.errors.marca ? (<div className="text-danger">{formik.errors.marca}</div>) : null}
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
        </Modal>);
}