import { useEffect, useState } from "react";
import { Button, Card, Table } from "react-bootstrap";
import API from "../../../../store/api";
import { ModalContactoCliente } from "./ModalContactoCliente";
import { ContactoClienteTable } from "./ContactoClienteTable";
import { ModalGerenteSubGerente } from "./ModalGerenteSubGerente";

export const CardShowContactoCliente = ({ cliente }) => {

  const [show, setShow] = useState(false);
  const [show1, setShow1] = useState(false);

  const handleShow = () => setShow(true);
  const handleShow1 = () => setShow1(true);

  const [contactoClientes, setContactoClientes] = useState([])

  useEffect(() => {
    getContactoCliente();
  }, [])

  const getContactoCliente = async () => {

    const response = await API.get(`ContactoCliente/${cliente.idCliente}`)

    if (response.status === 200) {

      setContactoClientes(response.data);
    }
  }


  return (
    <div className="col col-sm-12">
      <Card>
        <ModalContactoCliente cliente={cliente} getContactoCliente={getContactoCliente} contactoClientes={contactoClientes} setContactoClientes={setContactoClientes} show={show} setShow={setShow} />
        <ModalGerenteSubGerente cliente={cliente} contactoClientes={contactoClientes} setContactoClientes={setContactoClientes} show1={show1} setShow1={setShow1} />

        <div className="d-flex mt-2 ms-3 me-3">
          <Button onClick={handleShow} variant="custom" className="me-3 mt-3" >Agregar Nuevo Contacto <i className="fa-solid fa-plus"></i></Button>
          <a href="#" className="mt-4" onClick={handleShow1}>Asignar Sub Gerente</a>

        </div>
        <Card.Body >
          <div className="p-3">
            <ContactoClienteTable cliente={cliente} contactoClientes={contactoClientes} setContactoClientes={setContactoClientes} />
          </div>
        </Card.Body>
      </Card>
    </div>
  )
}

