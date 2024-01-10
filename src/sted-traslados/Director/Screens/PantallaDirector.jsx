import { FormularioDirector } from "../Components/FormularioDirectores";
import { useDispatch, useSelector } from "react-redux";
import { CustomCard } from "../../../shared/card-custom";
import { TabView, TabPanel } from 'primereact/tabview';
import { useState } from "react";
import { CardCuentaBancaria } from "../../Operador/Components/CuentaBancaria/CardCuentaBancaria";
import { CardAsignacionTarjeta } from "../../Operador/Components/AsignacionTarjeta/CardAsignacionTarjeta";
import { CardSubDirectorCoordinador } from "../Components/Coordinador/CardSubDirectorCoordinador";


export const PantallaDirector = () => {

    const [director, setDirector] = useState({
        idEmpleado: 0,
        nombres: '',
        direccion: '',
        idMunicipio: '',
        telefono: '',
        correo: '',
        salario: '',
        empleadoInterno: true
    });

    return (
        <div className="mt-5">
            <CustomCard title="Mantenimiento de Director" >
                <TabView>
                    <TabPanel header="Datos Director">
                        <FormularioDirector setDirector={setDirector} director={director} />
                    </TabPanel>
                    {/*                     <TabPanel disabled={subDirector.idEmpleado ? false : true} header="Coordinador">
                        <CardSubDirectorCoordinador subDirector={subDirector} />
                    </TabPanel>
                    <TabPanel disabled={subDirector.idEmpleado ? false : true} header="Cuenta Bancaria">
                        <CardCuentaBancaria operador={subDirector} />
                    </TabPanel>
                    <TabPanel disabled={subDirector.idEmpleado ? false : true} header="Tarjeta Gasolina">
                        <CardAsignacionTarjeta operador={subDirector} />
                    </TabPanel> */}
                </TabView>
            </CustomCard>
        </div>
    );
}
