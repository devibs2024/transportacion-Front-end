import { TabView, TabPanel } from 'primereact/tabview';
import CustomCard from './customCard';
import CatalogoHorarios from '../Components/Horarios/catalogoHorarios';
import ModalCreateEditHorario from '../Components/SucursalesHorarios/handleCreateEditHorarios';
import { CatalogoSucursales } from './CatalogoSucursales';

export default function TabsScreenSucursales() {
    return(
        <div className='mt-3'>
            <CustomCard title = "">
                {
                    <TabView>
                        <TabPanel header="Horarios">
                            <CatalogoHorarios/>
                        </TabPanel>
                        <TabPanel header="Asignar Horarios a Sucursales">
                            <CustomCard>
                                <ModalCreateEditHorario id={0}/>
                            </CustomCard>
                        </TabPanel>
                    </TabView>
                }
            </CustomCard>
        </div>
    )
}