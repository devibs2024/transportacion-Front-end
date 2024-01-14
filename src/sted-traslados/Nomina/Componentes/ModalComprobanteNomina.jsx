import React, { useEffect } from "react";

import { useFormik } from "formik";
import { Form, Modal, Button } from "react-bootstrap";

import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

export const ModalComprobanteNomina = ({ show, setShow, comprobante, setComprobante }) => {

    const handleClose = () => setShow(false);

    useEffect(() => {


    }, []);

    const formik = useFormik({
        initialValues: {
            idComprobanteNomina: 0
        },
        onSubmit: values => {

            printElement(document.getElementById("printPdf"));

        }
    });

    const printElement = (elem) => {

        //import('jspdf').then((jsPDF) => {
        //    import('jspdf-autotable').then(() => {
        //        const doc = new jsPDF.default(0, 0);
        //        doc.innerHTML(elem.innerHTML)
        //        doc.save('ComprobanteNomina.pdf');
        //    });
        //});

        //var ventimp = window.open(' ', 'popimpr');
        //ventimp.document.write(elem.innerHTML);
        //ventimp.document.close();
        //ventimp.print();
        //ventimp.close();

    }

    const strMoneda = new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", minimumFractionDigits: 2, });

    const strFecha = (date) => {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');

        return `${day}/${month}/${year}`;
    };

    return (
        <div id="printPdf">

            <Modal show={show} onHide={handleClose}>

                <Form onSubmit={formik.handleSubmit}>

                    <Modal.Header closeButton>
                        <Modal.Title >
                            <h3> Volante o comprobante de pago </h3>
                        </Modal.Title>
                    </Modal.Header>

                    <Modal.Body>

                        <Container>

                            <Row>
                                <Col>
                                    Id Operador
                                </Col>
                                <Col>
                                    <font> {String(comprobante.idOperador).padStart(5, '0')} </font>
                                </Col>
                            </Row>

                            <Row >
                                <Col>
                                    Nombre
                                </Col>
                                <Col>
                                    <font> {comprobante.operador} </font>
                                </Col>
                            </Row>

                            <Row >
                                <Col>
                                    Tipo Operador
                                </Col>
                                <Col>
                                    <font>  {comprobante.segmento} </font>
                                </Col>
                            </Row>

                            <Row>
                                <Col>
                                    Coordinador
                                </Col>
                                <Col>
                                    <font> {comprobante.coordinador} </font>
                                </Col>
                            </Row>

                            <Row>
                                <Col>
                                    Fecha
                                </Col>
                                <Col>
                                    <font> {strFecha(new Date(comprobante.fecha))} </font>
                                </Col>
                            </Row>

                            <Row>
                                <Col>
                                    Periodo
                                </Col>
                                <Col>
                                    <font> {strFecha(new Date(comprobante.fechaIni))} - {strFecha(new Date(comprobante.fechaEnd))} </font>
                                </Col>
                            </Row>

                            <Row>
                                <Col>
                                    Banco
                                </Col>
                                <Col>
                                    <font> {comprobante.banco} </font>
                                </Col>
                            </Row>

                            <Row>
                                <Col>
                                    Tarjeta
                                </Col>
                                <Col>
                                    <font> {comprobante.tarjeta} </font>
                                </Col>
                            </Row>

                            <Row>
                                <Col>
                                    Días
                                </Col>
                                <Col>
                                    <font> {comprobante.dias} </font>
                                </Col>
                            </Row>

                            <Row>
                                <Col>
                                    Sueldo
                                </Col>
                                <Col>
                                    <font> {strMoneda.format(comprobante.salario)} </font>
                                </Col>
                            </Row>

                            <Row>
                                <Col>
                                    Descuentos
                                </Col>
                                <Col>
                                    <font class="text-danger"> - {strMoneda.format(comprobante.descuento)} </font>
                                </Col>
                            </Row>

                            <Row>
                                <Col>
                                    Incentivos o bonos
                                </Col>
                                <Col>
                                    <font> {strMoneda.format(comprobante.bono)} </font>
                                </Col>
                            </Row>

                            <Row>
                                <Col>
                                    SMG
                                </Col>
                                <Col>
                                    <font class="text-danger"> - {strMoneda.format(comprobante.smg)} </font>
                                </Col>
                            </Row>

                            <Row>
                                <Col>
                                    <b> Pago total </b>
                                </Col>
                                <Col>
                                    <font> <b> {strMoneda.format(comprobante.pago)} </b> </font>
                                </Col>
                            </Row>

                        </Container>

                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Cerrar
                        </Button>
                        <Button type="submit" onClick={formik.handleSubmit}>
                            Imprimir
                        </Button>
                    </Modal.Footer>
                </Form>

            </Modal>

        </div>
    );
}