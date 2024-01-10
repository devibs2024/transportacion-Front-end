import { useEffect, useState } from "react";
import { Button, Card } from "react-bootstrap";
import { ModalCrearAsignacionTarjeta } from "./ModalCrearAsignacionTarjeta";
import { AsignacionTarjetaTable } from "./AsignacionTarjetaTable";
import { getTarjetas } from "./tarjetaUtils";
import { ModalEditarAsignacionTarjeta } from "./ModalEditarAsignacionTarjeta";

export const CardAsignacionTarjeta = ({ operador }) => {
  const [tarjetas, setTarjetas] = useState([]);
  const [tarjeta, setTarjeta] = useState();
  const [show, setShow] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    getTarjetas(operador.idEmpleado, setTarjetas);
  }, []);

  return (
    <>
      <div className="col col-sm-12">
        <ModalCrearAsignacionTarjeta
          show={show}
          setShow={setShow}
          operador={operador}
          tarjetas={tarjetas}
          setTarjetas={setTarjetas}
        />

<ModalEditarAsignacionTarjeta
          show={showEdit}
          tarjeta={tarjeta}
          setShow={setShowEdit}
          operador={operador}
          tarjetas={tarjetas}
          setTarjetas={setTarjetas}
        />
        <Card>
          <div className="d-flex justify-content-start ms-3 mt-2 me-3">
            <Button
              disabled={operador.idEmpleado === 0}
              onClick={handleShow}
              variant="custom"
              className="me-3 mt-3"
            >
              Agregar Nueva Tarjeta de Gasolina <i className="fa-solid fa-plus"></i>
            </Button>
          </div>
          <Card.Body>
            <Card.Body>
              <AsignacionTarjetaTable setTarjeta= {setTarjeta} show = {setShowEdit} setShow = {setShowEdit}  tarjetas={tarjetas} setTarjetas={setTarjetas} />
            </Card.Body>
          </Card.Body>
        </Card>
      </div>
    </>
  );
};
