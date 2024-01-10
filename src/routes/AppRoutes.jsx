
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { AuthRoutes } from '../auth/routes/AuthRoutes';
import { StedRoutes } from '../sted-traslados/routes/StedRoutes';

export const AppRoutes = () => {

    const { isLoggedIn } = useSelector(store => store.auth);

    console.log(isLoggedIn)

    const rutaServidor = "sted-planning"

    return (<Routes basename="sted-planning">

        {isLoggedIn ?
            <Route path={ rutaServidor +  '/*'} element={< StedRoutes />} /> :
            <Route path={ rutaServidor +  '/auth/*'} element={<AuthRoutes />} />
        }
        <Route path={ rutaServidor +  '/*'}element={<Navigate to= {  "/" +  rutaServidor +  '/auth/login' }/>} /> 

    </Routes>);
}
