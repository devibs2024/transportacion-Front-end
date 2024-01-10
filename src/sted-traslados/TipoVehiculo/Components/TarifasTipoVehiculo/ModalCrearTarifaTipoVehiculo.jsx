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
import 'react-datepicker/dist/react-datepicker.css';


export const ModalCrearTarifaTipoVehiculo = ({ setTipoVehiculoTarifa, show, setShow, tipovehiculoTarifa }) => {

    const handleClose = () => setShow(false);
    const [tipoVehiculo, setTipoVehiculo] = useState([]);

    const [formState, setFormState] = useState(true);

    useEffect(() => {
        getTipoVehiculo();
    }, [])

    const formik = useFormik({

        initialValues: {
            tarifa: '',
            activa: true,
            principal: true,
            idTipoVehiculo: 0
        },
        validationSchema: Yup.object({
            idTipoVehiculo: Yup.string().required('Este campo es obligatorio'),
            tarifa: Yup.number()
                .typeError("Debe ser un número")
                .required("Este campo es obligatorio")
                .positive("Debe ser un número positivo")
                .min(0.01, "La tarifa debe ser mayor a 0")
        }),

        onSubmit: (values) => {

            let nuevaTarifa = {
                idTipoVehiculo: values.idTipoVehiculo,
                tarifa: values.tarifa,
                activa: values.activa,
                principal: values.principal
            }
            postTarifa(nuevaTarifa);
        }
    });
    const getTipoVehiculoTarifa = async (idTipoVehiculo) => {

        const response = await API.get(`TarifaTipoVehiculo/${idTipoVehiculo}`);

        if (response.status == 200 || response.status == 204) {

        console.log(response.data);

            setTipoVehiculoTarifa([...tipovehiculoTarifa, response.data])
        }

    }
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

    const postTarifa = async (tarifa) => {

        try {
            const response = await API.post("TarifaTipoVehiculo/TarifaTipoVehiculoPost", tarifa);

            if (response.status == 200 || response.status == 204) {
                getTipoVehiculoTarifa(tarifa.idTipoVehiculo)
                formik.resetForm();
                handleClose();

                accionExitosa({ titulo: 'Tarifa Agregada', mensaje: 'La tarifa ha sigo agregada satisfactoriamente' })
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
                    <Modal.Title>Agregar Nueva Tarifa</Modal.Title>
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
                            <Form.Group controlId="tarifa">
                                <Form.Label>Tarifa</Form.Label>
                                <Form.Control
                                    value={formik.values.tarifa}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}>
                                </Form.Control>
                                <Form.Text className="text-danger">
                                    {formik.touched.tarifa && formik.errors.tarifa ? (<div className="text-danger">{formik.errors.tarifa}</div>) : null}
                                </Form.Text>
                            </Form.Group>
                        </div>
                        <div className="col col-sm-6">
                            <Form.Group controlId="principal">
                                <Form.Label>Principal:</Form.Label>
                                <Form.Check
                                    type="switch"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    checked={formik.values.principal}
                                    name="principal"
                                    className="mt-2"
                                />
                                <Form.Text className="text-danger">
                                    {formik.touched.principal && formik.errors.principal ? (
                                        <div className="text-danger">{formik.errors.principal}</div>
                                    ) : null}
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
