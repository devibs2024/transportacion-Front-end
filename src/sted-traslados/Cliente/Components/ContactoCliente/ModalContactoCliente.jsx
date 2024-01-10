import { useEffect, useState } from "react";
import { useFormik } from 'formik';
import API from "../../../../store/api";
import { Button, Modal, Form } from "react-bootstrap";
import * as Yup from 'yup';
import { accionExitosa, accionFallida } from '../../../../shared/Utils/modals';
import { procesarErrores } from "../../../../shared/Utils/procesarErrores";

export const ModalContactoCliente = ({ cliente, contactoClientes, setContactoClientes, getContactoCliente , setShow, show }) => {

  const [formState, setFormState] = useState(true);
  const [subGerenteOptions, setSubGerenteOptions] = useState([]);
  const [zonaStedsOptions, setZonaStedsOptions] = useState([]);
  const handleClose = () => setShow(false);

  const formik = useFormik({

    initialValues: {
      nombre: '',
      telefono: '',
      telefono2: '',
      email: '',
      tipoContacto: '',
      activo: false
    },
    validationSchema: Yup.object({
      nombre: Yup.string().required('Este campo es obligatorio'),
      telefono: Yup.string().required('Este campo es obligatorio').length(10, "La longitud debe de ser de 10 caracteres"),
      telefono2: Yup.string().required('Este campo es obligatorio').length(10, "La longitud debe de ser de 10 caracteres"),
     //telefono: Yup.string().required('Este campo es obligatorio'),
     //telefono2: Yup.string().required('Este campo es obligatorio'),
      email: Yup.string().email().required('Este campo es obligatorio'),
      tipoContacto: Yup.number().required('Este campo es obligatorio'),
    }),


    onSubmit: (values) => {

      let nuevoContactoCliente = {
        idCliente: cliente.idCliente,
        nombre: values.nombre,
        telefono: values.telefono,
        telefono2: values.telefono2,
        email: values.email,
        tipoContacto: values.tipoContacto,
        activo: values.activo
      }

      postContactoCliente(nuevoContactoCliente);
    }
  });


  const postContactoCliente = async (contactoCliente) => {

    try {

      const response = await API.post("ContactoCliente", contactoCliente);

      if (response.status == 200 || response.status == 204) {

        accionExitosa({ titulo: 'Contacto Cliente Agregado', mensaje: ' ¡El Contacto Cliente ha sido creado satisfactoriamente!' }).then(() => {
          handleClose();
          formik.resetForm();
        });

        await getContactoCliente();


      } else {
        accionFallida({ titulo: 'El Contacto Cliente no puedo se Agregado', mensaje: '¡Ha ocurrido un error al intentar agregar el Contacto Cliente!' }).then(() => {
          handleClose();
          formik.resetForm();
        });
      }

    } catch (e) {

      console.log(e)

      let errores = e.response.data;

      accionFallida({ titulo: 'El Contacto Cliente no puedo se Agregado', mensaje: procesarErrores(errores) }).then(() => {
        handleClose();
        formik.resetForm();
      });

    }
  }

  return (
    <Modal centered show={show} onHide={handleClose}>
      <Form onSubmit={formik.handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>Agregar Nuevo Contacto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <CampoFormulario
              controlId="nombre"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.nombre}
              label="Nombre Completo:"
              placeholder="Introduzca el Nombre Completo"
              name="nombreTienda"
              error={formik.touched.nombre && formik.errors.nombre ? (<div className="text-danger">{formik.errors.nombre}</div>) : null} />

            <CampoFormulario
              controlId="telefono"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.telefono}
              label="Número de Telefono:"
              placeholder="Introduzca el Número Telefono"
              name="numUnidades"
              error={formik.touched.telefono && formik.errors.telefono ? (<div className="text-danger">{formik.errors.telefono}</div>) : null} />

            <CampoFormulario
              controlId="telefono2"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.telefono2}
              label="Número de Telefono2:"
              placeholder="Introduzca el Número Telefono2"
              name="unidadesMaximas"
              error={formik.touched.telefono2 && formik.errors.telefono2 ? (<div className="text-danger">{formik.errors.telefono2}</div>) : null} />

            <CampoFormulario
              controlId="email"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
              label="Correo:"
              placeholder="Introduzca el Correo"
              name="tarifa"
              error={formik.touched.email && formik.errors.email ? (<div className="text-danger">{formik.errors.email}</div>) : null} />

            <div className='col col-sm-6 mt-1'>
              <Form.Group controlId="tipoContacto">
                <Form.Label>Tipo Contactos:</Form.Label>
                <Form.Control as="select"
                  value={formik.values.tipoContacto}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}>
                  <option value="">Seleccione un Tipo de Contacto</option>
                  <option value="1">Gerente</option>
                  <option value="2">Sub Gerente</option>
                </Form.Control>
                <Form.Text className="text-danger">
                  {formik.touched.tipoContacto && formik.errors.tipoContacto ? (<div className="text-danger">{formik.errors.tipoContacto}</div>) : null}
                </Form.Text>
              </Form.Group>
            </div>

            <Form.Check
              controlId="activo"
              type="switch"
              label="Estatus"
              checked={formik.values.activo}
              onChange={() => { formik.setFieldValue('activo', !formik.values.activo) }}
              className='mx-3'
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cerrar
          </Button>
          <Button type="submit" variant="custom" onClick={values => setFormState(values)}>
            Guardar
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>)

}

const CampoFormulario = (prop) => {

  return (
    <div className='col col-sm-6 mt-1'>
      <Form.Group controlId={prop.controlId}>
        <Form.Label>{prop.label}</Form.Label>
        <Form.Control
          type="text"
          placeholder={prop.placeholder}
          onChange={prop.onChange}
          onBlur={prop.onBlur}
          value={prop.value}
        />
        <Form.Text className="text-danger">
          {prop.error}
        </Form.Text>
      </Form.Group>
    </div>
  );
}