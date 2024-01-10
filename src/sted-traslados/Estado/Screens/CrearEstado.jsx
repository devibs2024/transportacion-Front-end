import { CustomCard } from "../Components/Card";
import Tab from 'react-bootstrap/Tab';
import { TabView, TabPanel } from 'primereact/tabview';
import { useState } from "react";
import {CreateEstado} from "../Components/FormularioCrearEstado";



export const CrearEstado = () => {

const [estado, setEstado]=useState({
    idEstado: 0,
    nombreEstado:'',
    idZona: 0,
    activo:true,
});
    return(
        <div className="mt-5">
            <CustomCard>
                <div className="p-4">
                    <TabView>
                        <TabPanel header="Datos Estados">
                        <CreateEstado setEstado={setEstado} estado={estado} />
                        </TabPanel>
                                               
                     </TabView>
                </div>  
        </CustomCard>
    </div>

    );
}