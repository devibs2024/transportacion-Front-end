
import React from 'react';
import { Menubar } from 'primereact/menubar';
import logo from '../../assets/logofa.png';
import { Container } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import { Button } from 'primereact/button';
import { logout } from '../../store/slices/thunks/authThunks';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { rutaServidor } from '../../routes/rutaServidor';
export const AppLayout = ({ children }) => {

    const navigate = useNavigate();

    const dispatch = useDispatch()

    const salir = () => {

        dispatch(logout())

        navigate(rutaServidor + '/auth/login')
    }

    const items = [
        {
            label: 'Catálogos',
            items: [
                {
                    label: 'Operadores',
                    command: () => navigate(rutaServidor + '/operador/Operadores'),
                    element: <Link to="/operador/Operadores">Operadores</Link>
                },
                {
                    label: 'Coordinadores',
                    command: () => navigate(rutaServidor + '/coordinador/CatalogoCoordinadores'),
                    element: <Link to="/coordinador/CatalogoCoordinadores">Coordinadores</Link>
                },
                {
                    label: 'SubDirectores',
                    command: () => navigate(rutaServidor + '/subDirector/CatalogoSubDirectores'),
                    element: <Link to="/subDirector/CatalogoSubDirectores">SubDirectores</Link>
                },
                {
                    label: 'Directores',
                    command: () => navigate(rutaServidor + '/director/CatalogoDirectores'),
                    element: <Link to="/director/CatalogoDirectores">Directores</Link>
                },
                // {
                //     label: 'Zonas',
                //     command: () => navigate(rutaServidor + '/zona/CatalogoZona'),
                //     element: <Link to="/zona/CatalogoZona">Zonas</Link>
                // },
                {
                    label: 'Municipios',
                    command: () => navigate(rutaServidor + '/municipio/CatalogoMunicipio'),
                    element: <Link to="/municipio/CatalogoMunicipio">Zonas</Link>
                },
                {
                    label: 'Estados',
                    command: () => navigate(rutaServidor + '/estado/CatalogoEstado'),
                    element: <Link to="/estado/CatalogoEstado">Zonas</Link>
                },
                // {
                //     label: 'Sucursales',
                //     command: () => navigate(rutaServidor + '/sucursales/CatalogoSucursales'),
                //     element: <Link to="/sucursales/CatalogoSucursales">Sucursales</Link>
                // },
                {
                    label: 'Clientes',
                    command: () => navigate(rutaServidor + '/cliente/CatalogoCliente'),
                    element: <Link to="/cliente/CatalogoCliente">Clientes</Link>
                }, {
                    label: 'Tipo Vehiculos',
                    command: () => navigate(rutaServidor + '/tipovehiculo/TipoVehiculos'),
                    element: <Link to="/tipovehiculo/TipoVehiculos">Vehiculos</Link>
                },
                {
                    label: 'Vehiculos',
                    command: () => navigate(rutaServidor + '/vehiculos/CatalogoVehiculos'),
                    element: <Link to="/vehiculos/CatalogoVehiculos">Vehiculos</Link>
                },


            ]
        },
        {
            label: 'Procesos',
            items: [
                {
                    label: 'Registro de Asistencia',
                    command: () => navigate(rutaServidor + '/CheckInOut'),
                    element: <Link to="/CheckInOut">CheckIn/CkechOut</Link>
                },
                {
                    label: 'Planificaciones',
                    command: () => navigate(rutaServidor + '/planificacion/planificaciones'),
                    element: <Link to="/planificacion/planificaciones">Vehiculos</Link>
                },

            ]
        },
        // {
        //     label: 'Reportes',
        //     items: [
        //         {
        //             label: 'Operadores',
        //             command: () => navigate(rutaServidor + '/operador/Operadores'),
        //             element: <Link to={rutaServidor + "/operador/Operadores"}>Operadores</Link>
        //         },
        //         {
        //             label: 'Coordinadores',
        //             command: () => navigate(rutaServidor + '/coordinador/CatalogoCoordinadores'),
        //             element: <Link to={rutaServidor + "/coordinador/CatalogoCoordinadores"}>Coordinadores</Link>
        //         },
        //         {
        //             label: 'Zonas',
        //             command: () => navigate(rutaServidor + '/zona/CatalogoZona'),
        //             element: <Link to={rutaServidor + "/zona/CatalogoZona"}>Zonas</Link>
        //         },
        //         {
        //             label: 'Sucursales',
        //             command: () => navigate(rutaServidor + '/sucursales/CatalogoSucursales'),
        //             element: <Link to={rutaServidor + "/sucursales/CatalogoSucursales"}>Sucursales</Link>
        //         },
        //         {
        //             label: 'Clientes',
        //             command: () => navigate(rutaServidor + '/cliente/CatalogoCliente'),
        //             element: <Link to={rutaServidor + "/cliente/CatalogoCliente"}>Clientes</Link>
        //         },
        //         {
        //             label: 'Vehiculos',
        //             command: () => navigate(rutaServidor + '/vehiculos/CatalogoVehiculos'),
        //             element: <Link to={rutaServidor + "/vehiculos/CatalogoVehiculos"}>Vehiculos</Link>
        //         }
        //     ]
        // },
      
      , {
            label: 'Productividad',
           
            items: [
                {
                    label: "Productividad",
                    command: () => navigate(rutaServidor + '/productividad'),
                    element: <Link to={rutaServidor + "/productividad"}>Productividad</Link>,
                },
                {
                    label: 'Nomina',
                    command: () => navigate(rutaServidor + '/nomina'),
                    element: <Link to={rutaServidor + "/nomina"}>Nomina</Link>
                }
            ]
        },
        {
            label: 'Seguridad',
            items: [
                {
                    label: 'Asignar Permisos',
                    command: () => navigate(rutaServidor + '/seguridad/PermisosRoles'),
                    element: <Link to={rutaServidor + "/seguridad/PermisosRoles"}>Operadores</Link>
                },
                {
                    label: 'Asignar Roles',
                    command: () => navigate(rutaServidor + '/seguridad/RolesUsuarios'),
                    element: <Link to={rutaServidor + "/seguridad/RolesUsuarios"}>Coordinadores</Link>
                }
            ]
        },
        {
            label: 'Reportes',
            items: [
                {
                    label: 'Reporte de Gasolina',
                    command: () => navigate(rutaServidor + '/Reportes/ReporteGasolina'),
                    element: <Link to={rutaServidor + '/Reportes/ReporteGasolina'}></Link>
                },
                {
                    label: 'Reporte de Vehiculos Extra Utilizados',
                    command: () => navigate(rutaServidor + '/Reportes/ReporteVehiculosExtra'),
                    element: <Link to={rutaServidor + '/Reportes/ReporteVehiculosExtra'}></Link>
                }
            ]
        },

    ];

    const start = (
        <div>
            <img
                onClick={() => navigate(rutaServidor + "/inicio")}
                src={logo}
                style={{ 'marginLeft': '280px', 'marginRight': '20px' }}
                width="200"
                alt="React Bootstrap logo"
            />
        </div>

    );
    const end = (
        <Button
            onClick={salir}
            label="Cerrar Sesión"
            icon="pi pi-fw pi-sign-out"
            style={{ color: 'white' }}
            className="p-button-text "
        />
    );



    return (
        <>
            <Menubar style={{ backgroundColor: '#050A30' }} model={items} start={start} end={end} />
            <div className='container'>
                {children}
            </div>
        </>
    );
}