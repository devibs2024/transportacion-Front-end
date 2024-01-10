import { Routes, Route } from "react-router-dom";
import { PantallaNuevoOperador } from "../Operador/Screens/PantallaNuevoOperador";
import { AppLayout } from "../layout/AppLayout";
import { PantallaVehiculo } from "../Vehiculo/Screens/PantallaVehiculo";
import { CatalogoClientes } from '../Cliente/Screens/CatalogoCliente';
import { CatalogoZonas } from "../Zonas/Screens/CatalogoZona";
import { CatalogoSucursales } from "../Sucursales/Screens/CatalogoSucursales";
import { CrearCliente } from '../Cliente/Screens/CrearCliente';
import { PantallaCoordinador } from '../Coordinador/Screens/PantallaCoordinador';
import { CatalogoVehiculos } from "../Vehiculo/Screens/CatalogoVehiculo";
import { PantallaOperador } from "../Operador/Screens/PantallaOperadores";
import { PantallaInicio } from "../Inicio/Screens/PantallaIncio";
import { CatalogoCoordinadores } from "../Coordinador/Screens/CatalogoCoordinadores"
import { CatalogoSubDirectores } from "../SubDirector/Screens/CatalogoSubDirectores"
import { PantallaSubDirector } from '../SubDirector/Screens/PantallaSubDirector';
import { CatalogoDirectores } from "../Director/Screens/CatalogoDirectores"
import { PantallaDirector } from '../Director/Screens/PantallaDirector';
import TabsScreenSucursales from "../Sucursales/Screens/tabsScreensSucursales";
import { CatalogoMunicipio } from "../Municipio/Screens/CatalogoMunicipio";
import { CrearMunicipio } from "../Municipio/Screens/CrearMunicipio";
import { CatalogoEstado } from "../Estado/Screens/CatalogoEstado";
import { CrearEstado } from "../Estado/Screens/CrearEstado";
import { PantallaTipoVehiculo } from "../TipoVehiculo/Screens/PantallaTipoVehiculos";
import { PantallaNuevoTipoVehiculo } from "../TipoVehiculo/Screens/PantallaNuevoTipoVehiculo";
import { PermisosRolesScreen } from "../Seguridad/PermisosRoles/PermisosRolesScreen";
import { NuevoPermisosRolesScreen } from "../Seguridad/PermisosRoles/NuevoPermisosRolesScreen";
import { NuevoRolScreen } from "../Seguridad/PermisosRoles/NuevoPermisosRolesScreen";
import { RolesUsuariosScreen } from "../Seguridad/RolesUsuarios/RolesUsuariosScreen";
import { NuevoRolesUsuariosScreen } from "../Seguridad/RolesUsuarios/NuevoRolesUsuariosScreen";
import { PantallaNuevaPlanificacion } from "../Planificacion/Screens/PantallaNuevaPlanificacion";
import { PantallaPlanificaciones } from "../Planificacion/Screens/PantallaPlanificaciones";
import { StepChkInOut } from "../CheckInOut/StepCheckInCheckOut/stepChkInOut";
import { PantallaProductividad } from "../Productividad/Screens/PantallaProductividad";
import { PantallaDetalleProductividad } from "../Productividad/Screens/DetalleProductividad";
import { PantallaRegistroIndividualProductividad } from "../Productividad/Screens/RegistroIndividualProductividad";
import { ModalCrearEjecucionPlanificacion } from "../Productividad/Screens/ModalCrearEjecucionPlanificacion";
import { PantallaNomina } from "../Nomina/Screens/Nomina";
import { PantallaDetalleNomina } from "../Nomina/Componentes/DetalleNomina";
import { PantallaReporteGasolinaOperador } from '../Reportes/Screens/ReporteGasolina';
import { PantallaReporteVehiculosExtra } from "../Reportes/Screens/ReporteVehiculosExtra";

