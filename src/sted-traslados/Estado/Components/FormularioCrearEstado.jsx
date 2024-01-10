import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { Formik, useFormik } from 'formik';
import { useGetZona } from '../../../hooks/useGetZona';
import API from '../../../store/api';
import * as Yup from 'yup';
import { useNavigate } from 'react-router';
import { accionExitosa, accionFallida } from '../../../shared/Utils/modals';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { rutaServidor } from '../../../routes/rutaServidor';

export const CreateEstado = ({ setEstado, estado }) => {

  //const [idMunicipio, setidMunicipio] = useState(0);
  const [idEstado, setidEstado] = useState(0);
  const [idZona, setIdZona] = useState(0);

  const [formState, setFormState] = useState(true);
  const [selectedValue, setSelectedValue] = useState('');

  const [show, setShow] = useState(false);
  //const clientes = useDataCliente();
  //const estados = useGetEstados(); 
  //const municipios = useGetMunicipios();
  //const formatos = useGetFormatos();
  const location = useLocation();

  const navigate = useNavigate();


  const updateEstado = (updatedEstado) => {
    setEstado((prevEstado) => ({
      ...prevEstado,
      ...updatedEstado
    }));
  };

  useEffect(() => {

    console.log(location.state?.estado)

    console.log('mounting...')

    if (location.state?.estado) {

      formik.setValues(location.state.estado)

      setidEstado(location.state.estado.idEstado);
      setEstado(location.state.estado)
    } else if (estado.idEstado != 0) {
      formik.setValues(estado)
    }

  }, [])




  const limpiarFormulario = () => {

    console.log('limpiando...')

    formik.resetForm();

    setidEstado(0);

    setEstado({
      idEstado: 0,
      nombreEstado: '',
      activo: '',
      idZona: 0
    });

  }

  const [zonas, setZonas] = useState([]);

  const fetchedZonas = useGetZona();


  useEffect(() => {
    if (zonas.length === 0 && fetchedZonas.length > 0) {
      setZonas(fetchedZonas);
    }
  }, [zonas, fetchedZonas]);

  const zonasOptions = zonas.map(zona => ({
    value: zona.idZona,
    label: zona.nombreZona,
  }));

  const onChangeZona = (event) => {

    formik.handleChange(event);
    const idZona = document.getElementById('idZona').value;
    setIdZona(idZona);

  }



  const getInitialValues = () => {
    return {
      idEstado: '',
      nombreEstado: '',
      activo: '',
      idZona: 0

    }
  }


  const formik = useFormik({

    initialValues: getInitialValues(),
    validationSchema: Yup.object({
      nombreEstado: Yup.string().required('Este campo es obligatorio'),
      //activo: Yup.string().required('Este campo es obligatorio'),
    }),

    onSubmit: (values) => {

      //console.log('ok')
      values.activo === 'false' ? values.activo = false : values.activo = true
      let nuevoEstado = {
        idEstado: idEstado,
        nombreEstado: values.nombreEstado,
        activo: values.activo,
        idZona: values.idZona
      };
      postOrPutEstado(nuevoEstado);

    }
  });



  const postOrPutEstado = async (estado) => {
    let response;


    if (idEstado == 0) {
      response = await API.post("Estados", estado);
      if (response.status == 200 || response.status == 204) {

        setidEstado(response.data);

        updateEstado({
          idEstado: response.data,
          nombreEstado: estado.nombreEstado,
          idZona: estado.idZona
        });
        accionExitosa({ titulo: 'Estado Agregado', mensaje: ' ¡El Estado ha sido creado satisfactoriamente!' });

      } else {

        accionFallida({ titulo: 'El Estado no pudo ser Agregado', mensaje: '¡Ha ocurrido un error al intentar agregar el estado!' });
        updateEstado({ idEstado: response.data })
      }

    } else {

      response = await API.put(`Estados/${idEstado}`, estado);

      if (response.status == 200 || response.status == 204) {
        //console.log('juk', estado)
        accionExitosa({ titulo: 'Estado Actualizado', mensaje: '¡El Estado ha sido actualizado satisfactoriamente!' });

        updateEstado({
          idEstado: idEstado,
          nombreEstado: estado.nombreEstado,
          activo: estado.activo,
          idZona: estado.idZona
        });

      } else {
        accionFallida({ titulo: 'El Estado no pudo ser Actualizado', mensaje: '¡Ha ocurrido un error al intentar actualizar el estado!' });
        updateEstado({ idEstado: response.data })

      }
    }

  }

  return (
    <Form onSubmit={formik.handleSubmit}>
      <div className='mt-3'>
        <div className='row'>

          <CampoFormulario
            controlId="nombreEstado"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.nombreEstado}
            label="Estado"
            placeholder="Introduzca el nombre del estado"
            name="nombreEstado"
            error={formik.touched.nombreEstado && formik.errors.nombreEstado ? (<div className="text-danger">{formik.errors.nombreEstado}</div>) : null} />


          <div className='col col-sm-6 mt-1'>
            <Form.Group controlId="idZona">
              <Form.Label>Zona:</Form.Label>
              <Form.Control as="select"
                value={formik.values.idZona}
                onChange={onChangeZona}
                onBlur={formik.handleBlur}>
                <option value="">Seleccione una Zona</option>
                {zonasOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

          </div>

          <div className='col col-sm-6 mt-1'>
            <Form.Group controlId="activo">
              <Form.Label>Activo:</Form.Label>
              <Form.Check
                type="switch"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                checked={formik.values.activo}
                name="activo"
                className="mt-2"
              />
              <Form.Text className="text-danger">
                {formik.touched.activo && formik.errors.activo ? (
                  <div className="text-danger">{formik.errors.activo}</div>
                ) : null}
              </Form.Text>
            </Form.Group>
          </div>




        </div>
        <div className='mt-5 d-flex justify-content-end'>
          <Button variant="custom" type="submit" className='me-2' onClick={values => setFormState(values)}>Guardar <i className="fa-solid fa-plus"></i></Button>
          <Button variant="outline-secondary" type="button" className='me-2' onClick={() => { limpiarFormulario() }}>Nuevo <i className="fas fa-plus"></i></Button>
          <Button variant="outline-secondary" type="button" className='me-2' onClick={() => navigate(rutaServidor + "/estado/CatalogoEstado")}>Regresar <i className="fas fa-arrow-left"></i></Button>
        </div>
      </div>
    </Form>
  );
}


const CampoFormulario = (prop) => {

  return (
    <div className='col col-sm-6 mt-1'>
      <Form.Group controlId={prop.controlId}>
        <Form.Label >{prop.label}</Form.Label>
        <Form.Control
          type="text"
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