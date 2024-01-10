import { useEffect, useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import API from "../../../../store/api";
import { useGetTipoVehiculos } from "../../../../hooks/useGetTipoVehiculos";

export const ModalCrearOperadorHorario = ({ operador, operadorHorarios, setOperadorHorarios, show, setShow }) => {

    const handleClose = () => setShow(false);

    const [formState, setFormState] = useState(true);

    const [diasOptions, setDiasOptions] = useState([]);
    const [tandasOptions, setTandasOptions] = useState([]);

    const [tandas, setTandas] = useState([]);

    useEffect(() => {
        getDias();
        getTandas();
    }, [])


    const getDias = async () => {

        const response = await API.get(`dias`);

        if (response.status == 200 || response.status == 204) {

            let data = response.data.map((data) => ({
                value: data.idDia,
                label: data.descripcion
            }));
            setDiasOptions(data);
        }
    }



    const getTandas = async () => {
        const response = await API.get(`Horarios`);

        if (response.status == 200 || response.status == 204) {

            setTandas(response.data);
        }
    }



    const onChangeDia = (event) => {

        formik.handleChange(event);

        const idDia = document.getElementById('idDia').value;

        const filteredTandasOptions = tandas.filter(x => x.idDia == idDia).map((data) => ({
            value: data.idHorario,
            label: data.horaInicio + ' - ' + data.horaFin
        }));;
        setTandasOptions(filteredTandasOptions)

    }

    const formik = useFormik({

        initialValues: {
            idDia: '',
            idHorario: ''
        },
        validationSchema: Yup.object({
            idDia: Yup.string().required('Este campo es obligatorio'),
            idHorario: Yup.string().required('Este campo es obligatorio')
        }),
        onSubmit: (values) => {

            let nuevoHorario = {
                idEmpleado: operador.idEmpleado,
                idHorario: values.idHorario
            }

            console.log('posting...', nuevoHorario);


            postHorario(nuevoHorario);
        }
    });

    const postHorario = async (horario) => {

        const response = await API.post("EmpleadoHorarios", horario);

        if (response.status == 200 || response.status == 204) {


            console.log('tandas', tandas)
            const nuevoHorario = tandas.find(x => x.idHorario == horario.idHorario);
            
         

            setOperadorHorarios([...operadorHorarios, {...nuevoHorario, descripcion: nuevoHorario.descrDia}])

            console.log(operadorHorarios)
            formik.resetForm();
            handleClose();
        } else {

        }

    }

    return (<Modal show={show} onHide={handleClose}>
        <Form onSubmit={formik.handleSubmit}>
            <Modal.Header closeButton>
                <Modal.Title>Agregar Nuevo Horario</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="row">

                    <div className="col col-sm-6">
                        <Form.Group controlId="idDia">
                            <Form.Label>Dia:</Form.Label>
                            <Form.Control as="select"
                                value={formik.values.idDia}
                                onChange={onChangeDia}
                                onBlur={formik.handleBlur}>
                                <option>Selecione el tipo de Dia</option>
                                {diasOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </Form.Control>
                            <Form.Text className="text-danger">
                                {formik.touched.idDia && formik.errors.idDia ? (<div className="text-danger">{formik.errors.idDia}</div>) : null}
                            </Form.Text>
                        </Form.Group>
                    </div>
                    <div className="col col-sm-6">
                        <Form.Group controlId="idHorario">
                            <Form.Label>Horario:</Form.Label>
                            <Form.Control as="select"
                                value={formik.values.idHorario}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}>
                                <option>Selecione el Horario</option>
                                {tandasOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </Form.Control>
                            <Form.Text className="text-danger">
                                {formik.touched.idHorario && formik.errors.idHorario ? (<div className="text-danger">{formik.errors.idHorario}</div>) : null}
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
    </Modal>)
}