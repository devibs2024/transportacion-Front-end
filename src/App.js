import { Provider } from "react-redux";
import "./App.css";
import { AppLayout } from "./sted-traslados/layout/AppLayout";
import { store } from "./store/store";

import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./routes/AppRoutes";

function App() {
  return (
    <Provider store={store}>
    
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
     
    </Provider>
  );
}
export default App;
