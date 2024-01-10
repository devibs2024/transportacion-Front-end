import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useEffect, useState } from "react";
import { Button, Card, Table, Modal, Form } from "react-bootstrap";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import API from "../../../../store/api";
import { accionExitosa, accionFallida } from '../../../../shared/Utils/modals';
import { procesarErrores } from '../../../../shared/Utils/procesarErrores';

export const ModalCrearCuentaBancaria = ({ operador, setShow, show, getCuentasBancarias, cuentaBancaria }) => {


    console.log('Data:',  cuentaBancaria)


    const MySwal = withReactContent(Swal)

    const handleClose = () => setShow(false);

    const [formState, setFormState] = useState(true);
    const [selectedValue, setSelectedValue] = useState('');

    useEffect(() => {
        getBancos();

        formik.setValues({
            idCuenta: cuentaBancaria.idCuenta,
            cuentaBancaria: cuentaBancaria.cuentaBancaria,
            idBanco: cuentaBancaria.idBanco ,
            cuentaPrincipal: cuentaBancaria.cuentaPrincipal
        }) 
    }, [cuentaBancaria])

    const formik = useFormik({

        initialValues:     {
            cuentaBancaria: '',
            idBanco: '',
            cuentaPrincipal: false
        },
        validationSchema: Yup.object({
            cuentaBancaria: Yup.string()
                .matches(/^[0-9]+$/, 'La Clave Interbancaria solo debe contener números')
                .required('La Clave Interbancaria es obligatoria').length(18, "La Clave Interbancaria debe contener 18 dígitos"),

        }),
        onSubmit: values => {

            const nuevaCuentaBancaria = {
                idCuenta: cuentaBancaria.idCuenta,
                idEmpleado: operador.idEmpleado,
                cuentaBancaria: values.cuentaBancaria,
                idBanco: values.idBanco,
                cuentaPrincipal: values.cuentaPrincipal
            }

        
            if(cuentaBancaria.idCuenta !=0){              
                putCuentaBancaria(nuevaCuentaBancaria)
            }else {
                postCuentaBancaria(nuevaCuentaBancaria);
            }
        }

    });

    const putCuentaBancaria = async (cuenta) => {


      
        try {
            const response = await API.put(`EmpleadoCuentaBancarias/${cuenta.idCuenta}`, cuenta);

            if (response.status == 200 || response.status == 204) {


                await getCuentasBancarias();

                accionExitosa({ titulo: 'Cuenta Actualizada', mensaje: '¡La cuenta ha sido actualizada satisfactoriamente!' });
                formik.resetForm();
                setShow(false);
                //  getCuentasBancarias();
            } else {

                console.log('data', response)

                accionFallida({ titulo: 'Cuenta no pudo ser Actualizada', mensaje: '¡Ha ocurrido un error al intentar actualizar la cuenta!' }).then(() => {
                    handleClose();
                });
            }

            console.log('response', response)

        } catch (e) {

            let errores = e.response.data;

            accionFallida({ titulo: 'Cuenta no pudo ser Agregada', mensaje: procesarErrores(errores) }).then(() => {
                //    handleClose();
            });
        }


    }



    const postCuentaBancaria = async (cuenta) => {

        try {
            const response = await API.post("EmpleadoCuentaBancarias", cuenta);

            if (response.status == 200 || response.status == 204) {


                await getCuentasBancarias();

                accionExitosa({ titulo: 'Cuenta Agregada', mensaje: '¡La cuenta ha sido agregada satisfactoriamente!' });
                formik.resetForm();
                setShow(false);
                //  getCuentasBancarias();
            } else {

                console.log('data', response)

                accionFallida({ titulo: 'Cuenta no pudo ser Agregada', mensaje: '¡Ha ocurrido un error al intentar agregar la cuenta!' }).then(() => {
                    handleClose();
                });
            }

            console.log('response', response)

        } catch (e) {

            let errores = e.response.data;

            accionFallida({ titulo: 'Cuenta no pudo ser Agregada', mensaje: procesarErrores(errores) }).then(() => {
                //    handleClose();
            });
        }


    }


    const [bancos, setBancos] = useState([]);

    const getBancos = async () => {


        const response = await API.get(`Banco`);

        if (response.status == 200 || response.status == 204) {

            console.log('data', response.data)
            setBancos(response.data)
        }

    }

    const bancosOptions = bancos.filter(x => x.activo == true).map((banco) => ({
        value: banco.idBanco,
        label: banco.nombreBanco
    }))


    return (<Modal show={show} onHide={handleClose}>
        <Form onSubmit={formik.handleSubmit}>
            <Modal.Header closeButton>
                <Modal.Title>Agregar Nueva Clave Interbancaria</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form.Group controlId="cuentaBancaria">
                    <Form.Label> Clave Interbancaria</Form.Label>
                    <Form.Control
                        type="text"
                        name="cuentaBancaria"
                        placeholder="Introduzca la cuenta"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.cuentaBancaria}
                    />
                    <Form.Text className="text-danger">
                        {formik.touched.cuentaBancaria && formik.errors.cuentaBancaria ? (<div className="text-danger">{formik.errors.cuentaBancaria}</div>) : null}
                    </Form.Text>
                </Form.Group>

                <Form.Group controlId="idBanco">
                    <Form.Label>Banco:</Form.Label>
                    <Form.Control as="select"
                        value={formik.values.idBanco}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}>
                        <option value="">Seleccione un banco:</option>
                        {bancosOptions.map((option) => (
                            <option key={option.value} value={option.value} >
                                {option.label}
                            </option>
                        ))
                        }
                    </Form.Control>
                    <Form.Text className="text-danger">
                        {formik.touched.idBanco && formik.errors.idBanco ? (<div className="text-danger">{formik.errors.idBanco}</div>) : null}
                    </Form.Text>
                </Form.Group>

                <Form.Check
                    controlId="cuentaPrincipal"
                    type="checkbox"
                    label="Cuenta Principal"
                    checked={formik.values.cuentaPrincipal}
                    onChange={() => { formik.setFieldValue('cuentaPrincipal', !formik.values.cuentaPrincipal) }}
                    className='mt-3'
                />
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