import { Button } from "react-bootstrap";
import { eliminarTarjeta, putTarjeta} from "./tarjetaUtils";

const TarjetaRow = ({ tarjeta,tarjetas,show,setShow, setTarjetas, setTarjeta }) => (
  <tr key={tarjeta.idTarjeta}>
    <td>{tarjeta.numTarjeta}</td>
    <td>{tarjeta.montoDiario}</td>
    <td>
      <div className="text-end">
        <Button variant="link" onClick={() => eliminarTarjeta(tarjeta, tarjetas, setTarjetas)}>
          <i className="fa-solid fa-trash text-danger"></i>
        </Button>
        <Button variant="link" onClick={() =>  {
          setTarjeta(tarjeta)
      //    putTarjeta(tarjeta);
        setShow(true)
        }}>
          <i className="fa-solid fa-pencil text-danger"></i>
        </Button>
      </div>
    </td>
  </tr>
);
export default TarjetaRow;
