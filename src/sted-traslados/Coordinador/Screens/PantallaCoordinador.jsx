import { FormularioCoordinador } from "../Components/FormularioCoordinadores";
import { useDispatch, useSelector } from "react-redux";
import { CustomCard } from "../../../shared/card-custom";
import { TabView, TabPanel } from 'primereact/tabview';
import { useState } from "react";
import { CardCoordinadorCliente } from "../Components/Clientes/CardCoordinadorCliente";
import { CardCuentaBancaria } from "../../Operador/Components/CuentaBancaria/CardCuentaBancaria";
import { CardOperadorHorario } from "../../Operador/Components/Horarios/CardHorario";

export const PantallaCoordinador = () => {

    const [coordinador, setCoordinador] = useState({
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
            <CustomCard title="Mantenimiento de Coordinador" >
                <TabView>
                    <TabPanel header="Datos Coordinador">
                        <FormularioCoordinador setCoordinador={setCoordinador} coordinador={coordinador} />
                    </TabPanel>
                    <TabPanel disabled={coordinador.idEmpleado ? false : true} header="Tienda">
                        <CardCoordinadorCliente coordinador={coordinador} />
                    </TabPanel>
                    <TabPanel disabled={coordinador.idEmpleado ? false : true} header="Cuenta Bancaria">
                        <CardCuentaBancaria operador={coordinador} />
                    </TabPanel>
                    {/* <TabPanel disabled={coordinador.idEmpleado ? false : true} header="Horarios">
                        <CardOperadorHorario operador={coordinador} />
                    </TabPanel> */}
                </TabView>
            </CustomCard>
        </div>
    );
}
