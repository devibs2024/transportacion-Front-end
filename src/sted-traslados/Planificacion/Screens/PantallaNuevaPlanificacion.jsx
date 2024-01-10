import { TabPanel, TabView } from "primereact/tabview"
import CustomCard from "../../Sucursales/Screens/customCard"
import { FormularioNuevaPlanificacion } from "./FormularioPlanificacion/FormularioNuevaPlanificacion";
import { useState } from "react";
import { CardDetallePlanificacion } from "../DetallePlanificacion/CardDetallePlanificacion";

export const PantallaNuevaPlanificacion = () => {


    const [planificacion, setPlanificacion] = useState({
        fechaDesde: '',
        fechaHasta: '',
        comentario: '',
        idCoordinador: 0
    });
    return (
        <div className="mt-5">
            <CustomCard titulo="Mantenimiento de Planificación" >
                <TabView>
                    <TabPanel header="Planificación" >
                        <FormularioNuevaPlanificacion planificacion={planificacion} setPlanificacion={setPlanificacion} />
                    </TabPanel>
                    <TabPanel header="Detalle de Planificación" >
                        <CardDetallePlanificacion planificacion={planificacion} setPlanificacion={setPlanificacion} />
                    </TabPanel>
                </TabView>
            </CustomCard>
        </div>
    )
}