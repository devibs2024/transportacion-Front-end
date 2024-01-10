import { useFormik } from 'formik';
import * as Yup from 'yup';
import React, { useEffect, useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import API from '../../../store/api';
import { useNavigate } from 'react-router';
import { accionExitosa, accionFallida } from '../../../shared/Utils/modals';
import { useLocation } from 'react-router-dom';
import { rutaServidor } from '../../../routes/rutaServidor';
import { MultiSelect } from 'primereact/multiselect';
import { procesarErrores } from '../../../shared/Utils/procesarErrores';

export const FormularioRolesUsuarios = ({ setRol, rol }) => {


    const [idTipoVehiculo, setIdTipoVehiculo] = useState(0);
    const [formState, setFormState] = useState(true);
    const [selectedValue, setSelectedValue] = useState('');
    const [RRoles, setRRoles] = useState('');
    const [permisos, setPermisos] = useState([]);
    const [selectedPermisos, setSelectedPermisos] = useState(null);

    //para enviar datos entre pantallas:
    const location = useLocation();
    const navigate = useNavigate();



    useEffect(() => {
        getUserRoles()
        if (location.state?.userRol) {
            formik.setValues(location.state.userRol)
            setRol(location.state.userRol)

        } else if (rol.id != null) {
            formik.setValues(rol)
        }
    }, [])



    //Obtener Permisos
    const getUserRoles = async () => {
        const response = await API.get(`Permisos/GetAllRoles`);
        if (response.status === 200 || response.status === 204) {
          const permisosList = response.data.map(permiso => ({label: permiso.name, value: permiso.name}));
          setPermisos(permisosList);
        }
      }

      //Guarda los roles aún no asignados
      const rolesNoAsignados = permisos.filter((permiso) => !location.state.userRol.userRoles.includes(permiso.value));

      



    const getInitialValues = () => {
        return {
            id: '',
            email: '',
            userRoles: ''
        }
    }



    const formik = useFormik({
        initialValues: getInitialValues(),
        validationSchema: Yup.object({
            //permissions: Yup.string().required('Este campo es obligatorio'),
            //userRoles: Yup.string().required('Este campo es obligatorio')
        }),
        
        onSubmit: values => {
            let nuevoUserRol = {
                userId: rol.id,
                roleName: selectedPermisos
            };
            postUserRol(nuevoUserRol);
        }
    });


    const postUserRol = async (userR) => {
        let response;
       
       try{
        for (let i = 0; i < userR.roleName.length; i++) {
          response = await API.post(`Permisos/AssignRoleToUser?userId=${userR.userId}&roleName=${userR.roleName[i]}`);
        }
          if (response.status === 200 || response.status === 204) {
            accionExitosa({ titulo: 'Roles Agregados', mensaje: ' Los Roles han sido agregado satisfactoriamente!' });
        }}
        catch{
            accionFallida({titulo:'Roles no pudieron ser agregados', mensaje: 'Ha ocurrido un error'})
        }
    }

    
    //MultiSelect Footer
    const panelFooterTemplate = () => {
        const length = selectedPermisos ? selectedPermisos.length : 0;

        return (
            <div className="py-2 px-3">
                <b>{length}</b> item{length > 1 ? 's' : ''} selected.
            </div>
        );
    };

    


    // Campos
    return (<Form onSubmit={formik.handleSubmit}>
        <div className='mt-3'>
            <div className='row'>

                <CampoFormulario
                controlId="email"
                onBlur={formik.handleBlur}
                value={formik.values.email}
                label="Email User"
                name="email" 
                />

                
            <div className="justify-content-center">
                    <MultiSelect
                        onBlur={formik.handleBlur}
                        value={selectedPermisos} 
                        options={rolesNoAsignados} 
                        onChange={(e) => setSelectedPermisos(e.value)} 
                        optionLabel="label" 
                        placeholder="Selecciona Nuevos Roles" 
                        panelFooterTemplate={panelFooterTemplate} 
                        className="w-full md:w-20rem" 
                        display="chip" />
                </div>
                

                {/* <CampoFormulario
                    controlId="userRoles"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.userRoles}
                    label="userRoles"
                    placeholder="Elija Roles"
                    name="userRoles"
                    />  */}
                    
            </div>

           
            <div className='mt-5 d-flex justify-content-end'>
                <Button variant="custom" type="submit" className='me-2' onClick={values => setFormState(values)}>Guardar <i className="fa-solid fa-plus"></i></Button>
               {/*  <Button variant="outline-secondary" type="button" className='me-2' onClick={() => { limpiarFormulario() }}>Nuevo <i className="fas fa-plus"></i></Button> */}
                <Button variant="outline-secondary" type="button" className='me-2' onClick={() => navigate(rutaServidor + "/seguridad/RolesUsuarios")}>Regresar <i className="fas fa-arrow-left"></i></Button>
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





