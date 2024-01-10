import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Button } from "react-bootstrap";
import { Card } from "react-bootstrap";
import Form from 'react-bootstrap/Form';
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import React from 'react';
import logo from '../../assets/logofa.png';
import { Container } from 'react-bootstrap';
import { rutaServidor } from "../../routes/rutaServidor";
import API from '../../store/api';
import { accionExitosa, accionFallida } from '../../shared/Utils/modals';
import { Menubar } from 'primereact/menubar';
import { useLocation } from 'react-router-dom';


export const ValidarCodigo = () => {
    
    const [response, setResponse] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate(); //
    const location = useLocation();
    const dispatch = useDispatch();


    const initialValues = {
        correoEmpleado: "",
        codigoVerficacion: "",
    };

    const validationSchema = Yup.object({
        codigoVerficacion: Yup.string().required("El código es requerido"), 
    });

    const formik = useFormik({
        initialValues,
        validationSchema,

        onSubmit: (values) => {
           const correo = location.state.datos.email;
           
           let validarCodigo = {
            correoEmpleado: correo,
            codigoVerficacion: values.codigoVerficacion
            };
            postCodigo(validarCodigo);
          }
        });
        
      
        const postCodigo = async (datos) => {
            try{
                const pagPrev = localStorage.getItem("pag")
                let response;
                response = await API.post("UserAccount/ValidarCodigo", datos);

                if (response.status == 200 || response.status == 204) {
                    setResponse(response.data);
                    accionExitosa({ titulo: 'Código Validado', mensaje: JSON.stringify(response.data), buttonText: 'Siguiente'
                    }).then((result)=> {
                        if(result.isConfirmed){
                            if(pagPrev =="RecuperarClave"){
                            navigate(rutaServidor + '/auth/NuevaClaveScreen', { state: {datos} }) 
                            }else{
                            navigate(rutaServidor + '/auth/CreateUserScreen', { state: {datos} })
                            }
                        }
                    });
                    //

                } else {
                    accionFallida({ titulo: 'El Código no pudo ser Validado', mensaje: 'Ha ocurrido un error inesperado' }); 
                }

            }catch(error){
                setError(error.response.data); 
                accionFallida({ titulo: 'El Código no pudo ser Validado', mensaje: JSON.stringify(error.response.data) });
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
                    <Card.Title className={`text-black text-center mt-4 `}>Validar Código</Card.Title>
                    {/* <Card.Subtitle className="text-center mt-2 text-muted"> Coloque el correo para verificar su cuenta</Card.Subtitle> */}
                        <div className="p-3">
                            <div className="mt-1 text-start" style={{ color: 'black' }}>

                                <Form onSubmit={formik.handleSubmit}>

                                    <Form.Group className="mb-3">
                                        <Form.Label>Código Verificación</Form.Label>
                                        <Form.Control
                                            name="codigoVerficacion"
                                            type="text"
                                            placeholder="Ingrese el Codigo enviado"
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            maxLength={6}
                                            value={formik.values.codigoVerficacion}
                                        />
                                        {formik.touched.codigoVerficacion && formik.errors.codigoVerficacion ? (
                                            <div className="text-danger">{formik.errors.codigoVerficacion}</div>
                                        ) : null}

                                    </Form.Group>
                                    <div className="mt-2 d-flex justify-content-center">
                                        <Button
                                            type="submit"
                                            style={{ background: "#2596be", borderColor: "#2596be" }}>
                                                Validar Código
                                        </Button>
                                    </div>
                                    
                                </Form>

                               {/*  <Card.Subtitle className="text-center mt-4 text-muted"> ¿Ya tiene una cuenta?
                                    <Card.Link style={{color:"#2596be"}} onClick={() => navigate( rutaServidor + '/auth/login' )}>Login</Card.Link>
                                </Card.Subtitle> */}


                            </div>
                        </div>
                    </Card.Body>
                </Card>
            </div>
        </div>
    </>);
}