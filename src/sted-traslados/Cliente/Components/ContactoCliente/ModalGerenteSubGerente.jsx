import { useEffect, useState } from "react";
import { useFormik } from 'formik';
import API from "../../../../store/api";
import { Button, Modal, Form } from "react-bootstrap";
import * as Yup from 'yup';
import { accionExitosa, accionFallida } from '../../../../shared/Utils/modals';
import { procesarErrores } from "../../../../shared/Utils/procesarErrores";

export const ModalGerenteSubGerente = ({ cliente, contactoClientes, getContactoCliente, setContactoClientes, setShow1, show1 }) => {

    const [formState, setFormState] = useState(true);
    const [subGerenteOptions, setSubGerenteOptions] = useState([]);
    const [zonaStedsOptions, setZonaStedsOptions] = useState([]);
    const handleClose1 = () => setShow1(false);

    const gerenteOptions = contactoClientes.filter(x => x.tipoContacto == 1).map((data) => ({

        value: data.idContacto,
        label: data.nombre

    }));

    const subGerentesOptions = contactoClientes.filter(x => x.tipoContacto == 2).map((data) => ({

        value: data.idContacto,
        label: data.nombre

    }));

    const formik = useFormik({

        initialValues: {
            idGerente: '',
            idSubGerente: '',
        },
        validationSchema: Yup.object({
            idGerente: Yup.number().required('Este campo es obligatorio'),
            idSubGerente: Yup.number().required('Este campo es obligatorio'),
        }),

        onSubmit: (values) => {

            let nuevaAsignacion = {
                idSubGerente: values.idSubGerente,
                idGerente: values.idGerente,
            }

            postContactoCliente(nuevaAsignacion);
        }
    });


    const postContactoCliente = async (asignar) => {

        try {

            const response = await API.post("GerenteSubGerente", asignar);

            if (response.status == 200 || response.status == 204) {

                accionExitosa({ titulo: 'Asignación Agregada', mensaje: ' ¡La Asignación ha sido creado satisfactoriamente!' }).then(() => {
                    handleClose1();
                    formik.resetForm();
                });

                await getContactoCliente();

            } else {
                accionFallida({ titulo: 'La Asignación no puedo se Agregado', mensaje: '¡Ha ocurrido un error al intentar agregar la Asignación!' }).then(() => {
                    handleClose1();
                    formik.resetForm();
                });
            }

        } catch (e) {

            let errores = e.response.data;

            accionFallida({ titulo: 'La Asignación no puedo se Agregado', mensaje: procesarErrores(errores) }).then(() => {
                handleClose1();
                formik.resetForm();
            });

        }
    }

    return (
        <Modal centered show={show1} onHide={handleClose1}>
            <Form onSubmit={formik.handleSubmit}>
                <Modal.Header closeButton>
                    <Modal.Title>Asignar Sub Gerente </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="row">

                        <div className='col col-sm-6 mt-1'>
                            <Form.Group controlId="idSubGerente">
                                <Form.Label>Sub Gerentes:</Form.Label>
                                <Form.Control as="select"
                                    value={formik.values.idSubGerente}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}>
                                    <option value="">Seleccione un Sub Gerente</option>
                                    {subGerentesOptions.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </Form.Control>
                                <Form.Text className="text-danger">
                                    {formik.touched.idSubGerente && formik.errors.idSubGerente ? (<div className="text-danger">{formik.errors.idSubGerente}</div>) : null}
                                </Form.Text>
                            </Form.Group>
                        </div>

                        <div className='col col-sm-6 mt-1'>
                            <Form.Group controlId="idGerente">
                                <Form.Label>Gerentes:</Form.Label>
                                <Form.Control as="select"
                                    value={formik.values.idGerente}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}>
                                    <option value="">Seleccione un Gerente</option>
                                    {gerenteOptions.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </Form.Control>
                                <Form.Text className="text-danger">
                                    {formik.touched.idGerente && formik.errors.idGerente ? (<div className="text-danger">{formik.errors.idGerente}</div>) : null}
                                </Form.Text>
                            </Form.Group>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose1}>
                        Cerrar
                    </Button>
                    <Button type="submit" variant="custom" onClick={values => setFormState(values)}>
                        Guardar
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>)

}

