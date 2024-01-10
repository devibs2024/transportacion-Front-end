import React from "react";
import { Modal, Button } from "react-bootstrap";

function CustomModal(props) {
  
  return (
    <Modal show={props.show} onHide={props.handleClose} size="lg" >
      <Modal.Header closeButton>
        <Modal.Title>{props.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{props.body}</Modal.Body>
      <Modal.Footer>
      {/* <Button variant="secondary" onClick={props.handleClose}>
          Cerrar
        </Button> */}
        {/* <Button variant="custom" onClick={props.handleClose}>
          Guardar
        </Button> */}
      </Modal.Footer>
    </Modal>
  );
}

export default CustomModal;