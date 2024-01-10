
import { TabView, TabPanel } from 'primereact/tabview';
import { CustomCard } from "./Card";
import { useState } from "react";
import { FormularioRolesUsuarios } from "./FormularioNuevoRolesUsuarios";

export const NuevoRolesUsuariosScreen = () => {

    const [rol, setRol] = useState({
        id: '',
        email: '',
        userRoles: ''
    });

    return (

        <div className="mt-5">
            <CustomCard titulo="Asignar Rol a Usuario" >
                <TabView>

                    <TabPanel header="Asignar Rol a Usuario" >
                        <FormularioRolesUsuarios setRol={setRol} rol={rol} />
                    </TabPanel>

                </TabView>
            </CustomCard>
        </div>
    );
}