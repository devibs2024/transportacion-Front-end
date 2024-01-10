import { FormularioTipoVehiculo } from "../Components/FormularioNuevoTipoVehiculo";
import { TabView, TabPanel } from 'primereact/tabview';
import { CustomCard } from "../Components/Card";
import { useState } from "react";
import { CardMarcas } from "../Components/Marcas/CardMarcas";
import { CardModelo} from "../Components/Modelos/CardModelo";
import { CardTarifaTipoVehiculo} from "../Components/TarifasTipoVehiculo/CardTarifaTipoVehiculo";


export const PantallaNuevoTipoVehiculo = () => {

    const [tipovehiculo, setTipoVehiculo] = useState({
        idTipoVehiculo: 0,
        tipoVehiculo: '',
        activo: '',
    });

    const [tipovehiculoMarcas, setTipoVehiculoMarcas] = useState({
        idTipo: 0,
        idMarca:0,
        marca: '',
        activo: '',
    });

    return (
        <div className="mt-5">
            <CustomCard titulo="Mantenimiento de Tipo Vehiculos" >
                <TabView>
                    <TabPanel header="Datos" >
                        <FormularioTipoVehiculo setTipoVehiculo={setTipoVehiculo} tipoVehiculo={tipovehiculo} />
                    </TabPanel>
                    
                    <TabPanel disabled={tipovehiculo.idTipoVehiculo ? false : true} header="Tarifa">
                    <CardTarifaTipoVehiculo tipovehiculo={tipovehiculo} />
                    </TabPanel>

                    <TabPanel disabled={tipovehiculo.idTipoVehiculo ? false : true} header="Marcas">
                      <CardMarcas />
                    </TabPanel>

                    {/* <TabPanel disabled={tipovehiculo.idTipoVehiculo ? false : true} header="Modelos">
                      <CardModelo tipovehiculo={tipovehiculo} /> 
                    </TabPanel> */}
                </TabView>
            </CustomCard>
        </div>
    );
}