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
import logo from '../../assets/logofa.png';
import { Container } from 'react-bootstrap';
import { rutaServidor } from "../../routes/rutaServidor";
import API from '../../store/api';
import { accionExitosa, accionFallida } from '../../shared/Utils/modals';
import { Menubar } from 'primereact/menubar';
import { CustomCard } from '../../shared/card-custom'; 


export const AutoRegistro = () => {
    
    const [response, setResponse] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate(); //
    const dispatch = useDispatch();

    const initialValues = {
        email: "",
        confirmarEmail: "",
    };

    const validationSchema = Yup.object({
        email: Yup.string().required("El email es requerido"),
        confirmarEmail: Yup.string().required("El email es requerido"),
    });

    const formik = useFormik({
        initialValues,
        validationSchema,

        onSubmit: (values) => {
           let nuevoRegistro = {
            email: values.email,
            confirmarEmail: values.confirmarEmail
            };
            postRegistro(nuevoRegistro);
          }
        });
        
      
        const postRegistro = async (datos) => {
            try{
                
                let response;
                response = await API.post("UserAccount/RegistrarUsuario", datos);

                if (response.status == 200 || response.status == 204) {
                    setResponse(response.data);
                    accionExitosa({ titulo: 'Codigo Enviado', mensaje: JSON.stringify(response.data)
                    }).then((result)=> {
                        if(result.isConfirmed){
                            localStorage.setItem("pag", "AutoRegistro")
                            navigate(rutaServidor + '/auth/ValidarCodigoScreen', { state: {datos} })
                        }
                    });
                    //

                } else {
                    accionFallida({ titulo: 'El usuario no pudo ser Validado', mensaje: 'Ha ocurrido un error inesperado' }); 
                }

            }catch(error){
                setError(error.response.data); 
                accionFallida({ titulo: 'El usuario no pudo ser Validado', mensaje: JSON.stringify(error.response.data) });
            }
            
        }
      
    //---------------------------------------------------------------------------------

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
                <Card style={{ "borderColor": "#2596be" }} className={`text-white text-center`}>
             
                    <Card.Body >
                    <Card.Title className={`text-black text-center mt-4 `}>Registrarse</Card.Title>
                    {/* <Card.Subtitle className="text-center mt-2 text-muted"> Coloque el correo para verificar su cuenta</Card.Subtitle> */}
                        <div className="p-3">
                            <div className="mt-1 text-start" style={{ color: 'black' }}>

                                <Form onSubmit={formik.handleSubmit}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Email</Form.Label>
                                        <Form.Control
                                            name="email"
                                            type="email"
                                            placeholder="Introduzca su Email"
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            value={formik.values.email}
                                        />
                                        {formik.touched.email && formik.errors.email ? (
                                            <div className="text-danger">{formik.errors.email}</div>
                                        ) : null}
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Confirmar Email</Form.Label>

                                        <Form.Control
                                            name="confirmarEmail"
                                            type="email"
                                            placeholder="Repita el Email"
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            value={formik.values.confirmarEmail}
                                        />
                                        {formik.touched.confirmarEmail && formik.errors.confirmarEmail ? (
                                            <div className="text-danger">{formik.errors.confirmarEmail}</div>
                                        ) : null}
                                    </Form.Group>
                                    <div className="mt-2 d-flex justify-content-center">
                                        <Button
                                            type="submit"
                                            style={{ background: "#2596be", borderColor: "#2596be" }}>
                                                Continuar
                                        </Button>

                                    </div>
                                </Form>

                                <Card.Subtitle className="text-center mt-4 text-muted"> ¿Ya tiene una cuenta?
                                    <Card.Link style={{color:"#2596be"}} onClick={() => navigate( rutaServidor + '/auth/login' )}>Login</Card.Link>
                                </Card.Subtitle>



                            </div>
                        </div>
                    </Card.Body>
                </Card>
            </div>
        </div>
    </>);
}