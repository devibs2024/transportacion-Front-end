import { Routes, Route } from "react-router-dom";
import { PantallaDeLogin } from "../screen/LoginScreen";
import { AutoRegistro } from "../screen/AutoRegistroScreen";
import { ValidarCodigo } from "../screen/ValidarCodigoScreen";
import { CreateUser } from "../screen/CreateUserScreen";
import { RecuperarClave } from "../screen/RecuperarClaveScreen";
import { NuevaClave } from "../screen/NuevaClaveScreen";
import { rutaServidor } from "../../routes/rutaServidor";

export const AuthRoutes = () => {

    return (
        <Routes>
            <Route>
                <Route path= {'/login' }  element={<PantallaDeLogin />} />
                <Route path= {'/AutoRegistroScreen' }  element={<AutoRegistro />} />
                <Route path= {'/ValidarCodigoScreen' }  element={<ValidarCodigo />} />
                <Route path= {'/CreateUserScreen' }  element={<CreateUser />} />
                <Route path={'/RecuperarClaveScreen'} element={<RecuperarClave/>} />
                <Route path={'/NuevaClaveScreen'} element={<NuevaClave/>} />
            </Route>
        </Routes>
    );
}