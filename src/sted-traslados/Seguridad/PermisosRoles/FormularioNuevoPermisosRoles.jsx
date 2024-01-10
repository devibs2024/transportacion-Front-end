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

export const FormularioPermisosRoles = ({ permisosRoll}) => {


    const [formState, setFormState] = useState(true);
    const [permisosRol, setPermisosRol] = useState('');

    const [permisos, setPermisos] = useState([]);
    const [selectedPermisos, setSelectedPermisos] = useState(null);


    //para enviar datos entre pantallas:
    const location = useLocation();
    const navigate = useNavigate();


    //Trae datos de permisosRol
    useEffect(() => {
        getPermisosRoles()
        if (location.state?.permisosRol) {
            formik.setValues(location.state.permisosRol)
            setPermisosRol(location.state.permisosRol)

        } else if (permisosRoll.roleName != null) {
            formik.setValues(permisosRoll)
        }
    }, [])



    //Obtener Permisos
    const getPermisosRoles = async () => {
        const response = await API.get(`Permisos/GetAllPermissions`);
        if (response.status === 200 || response.status === 204) {
          const permisosList = response.data.map(permiso => ({label: permiso, value: permiso}));
          setPermisos(permisosList);
        }
      }

      //Guarda los permisos aún no asignados
      const permisosNoAsignados = permisos.filter((permiso) => !location.state.permisosRol.permissions.includes(permiso.value));

      


      //Obtener y Validar Campos
    const getInitialValues = () => {
        return {
            roleName: '',
            permissions: ''
        }
    }

    const formik = useFormik({
        initialValues: getInitialValues(),
        validationSchema: Yup.object({
            roleName: Yup.string().required('Este campo es obligatorio')
        }),
        
        onSubmit: values => {
            let nuevoPermisoRol = {
                permissions: selectedPermisos,
                roleName: values.roleName
            };
            postPermisoRol(nuevoPermisoRol);
        }
    });


    //Guardar Permisos
    const postPermisoRol = async (perm) => {
        let response;
    
        try {
            for (let i = 0; i < perm.permissions.length; i++) {
                response = await API.post(`Permisos/AddPermissionToRole?roleName=${perm.roleName}&permission=${perm.permissions[i]}`);
            }
            if (response.status === 200 || response.status === 204) {
                accionExitosa({ titulo: 'Permisos Agregados', mensaje: ' ¡Los Permisos han sido agregados satisfactoriamente!' });
            }
        } catch {
            accionFallida({titulo:'Permisos no pudieron ser agregados', mensaje: 'Ha ocurrido un error'})
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




    //Formmulario
    return (<Form onSubmit={formik.handleSubmit}>
        <div className='mt-3'>
            <div className='row'>

                <CampoFormulario
                controlId="roleName"
                onBlur={formik.handleBlur}
                value={formik.values.roleName}
                label="Nombre Rol"
                placeholder="Introduzca el Rol"
                name="roleName" 
                />

                <div className="justify-content-center">
                    <MultiSelect
                        onBlur={formik.handleBlur}
                        value={selectedPermisos} 
                        options={permisosNoAsignados} 
                        onChange={(e) => setSelectedPermisos(e.value)} 
                        optionLabel="label" 
                        placeholder="Selecciona Nuevos Permisos" 
                        panelFooterTemplate={panelFooterTemplate} 
                        className="w-full md:w-20rem" 
                        display="chip" />
                </div>
                
            </div>

            <div className='mt-5 d-flex justify-content-end'>
                <Button variant="custom" type="submit" className='me-2' onClick={values => setFormState(values)}>Guardar <i className="fa-solid fa-plus"></i></Button>
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




