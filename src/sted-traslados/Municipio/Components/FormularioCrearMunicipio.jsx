import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { Formik, useFormik } from 'formik';
import { useGetEstados } from '../../../hooks/useGetEstados';
import { useGetMunicipios } from '../../../hooks/useGetMunicipios';
import API from '../../../store/api';
import * as Yup from 'yup';
import { useNavigate } from 'react-router';
import { accionExitosa, accionFallida } from '../../../shared/Utils/modals';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { rutaServidor } from '../../../routes/rutaServidor';

export const CreateMunicipio = ({ setMunicipio, municipio }) => {

  const [idMunicipio, setidMunicipio] = useState(0);
  const [idEstado, setIdEstado] = useState(0);
  const [formState, setFormState] = useState(true);
  const [selectedValue, setSelectedValue] = useState('');

  const [show, setShow] = useState(false);

  const location = useLocation();

  const navigate = useNavigate();


  const updateMunicipio = (updatedMunicipio) => {
    setMunicipio((prevMunicipio) => ({
      ...prevMunicipio,
      ...updatedMunicipio
    }));
  };

  const estados = useGetEstados();
  const municipios = useGetMunicipios();

  const [municipiosOptions, setMunicipiosOptions] = useState([]);

  const estadosOptions = estados.map(estado => ({
    value: estado.idEstado,
    label: estado.nombreEstado
  }));

  useEffect(() => {

    console.log(location.state?.municipio)


    if (location.state?.municipio) {

      formik.setValues({
        idMunicipio: location.state.municipio.idMunicipio,
        nombreMunicipio: location.state.municipio.nombreMunicipio,
        idEstado: location.state.municipio.estado.idEstado,
        activo: location.state.municipio.activo
      })

      setidMunicipio(location.state.municipio.idMunicipio);
      setMunicipio({
        idMunicipio: location.state.municipio.idMunicipio,
        nombreMunicipio: location.state.municipio.nombreMunicipio,
        idEstado: location.state.municipio.estado.idEstado,
        activo: location.state.municipio.activo
      }
      )
      setMunicipiosOptions(municipios.filter(m => m.estado.idEstado == location.state.municipio.estado.idEstado).map(mu => ({
        value: mu.idMunicipio,
        label: mu.nombreMunicipio
      })));

    } else if (municipio.idMunicipio != 0) {
      formik.setValues(municipio)
    }

  }, [])

  const limpiarFormulario = () => {

    formik.resetForm();

    setidMunicipio(0);

    setMunicipio({
      idMunicipio: 0,
      nombreMunicipio: '',
      idEstado: 0,
      activo: ''
    });

  }

  const onChangeEstado = (event) => {

    formik.handleChange(event);
    const idEstado = document.getElementById('idEstado').value;
    setIdEstado(idEstado);

  }

  const getInitialValues = () => {
    return {
      idMunicipio: '',
      nombreMunicipio: '',
      idEstado: '',
      activo: false,

    }
  }


  const formik = useFormik({

    initialValues: getInitialValues(),
    validationSchema: Yup.object({
      nombreMunicipio: Yup.string().required('Este campo es obligatorio'),
      idEstado: Yup.string().required('Este campo es obligatorio'),
      activo: Yup.string().required('Este campo es obligatorio'),
    }),

    onSubmit: (values) => {

      //console.log('ok')
      let nuevoMuncipio = {
        idMunicipio: idMunicipio,
        nombreMunicipio: values.nombreMunicipio,
        idEstado: values.idEstado,
        activo: (values.activo === 'true')
      };
      postOrPutMunicipio(nuevoMuncipio);

    }
  });



  const postOrPutMunicipio = async (municipio) => {
    let response;


    if (idMunicipio == 0) {
      response = await API.post("Municipio", municipio);
      if (response.status == 200 || response.status == 204) {

        setidMunicipio(response.data);

        updateMunicipio({
          idMunicipio: response.data,
          nombreMunicipio: municipio.nombreMunicipio,
          idEstado: municipio.idEstado
        });
        accionExitosa({ titulo: 'Municipio Agregado', mensaje: ' ¡El Municipio ha sido creado satisfactoriamente!' });

      } else {

        accionFallida({ titulo: 'El Municipio no pudo ser Agregado', mensaje: '¡Ha ocurrido un error al intentar agregar el municipio!' });
        updateMunicipio({ idMunicipio: response.data })
      }

    } else {

      response = await API.put(`Municipio/${idMunicipio}`, municipio);

      if (response.status == 200 || response.status == 204) {
        console.log('juk', idMunicipio)
        accionExitosa({ titulo: 'Municipio Actualizado', mensaje: '¡El Municipio ha sido actualizado satisfactoriamente!' });

        updateMunicipio({
          idMunicipio: idMunicipio,
          nombreMunicipio: municipio.nombreMunicipio,
          idEstado: municipio.idEstado,
          activo: municipio.activo
        });

      } else {
        accionFallida({ titulo: 'El Municipio no pudo ser Actualizado', mensaje: '¡Ha ocurrido un error al intentar actualizar el municipio!' });
        updateMunicipio({ idMunicipio: response.data })

      }
    }

  }

  return (
    <Form onSubmit={formik.handleSubmit}>
      <div className='mt-3'>
        <div className='row'>
        <div className='col col-sm-6 mt-1'>
            <Form.Group controlId="idEstado">
              <Form.Label>Estado:</Form.Label>
              <Form.Control as="select"
                value={formik.values.idEstado}
                onChange={onChangeEstado}
                onBlur={formik.handleBlur}>
                <option value="">Seleccione un Estado</option>
                {estadosOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </div>
          
          <CampoFormulario
            controlId="nombreMunicipio"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.nombreMunicipio}
            label="Municipio"
            placeholder="Introduzca el nombre del municipio"
            name="nombreMunicipio"
            error={formik.touched.nombreMunicipio && formik.errors.nombreMunicipio ? (<div className="text-danger">{formik.errors.nombreMunicipio}</div>) : null} />

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
          <Button variant="outline-secondary" type="button" className='me-2' onClick={() => navigate(rutaServidor + "/municipio/CatalogoMunicipio")}>Regresar <i className="fas fa-arrow-left"></i></Button>
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