export const StedRoutes = () => {

  const rutaServidor = "/";

  return (
    <AppLayout>
      <Routes>
        <Route path={rutaServidor + "/inicio"} element={<PantallaInicio />} />
        <Route path={rutaServidor + "/operador/crear"} element={<PantallaNuevoOperador />} />
        <Route path={rutaServidor + "/vehiculos/CatalogoVehiculos"} element={<CatalogoVehiculos />} />
        <Route path={rutaServidor + "/vehiculos/MantenimientoVehiculos"} element={<PantallaVehiculo />} />
        <Route path={rutaServidor + "/cliente/CatalogoCliente"} element={<CatalogoClientes />} />
        <Route path={rutaServidor + "/cliente/CrearCliente"} element={<CrearCliente />} />
        <Route path={rutaServidor + "/zona/CatalogoZona"} element={<CatalogoZonas />} />
        <Route path={rutaServidor + "/coordinador/CatalogoCoordinadores"} element={<CatalogoCoordinadores />} />
        <Route path={rutaServidor + "/coordinador/MantenimientoCoordinador"} element={<PantallaCoordinador />} />
        <Route path={rutaServidor + "/subDirector/CatalogoSubDirectores"} element={<CatalogoSubDirectores />} />
        <Route path={rutaServidor + "/subDirector/MantenimientoSubDirector"} element={<PantallaSubDirector />} />
        <Route path={rutaServidor + "/director/CatalogoDirectores"} element={<CatalogoDirectores />} />
        <Route path={rutaServidor + "/director/MantenimientoDirector"} element={<PantallaDirector />} />
        <Route path={rutaServidor + "/sucursales/CatalogoSucursales"} element={<CatalogoSucursales />} />
        <Route path={rutaServidor + "/sucursales/CatalogoSucursales/horarios"} element={<TabsScreenSucursales />} />
        <Route path={rutaServidor + "/operador/Operadores"} element={<PantallaOperador />} />
        <Route path={rutaServidor + "/municipio/CatalogoMunicipio"} element={<CatalogoMunicipio />} />
        <Route path={rutaServidor + "/municipio/CrearMunicipio"} element={<CrearMunicipio />} />
        <Route path={rutaServidor + "/estado/CatalogoEstado"} element={<CatalogoEstado />} />
        <Route path={rutaServidor + "/estado/CrearEstado"} element={<CrearEstado />} />
        <Route path={rutaServidor + "/tipovehiculo/TipoVehiculos"} element={<PantallaTipoVehiculo />} />
        <Route path={rutaServidor + "/tipovehiculo/crear"} element={<PantallaNuevoTipoVehiculo />} />
        <Route path={rutaServidor + "/checkinout"} element={<StepChkInOut />} /> {/*<PantallaCheckInCheckOut />*/}
        <Route path={rutaServidor + "/seguridad/PermisosRoles"} element={<PermisosRolesScreen />} />
        <Route path={rutaServidor + "/seguridad/PermisosRolesCrear"} element={<NuevoPermisosRolesScreen />} />
        <Route path={rutaServidor + "/seguridad/RolesUsuarios"} element={<RolesUsuariosScreen />} />
        <Route path={rutaServidor + "/seguridad/RolesUsuariosCrear"} element={<NuevoRolesUsuariosScreen />} />
        <Route path={rutaServidor + "/seguridad/RoleCrear"} element={<NuevoRolScreen />} />
        <Route path={rutaServidor + "/planificacion/crear"} element={<PantallaNuevaPlanificacion />} />
        <Route path={rutaServidor + "/planificacion/planificaciones"} element={<PantallaPlanificaciones />} />
        <Route path={rutaServidor + "/productividad"} element={<PantallaProductividad />} />
        <Route path={rutaServidor + "/productividad/detalleProductividad"} element={<PantallaDetalleProductividad />} />
        <Route path={rutaServidor + "/productividad/registroIndividualProductividad"} element={<PantallaRegistroIndividualProductividad />} />
        <Route path={rutaServidor + "/registroIndividualProductividad/ModalCrearEjecucionPlanificacion"} element={<ModalCrearEjecucionPlanificacion />} />        
        <Route path={rutaServidor + "/nomina"} element={<PantallaNomina />} />
        <Route path={rutaServidor + "/Nomina/Componentes/DetalleNomina"} element={<PantallaDetalleNomina />} />
        <Route path={rutaServidor + "/Reportes/ReporteGasolina"} element={<PantallaReporteGasolinaOperador></PantallaReporteGasolinaOperador>}></Route>
        <Route path={rutaServidor + "/Reportes/ReporteVehiculosExtra"} element={<PantallaReporteVehiculosExtra></PantallaReporteVehiculosExtra>}></Route>
      </Routes>
    </AppLayout>
  );
};