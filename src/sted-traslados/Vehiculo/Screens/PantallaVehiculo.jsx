import { FormularioVehiculo } from "../Components/FormularioVehiculo";
import { CustomCard } from "../../../shared/card-custom";
import { useState } from "react";
import { TabView, TabPanel } from 'primereact/tabview';
import { CardOperadorVehiculo } from "../Components/OperadorVehiculo/CardOperadorVehiculo";

export const PantallaVehiculo = () => {

  const [vehiculo, setVehiculo] = useState({
    idVehiculo: 0,
    nombreVehiculo: '',
    idMarcaVehiculo: '',
    idTipoVehiculo: '',
    idModeloVehiculo: '',
    emisionVehiculo: '',
    vehiculoEmpresa: true,
  });

  return (
    <div className="mt-5">
      <CustomCard title="Mantenimiento de Vehículo" >
          <TabView>
            <TabPanel  header="Datos Vehículo">
            <FormularioVehiculo setVehiculo={setVehiculo} vehiculo={vehiculo } />
          </TabPanel>
          <TabPanel disabled={vehiculo.idVehiculo ? false: true} header="Asignar Vehículo">
            <CardOperadorVehiculo  vehiculo={vehiculo} />
          </TabPanel>
          </TabView>
      </CustomCard>
    </div>
  );
}
