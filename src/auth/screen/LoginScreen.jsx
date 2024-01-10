import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Button } from "react-bootstrap";
import { Card } from "react-bootstrap";
import Form from 'react-bootstrap/Form';
import { useDispatch } from "react-redux";
import { login } from "../../store/slices/thunks/authThunks";
import { useNavigate } from "react-router-dom";
import React from 'react';
import { Menubar } from 'primereact/menubar';
import logo from '../../assets/logofa.png';
import { Container } from 'react-bootstrap';
import { rutaServidor } from "../../routes/rutaServidor";


export const PantallaDeLogin = () => {

    const [formState, setFormState] = useState(true);

    const navigate = useNavigate();

    const dispatch = useDispatch();

    const initialValues = {
        usuario: "",
        contrasena: "",
    };

    const validationSchema = Yup.object({
        usuario: Yup.string().required("El usuario es requerido"),
        contrasena: Yup.string().required("La contraseña es requerida"),
    });

    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: (values) => {
            // alert(JSON.stringify(values, null, 2));

            dispatch(login({ email: values.usuario, password: values.contrasena })).unwrap()
                .then((result) => {


                    navigate(rutaServidor + '/inicio')

                })
                .catch(() => { });

            //   setFormState(values);
        },
    });
    const items = [];

    const start = (
        <div>
            <img
                onClick={() => navigate( rutaServidor + "/inicio")}
                src={logo}
                style={{ 'marginLeft': '280px' }}
                width="200"
                alt="React Bootstrap logo"
            />
        </div>

    );

    return (<>
   
            <Menubar style={{ backgroundColor: '#050A30' }} model={items} start={start} />
  
        <div className="d-flex justify-content-center">
            <div className="mt-5 " style={{ width: '500px' }} >
                <Card style={{ "borderColor": "#2596be" }} className={`text-white text-center  `}>

                    <Card.Body >
                    <Card.Title className={`text-black text-center mt-4 `}>Iniciar Sesión</Card.Title>
                        <div className="p-3">
                            <div className="mt-1 text-start" style={{ color: 'black' }}>
                                <Form onSubmit={formik.handleSubmit}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Usuario</Form.Label>
                                        <Form.Control
                                            name="usuario"
                                            type="text"
                                            placeholder="Introduzca el Nombre de Usuario"
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            value={formik.values.usuario}
                                        />
                                        {formik.touched.usuario && formik.errors.usuario ? (
                                            <div className="text-danger">{formik.errors.usuario}</div>
                                        ) : null}
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Contraseña</Form.Label>
                                        <Form.Control
                                            name="contrasena"
                                            type="password"
                                            placeholder="Introduzca la Contraseña"
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            value={formik.values.contrasena}
                                        />
                                        {formik.touched.contrasena && formik.errors.contrasena ? (
                                            <div className="text-danger">{formik.errors.contrasena}</div>
                                        ) : null}
                                    </Form.Group>

                                    <p style={{color:"#2596be"}} onClick={() => navigate( rutaServidor + '/auth/RecuperarClaveScreen' )}>Olvidé mi Contraseña</p>
                                       


                                    <div className="mt-2 d-flex justify-content-center">
                                        <Button
                                            type="submit"
                                            style={{ background: "#2596be", borderColor: "#2596be" }}>
                                                Iniciar Sesión
                                        </Button>
                                    </div>
                                </Form>
                                {/* <Card.Subtitle className="text-center mt-4 text-muted"> ¿Aún no tiene una cuenta?
                                            <Card.Link style={{color:"#2596be"}} onClick={() => navigate( rutaServidor + '/auth/AutoRegistroScreen' )}>Auto Registro</Card.Link>
                                        </Card.Subtitle> */}
                            </div>
                        </div>
                    </Card.Body>
                </Card>
            </div>
        </div>
    </>);
}