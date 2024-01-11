import { CustomCard } from "../../../shared/card-custom";
import { useState } from "react";
import { TabView, TabPanel } from "primereact/tabview";

export const PantallaNominaCard = () => {

    const [ operador, setOperador] = useState({
        idCoordinador: 0,
        idOperador: 0,
        nombreOperador: '',
        idTienda: 0,
        nombreTienda: '',
        fechaDesde: '',
        fechaHasta: ''       
    });

    return (
        <div className="mt-5">
            <CustomCard title="Calculo de Nomina">
                <TabView>
                    
                </TabView>
            </CustomCard>
        </div>
    )
}