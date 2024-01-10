import { Table } from "react-bootstrap";
import TarjetaRow from "./TarjetaRow";

export const AsignacionTarjetaTable = ({ show, setShow, tarjetas, setTarjetas, setTarjeta }) => {

  console.log(tarjetas)
  return (
    <div className="p-3">
      <Table>
        <thead>
          <tr>
            <th>Número de Tarjeta</th>
            <th>Monto Diario</th>
            <th className="text-center">Acción</th>
          </tr>
        </thead>
        <tbody>
          {tarjetas.map((tarjeta) => (
            <TarjetaRow setShow = {setShow} show= {show} setTarjeta= {setTarjeta} key={tarjeta.idTarjeta} tarjeta={tarjeta} tarjetas={tarjetas} setTarjetas={setTarjetas} />
          ))}
        </tbody>
      </Table>
    </div>
  );
};
