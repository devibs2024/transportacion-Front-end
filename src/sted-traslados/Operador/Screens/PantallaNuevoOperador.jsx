import { FormularioOperador } from '../Components/FormularioOperador/FormularioNuevoOperador';
import { TabView, TabPanel } from 'primereact/tabview';
import { CustomCard } from "../Components/Card";
import { useState } from "react";
import { CardCuentaBancaria } from "../Components/CuentaBancaria/CardCuentaBancaria";
import { CardOperadorVehiculos } from "../Components/OperadorVehiculo/CardOperadorVehiculo";
import { CardAsignacionTarjeta } from "../Components/AsignacionTarjeta/CardAsignacionTarjeta";
import { CardOperadorCoordinador } from "../Components/Coordinador/CardOperadorCoordinador";

export const PantallaNuevoOperador = () => {

    const [operador, setOperador] = useState({
        idEmpleado: 0,
        numeroContrato: '',
        nombres: '',
        apellidoMaterno: '',
        apellidoPaterno: '',
        direccion: '',
        idMunicipio: '',
        telefono: '',
        correo: '',
        salario: '',
        empleadoInterno: false
    });

    return (
        <div className="mt-5">
            <CustomCard titulo="Mantenimiento de Operadores" >
                <TabView>
                    <TabPanel header="Datos Operador" >
                        <FormularioOperador setOperador={setOperador} operador={operador} />
                    </TabPanel>
                    <TabPanel disabled={operador.idEmpleado ? false : true} header="Cuentas Bancarias">
                        <CardCuentaBancaria operador={operador} />
                    </TabPanel>
                    <TabPanel disabled={operador.idEmpleado ? false : true} header="Vehiculos">
                        <CardOperadorVehiculos operador={operador} />
                    </TabPanel>
                    <TabPanel disabled={operador.idEmpleado ? false : true} header="Tarjetas de Gasolina">
                        <CardAsignacionTarjeta operador={operador} />
                    </TabPanel>
                    <TabPanel disabled={operador.idEmpleado ? false : true} header="Coordinadores">
                        <CardOperadorCoordinador operador={operador} />
                    </TabPanel>
                </TabView>
            </CustomCard>
        </div>
    );
}