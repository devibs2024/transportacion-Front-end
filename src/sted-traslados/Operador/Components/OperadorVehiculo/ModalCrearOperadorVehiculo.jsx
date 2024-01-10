import { useEffect, useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import API from "../../../../store/api";
import { useGetTipoVehiculos } from "../../../../hooks/useGetTipoVehiculos";
import { procesarErrores } from "../../../../shared/Utils/procesarErrores";
import { accionFallida } from "../../../../shared/Utils/modals";
import InputMask from 'react-input-mask';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { forwardRef } from 'react';


export const ModalCrearOperadorVehiculo = ({ operador, getOperadorVehiculos, show, setShow }) => {


    

    const handleClose = () => setShow(false);

    const [formState, setFormState] = useState(true);

    const [marcaVehiculosOptions, setMarcaVehiculosOptions] = useState([]);
    const [modeloVehiculosOptions, setModeloVehiculosOptions] = useState([]);
    const [tarifas, setTarifas] = useState([]);
    const [tarifasOptions, setTarifasOptions] = useState([])

    const tipoVehiculosOptions = useGetTipoVehiculos().map(s => ({
        value: s.idTipoVehiculo,
        label: s.tipoVehiculo
    }));

    const getTarifas = async () => {

        const response = await API.get(`TarifaTipoVehiculo`);

        if (response.status == 200 || response.status == 204) {
            setTarifas(response.data)
        }
    }

    useEffect(() => {
        getTarifas();
    }, []);

    const getMarcaByIdTipoVehiculo = async (idTipoVehiculo) => {

        const response = await API.get(`MarcaVehiculo/${idTipoVehiculo}`);

        if (response.status == 200 || response.status == 204) {

            let data = response.data.map((data) => ({
                value: data.idMarca,
                label: data.marca
            }));

            setMarcaVehiculosOptions(data)
        }
    }

    const getModeloByIdMarca = async (idMarca) => {

        const response = await API.get(`ModeloVehiculo/IdMarca?IdMarca=${idMarca}`);

        if (response.status == 200 || response.status == 204) {

            let data = response.data.map((data) => ({
                value: data.idModelo,
                label: data.modelo
            }));
            setModeloVehiculosOptions(data)
        }
    }

    const onChangeTipoVehiculo = (event) => {

        formik.handleChange(event);

        const idTipoVehiculo = document.getElementById('idTipoVehiculo').value;

        const filteredTarifas = tarifas.filter(x => x.idTipoVehiculo == idTipoVehiculo)
            .map(s => ({
                value: s.idTipoVehiculo,
                label: s.tarifa
            }));


            console.log(filteredTarifas)
        setTarifasOptions(filteredTarifas);

        getMarcaByIdTipoVehiculo(idTipoVehiculo);

    }

    const onChangeMarca = (event) => {

        formik.handleChange(event);

        const idMarcaVehiculo = document.getElementById('idMarcaVehiculo').value;

        getModeloByIdMarca(idMarcaVehiculo);
    }

    const formik = useFormik({

        initialValues: {
            idTipoVehiculo: '',
            idMarcaVehiculo: '',
            idModeloVehiculo: '',
            emisionVehiculo: '',
            nombreVehiculo: '',
            tarifa: ''
        },
        validationSchema: Yup.object({
            idTipoVehiculo: Yup.string().required('Este campo es obligatorio'),
            idMarcaVehiculo: Yup.string().required('Este campo es obligatorio'),
            idModeloVehiculo: Yup.string().required('Este campo es obligatorio'),
            emisionVehiculo: Yup.number()
                .typeError("Debe ser un número")
                .required("Este campo es obligatorio")
                .min(1900, "Año inválido")
                .max(new Date().getFullYear(), "Año inválido"),
            nombreVehiculo: Yup.string().required('Este campo es obligatorio').matches(
                /^[A-Za-z]{3}-\d{3}$/,
                'La placa debe tener el formato ABC-123'
            ),
            tarifa: Yup.number()
                .typeError("Debe ser un número")
                .required("Este campo es obligatorio")
                .positive("Debe ser un número positivo")
                .min(0.01, "La tarifa debe ser mayor a 0")
        }),

        onSubmit: (values) => {

            let nuevoVehiculo = {
                idEmpleado: operador.idEmpleado,
                idTipoVehiculo: values.idTipoVehiculo,
                nombreVehiculo: values.nombreVehiculo,
                idMarcaVehiculo: values.idMarcaVehiculo,
                tarifa: values.tarifa,
                vehihiculoPropio: true,
                vehiculoEmpresa: false,
                emisionVehiculo: values.emisionVehiculo,
                idModeloVehiculo: values.idModeloVehiculo
            }

            console.log('posting...', nuevoVehiculo);


            postVehiculo(nuevoVehiculo);
        }
    });

    const postVehiculo = async (vehiculo) => {

        try {
            const response = await API.post("OperadorVehiculo", vehiculo);

            if (response.status == 200 || response.status == 204) {

                getOperadorVehiculos();
                formik.resetForm();
                handleClose();
            }
        } catch (e) {
    
            accionFallida({ titulo: 'Ha ocurrido un error', mensaje: procesarErrores(e.response.data) });

        }
    }

    return (<Modal show={show} onHide={handleClose}>
        <Form onSubmit={formik.handleSubmit}>
            <Modal.Header closeButton>
                <Modal.Title>Agregar Nuevo Vehiculo</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="row">
                    <div className="col col-sm-6">
                        <Form.Group controlId="idTipoVehiculo">
                            <Form.Label>Tipo</Form.Label>
                            <Form.Control as="select"
                                value={formik.values.idTipoVehiculo}
                                onChange={onChangeTipoVehiculo}
                                onBlur={formik.handleBlur}>
                                <option>Selecione el tipo de Vehiculo</option>
                                {tipoVehiculosOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </Form.Control>
                            <Form.Text className="text-danger">
                                {formik.touched.idTipoVehiculo && formik.errors.idTipoVehiculo ? (<div className="text-danger">{formik.errors.idTipoVehiculo}</div>) : null}
                            </Form.Text>
                        </Form.Group>
                    </div>
                    <div className="col col-sm-6">
                        <Form.Group controlId="idMarcaVehiculo">
                            <Form.Label>Marca</Form.Label>
                            <Form.Control as="select"
                                value={formik.values.idMarcaVehiculo}
                                onChange={onChangeMarca}
                                onBlur={formik.handleBlur}>
                                <option>Selecione la marca</option>
                                {marcaVehiculosOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </Form.Control>
                            <Form.Text className="text-danger">
                                {formik.touched.idMarcaVehiculo && formik.errors.idMarcaVehiculo ? (<div className="text-danger">{formik.errors.idMarcaVehiculo}</div>) : null}
                            </Form.Text>
                        </Form.Group>
                    </div>
                </div>
                <div className="row">
                    <div className="col col-sm-6">
                        <Form.Group controlId="idModeloVehiculo">
                            <Form.Label>Modelo</Form.Label>
                            <Form.Control as="select"
                                value={formik.values.idModeloVehiculo}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}>
                                <option>Selecione el modelo</option>
                                {modeloVehiculosOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </Form.Control>
                            <Form.Text className="text-danger">
                                {formik.touched.idModeloVehiculo && formik.errors.idModeloVehiculo ? (<div className="text-danger">{formik.errors.idModeloVehiculo}</div>) : null}
                            </Form.Text>
                        </Form.Group>
                    </div>
                    <div className="col col-sm-6">
                        <Form.Group controlId="nombreVehiculo">
                            <Form.Label>Número de placa</Form.Label>
                            <InputMask
                                mask="aaa-999"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.nombreVehiculo}
                            >
                                {() => <Form.Control type="text" name="nombreVehiculo" />}
                            </InputMask>
                            <Form.Text className="text-danger">
                                {formik.touched.nombreVehiculo && formik.errors.nombreVehiculo ? (<div className="text-danger">{formik.errors.nombreVehiculo}</div>) : null}
                            </Form.Text>
                        </Form.Group>
                    </div>
                </div>
                <div className="row">
                    <div className="col col-sm-6">
                        <Form.Group controlId="tarifa">
                            <Form.Label>Tarifa</Form.Label>
                            <Form.Control as="select"
                                value={formik.values.tarifa}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}>
                                <option>Selecione la Tarifa</option>
                                {tarifasOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </Form.Control>
                            <Form.Text className="text-danger">
                                {formik.touched.tarifa && formik.errors.tarifa ? (<div className="text-danger">{formik.errors.tarifa}</div>) : null}
                            </Form.Text>
                        </Form.Group>
                    </div>

                    <div className="col col-sm-6">

                        <Form.Group controlId="emisionVehiculo">
                            <Form.Label>Año de Emisión:</Form.Label>
                            <DatePicker
                                id="emisionVehiculo"
                                name="emisionVehiculo"
                                selected={formik.values.emisionVehiculo ? new Date(formik.values.emisionVehiculo, 0) : null}
                                onChange={(date) => formik.setFieldValue('emisionVehiculo', date?.getFullYear())}
                                onBlur={formik.handleBlur}
                                dateFormat="yyyy"
                                showYearPicker
                                className="form-control"
                                // customInput={<CustomInput />}
                            />
                            {formik.touched.emisionVehiculo && formik.errors.emisionVehiculo ? (
                                <Form.Text className="text-danger">{formik.errors.emisionVehiculo}</Form.Text>
                            ) : null}
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