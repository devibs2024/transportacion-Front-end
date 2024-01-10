import { CustomCard } from "../../../shared/card-custom";
import { useState } from "react";
import { TabView, TabPanel } from "primereact/tabview";

export const PantallaNominaCard = () => {

    const [ operador, setOperador] = useState({
        idOperador: 0,
        nombreOperador: '',
        idTienda: 0,
        nombreTienda: '',
        idCoordinador: 0,
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