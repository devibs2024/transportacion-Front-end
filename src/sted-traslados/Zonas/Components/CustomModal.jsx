import React from "react";
import { Modal, Button } from "react-bootstrap";

function CustomModal(props) {
  
  return (
    <Modal show={props.show} onHide={props.handleClose} >
      <Modal.Header closeButton>
        <Modal.Title>{props.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{props.body}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={props.handleClose}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default CustomModal;