// FormularioOperador/CampoFormulario.js
import React from 'react';
import { Form } from 'react-bootstrap';

const CampoFormulario = (props) => {
    return (
        <div className='col col-sm-6 mt-1'>
            <Form.Group controlId={props.controlId}>
                <Form.Label>{props.label}</Form.Label>
                <Form.Control
                    type="text"
                    onChange={props.onChange}
                    onBlur={props.onBlur}
                    value={props.value}
                />
                <Form.Text className="text-danger">
                    {props.error}
                </Form.Text>
            </Form.Group>
        </div>
    );
};

export default CampoFormulario;
