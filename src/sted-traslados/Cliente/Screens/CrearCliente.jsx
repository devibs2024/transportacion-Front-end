import { CustomCard } from "../../../shared/card-custom";
import Tab from 'react-bootstrap/Tab';
import { TabView, TabPanel } from 'primereact/tabview';
import { useState } from "react";
import { CreateCliente } from "../Components/ModalCreateCliente";
import { CardFormato } from "../Components/FormatoCliente/CardFormato";
import { CardShowClienteZonaSted } from "../Components/ZonaSted/CardShowClienteZonaSted";
import { CardShowZonaStedTienda } from "../Components/Tiendas/CardShowZonaStedTienda";
import { CardShowContactoCliente } from "../Components/ContactoCliente/CardShowContactoCliente"

export const CrearCliente = () => {

    const [cliente, setCliente] = useState({
        idCliente: 0,
        clave: 0,
        nombreCliente: '',
        idEstado: 0,
        idMunicipio: 0,
        idZona: 0,
        idFormato: 0,
        tarifa: 0,
        tarifaHoraAdicional: 0,
        tarifaConAyudante: 0,
        tarifaSpot: 0
    });

    return (
        <div className="mt-5">
            <CustomCard>
                <TabView>
                    <TabPanel header="Datos Cliente">
                        <CreateCliente setCliente={setCliente} cliente={cliente} />
                    </TabPanel>
                    <TabPanel disabled={cliente.idCliente ? false : true} header="Contacto">
                        <CardShowContactoCliente cliente={cliente} />
                    </TabPanel>
                    <TabPanel disabled={cliente.idCliente ? false : true} header="Formato">
                        <CardFormato cliente={cliente} />
                    </TabPanel>
                    <TabPanel disabled={cliente.idCliente ? false : true} header="ZonaSted">
                        <CardShowClienteZonaSted cliente={cliente} />
                    </TabPanel>
                    <TabPanel disabled={cliente.idCliente ? false : true} header="Tienda">
                        <CardShowZonaStedTienda cliente={cliente} />
                    </TabPanel>
                </TabView>
            </CustomCard>
        </div>



    );
}