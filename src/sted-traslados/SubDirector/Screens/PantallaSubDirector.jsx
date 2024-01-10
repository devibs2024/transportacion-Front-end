import { FormularioSubDirector } from "../Components/FormularioSubDirectores";
import { CustomCard } from "../../../shared/card-custom";
import { TabView, TabPanel } from 'primereact/tabview';
import { useState } from "react";

export const PantallaSubDirector = () => {

    const [subDirector, setSubDirector] = useState({
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
            <CustomCard title="Mantenimiento de SubDirector" >
                <TabView>
                    <TabPanel header="Datos SubDirector">
                        <FormularioSubDirector setSubDirector={setSubDirector} subDirector={subDirector} />
                    </TabPanel>
                </TabView>
            </CustomCard>
        </div>
    );
}
