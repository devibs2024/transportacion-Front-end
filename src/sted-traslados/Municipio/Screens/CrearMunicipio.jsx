import { CustomCard } from "../Components/Card";
import Tab from 'react-bootstrap/Tab';
import { TabView, TabPanel } from 'primereact/tabview';
import { useState } from "react";
import {CreateMunicipio} from "../Components/FormularioCrearMunicipio";



export const CrearMunicipio = () => {

const [municipio, setMunicipio]=useState({
    idMunicipio: 0,
    nombreMunicipio:'',
    estado: 0,
    activo:'',
});
    return(
        <div className="mt-5">
            <CustomCard>
                <div className="p-4">
                    <TabView>
                        <TabPanel header="Datos Municipio">
                        <CreateMunicipio setMunicipio={setMunicipio} municipio={municipio} />
                        </TabPanel>

                        {/* <TabPanel header="Zona">
                         <CardZona cliente={cliente} /> 
                        </TabPanel>

                        <TabPanel header="Formato">
                          <CardFormato cliente={cliente} /> 
                        </TabPanel> */}
                                               
                     </TabView>
                </div>  
        </CustomCard>
    </div>

    );
}