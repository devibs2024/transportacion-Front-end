
import { TabView, TabPanel } from 'primereact/tabview';
import { CustomCard } from "./Card";
import { useState } from "react";
import { FormularioPermisosRoles } from "./FormularioNuevoPermisosRoles";
import { FormularioRol } from "./FormularioNuevoRol";

export const NuevoPermisosRolesScreen = () => {

    const [permisos, setPermisos] = useState({
        roleName: '',
        permissions: ''
    });

    return (

        <div className="mt-5">
            <CustomCard titulo="Asignar Permisos a Rol" >
                <TabView>

                    <TabPanel header="Asignar Permisos a Rol" >
                        <FormularioPermisosRoles permisosRoll={permisos} />
                    </TabPanel>

                </TabView>
            </CustomCard>
        </div>
    );
}

export const NuevoRolScreen = () => {

    const [permisos, setPermisos] = useState({
        roleName: '',
        permissions: ''
    });

    return (

        <div className="mt-5">
            <CustomCard titulo="Asignar Permisos a Rol" >
                <TabView>

                    <TabPanel header="Asignar Permisos a Rol" >
                        <FormularioRol setPermisos={setPermisos} permisos={permisos} />
                    </TabPanel>

                </TabView>
            </CustomCard>
        </div>
    );
}