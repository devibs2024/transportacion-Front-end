import { useFormik } from 'formik';
import * as Yup from 'yup';
import React, { useEffect, useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import API from '../../../store/api';
import { useNavigate } from 'react-router';
import { accionExitosa, accionFallida } from '../../../shared/Utils/modals';
import { useLocation } from 'react-router-dom';
import { rutaServidor } from '../../../routes/rutaServidor';
import { procesarErrores } from '../../../shared/Utils/procesarErrores';

export const FormularioRol = ({  }) => {


    //para enviar datos entre pantallas:
    const location = useLocation();
    const navigate = useNavigate();

    //Datos
    const [formState, setFormState] = useState(true);
    const [rol, setRol] = useState("");


    const getInitialValues = () => {
        return {
            roleName: ''
        }
    }

    //Limpiar Datos Form
    const limpiarFormulario = () => {
        formik.resetForm();
        setRol({
            roleName: ''
        });
    }


    //Validación de Formulario y Submit values
    const formik = useFormik({
        initialValues: getInitialValues(),
        validationSchema: Yup.object({
            roleName: Yup.string().required('Este campo es obligatorio')
        }),
        
        onSubmit: values => {
            let nuevoRol = {
                roleName: values.roleName
            };
            postRol(nuevoRol);
        }
    });


    //Post Api
    const postRol = async (rol) => {
        let response;
       
       try{
          response = await API.post(`Permisos/CreateRole?roleName=${rol.roleName}`);

          if (response.status == 200 || response.status == 204) {
            accionExitosa({ titulo: 'Rol Agregado', mensaje: ' ¡El Rol ha sido agregado satisfactoriamente!' });
        }}
        catch{
            accionFallida({titulo:'Rol no pudo ser agregado', mensaje: 'Ha ocurrido un error'})
        }
    }

    


    //Formulario
    return (<Form onSubmit={formik.handleSubmit}>
        <div className='mt-3'>
            <div className='row'>

                <CampoFormulario
                controlId="roleName"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.roleName}
                label="Nombre Rol"
                placeholder="Introduzca el Rol"
                name="roleName" 
                />
                
                    
            </div>

            <div className='mt-5 d-flex justify-content-end'>
                <Button variant="custom" type="submit" className='me-2' onClick={values => setFormState(values)}>Guardar <i className="fa-solid fa-plus"></i></Button>
                <Button variant="outline-secondary" type="button" className='me-2' onClick={() => { limpiarFormulario() }}>Nuevo <i className="fas fa-plus"></i></Button>
                <Button variant="outline-secondary" type="button" className='me-2' onClick={() => navigate(rutaServidor + "/seguridad/PermisosRoles")}>Regresar <i className="fas fa-arrow-left"></i></Button>
            </div>

        </div>
    </Form>);
}

const CampoFormulario = (prop) => {

    return (
        <div className='col col-sm-6 mt-1'>
            <Form.Group controlId={prop.controlId}>
                <Form.Label >{prop.label}</Form.Label>
                <Form.Control
                    type="text"
                    onChange={prop.onChange}
                    onBlur={prop.onBlur}
                    value={prop.value}
                />
                <Form.Text className="text-danger">
                    {prop.error}
                </Form.Text>
            </Form.Group>
        </div>
    );
}





