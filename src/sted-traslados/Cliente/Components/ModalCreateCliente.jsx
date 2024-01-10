import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { Formik, useFormik } from 'formik';
import { useGetEstados } from '../../../hooks/useGetEstados';
import { useGetMunicipios } from '../../../hooks/useGetMunicipios';
import { useGetFormatos } from '../../../hooks/useGetFormatos';
import { useDataCliente } from '../../../hooks/useDataCliente';
import API from '../../../store/api';
import * as Yup from 'yup';
import { useNavigate } from 'react-router';
import { accionExitosa, accionFallida } from '../../../shared/Utils/modals';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { rutaServidor } from '../../../routes/rutaServidor';
import { useGetZona } from '../../../hooks/useGetZona'
import { procesarErrores } from '../../../shared/Utils/procesarErrores';

export const CreateCliente = ({ setCliente, cliente }) => {

  const [idCliente, setidCliente] = useState(0);
  const [idEstado, setIdEstado] = useState(0);
  const [idZona, setIdZona] = useState(0);

  const [formState, setFormState] = useState(true);
  const [selectedValue, setSelectedValue] = useState('');

  const [show, setShow] = useState(false);
  const location = useLocation();

  const navigate = useNavigate();


  const updateCliente = (updatedCliente) => {
    setCliente((prevCliente) => ({
      ...prevCliente,
      ...updatedCliente
    }));
  };

  useEffect(() => {

    if (location.state?.cliente) {


      setIdZona(location.state?.cliente.idZona);
      setIdEstado(location.state?.cliente.idEstado)
      formik.setValues({
        idCliente: location.state?.cliente.idCliente,
        clave: location.state?.cliente.clave,
        nombreCliente: location.state?.cliente.nombreCliente,
        idEstado: location.state?.cliente.idEstado,
        idMunicipio: location.state?.cliente.idMunicipio,
        idZona: location.state?.cliente.idZona,
        tarifa: location.state?.cliente.tarifa,
        tarifaHoraAdicional: location.state?.cliente.tarifaHoraAdicional,
        tarifaConAyudante: location.state?.cliente.tarifaConAyudante,
        tarifaSpot: location.state?.cliente.tarifaSpot
    })

      setidCliente(location.state.cliente.idCliente);
      setCliente(location.state.cliente)
    } else if (cliente.idCliente != 0) {
      formik.setValues(cliente)
    }

  }, [])

  const limpiarFormulario = () => {

    formik.resetForm();

    setidCliente(0);

    setCliente({
      idCliente: 0,
      clave: 0,
      nombreCliente: '',
      idEstado: 0,
      idMunicipio: 0,
      idFormato: 0,
      idZona: 0,
      tarifa: 0,
      tarifaHoraAdicional: 0,
      tarifaConAyudante: 0,
      tarifaSpot: 0
    });

  }

  const [estados, setEstados] = useState([]);
  const [municipios, setMunicipios] = useState([]);
  const [zonas, setZonas] = useState([]);

  const fetchedEstados = useGetEstados();
  const fetchedMunicipios = useGetMunicipios();
  const fetchedZonas = useGetZona();

  useEffect(() => {
    if (estados.length === 0 && fetchedEstados.length > 0) {
      setEstados(fetchedEstados);
    }
  }, [estados, fetchedEstados]);

  useEffect(() => {
    if (municipios.length === 0 && fetchedMunicipios.length > 0) {
      setMunicipios(fetchedMunicipios);
    }
  }, [municipios, fetchedMunicipios]);

  useEffect(() => {
    if (zonas.length === 0 && fetchedZonas.length > 0) {
      setZonas(fetchedZonas);
    }
  }, [zonas, fetchedZonas]);

  const zonasOptions = zonas.map((zona) => ({
    value: zona.idZona,
    label: zona.nombreZona
  }));

  const estadosOptions = estados.filter(m => m.idZona == idZona).map(estado => ({
    value: estado.idEstado,
    label: estado.nombreEstado
  }));

  const municipiosOptions = municipios.filter(m => m.estado.idEstado == idEstado).map(mu => ({

    value: mu.idMunicipio,
    label: mu.nombreMunicipio
  }))

  const onChangeZona = (event) => {

    formik.handleChange(event);

    const idZona = document.getElementById('idZona').value;

    setIdZona(idZona);

  }

  const onChangeEstado = (event) => {

    formik.handleChange(event);

    const idEstado = document.getElementById('idEstado').value;

    setIdEstado(idEstado);

  }

  const getInitialValues = () => {
    return {
      clave: '',
      nombreCliente: '',
      idEstado: '',
      idMunicipio: '',
      tarifa: '',
      tarifaHoraAdicional: '',
      tarifaConAyudante: '',
      tarifaSpot: '',

    }
  }


  const formik = useFormik({

    initialValues: getInitialValues(),
    validationSchema: Yup.object({
      clave: Yup.number().required('Este campo es obligatorio'),
      nombreCliente: Yup.string().required('Este campo es obligatorio'),
      idEstado: Yup.string().required('Este campo es obligatorio'),
      idMunicipio: Yup.string().required('Este campo es obligatorio'),
      tarifa: Yup.number().typeError('La tarifa debe ser un número.').required('Este campo es obligatorio'),
      tarifaHoraAdicional: Yup.number().typeError('La tarifa con hora adicional debe ser un número.').required('Este campo es obligatorio'),
      tarifaConAyudante: Yup.number().typeError('La tarifa con ayudante  debe ser un número.').required('Este campo es obligatorio'),
      tarifaSpot: Yup.number().typeError('La tarifa spot debe ser un número.').required('Este campo es obligatorio')
    })
    ,
    onSubmit: (values) => {

      let nuevoCliente = {
        idCliente: idCliente,
        clave: values.clave,
        nombreCliente: values.nombreCliente,
        idEstado: values.idEstado,
        idMunicipio: values.idMunicipio,
        tarifa: values.tarifa,
        tarifaHoraAdicional: values.tarifaHoraAdicional,
        tarifaConAyudante: values.tarifaConAyudante,
        tarifaSpot: values.tarifaSpot,
        idZona: values.idZona
      };

      postOrPutCliente(nuevoCliente);

    }
  });


  const postOrPutCliente = async (cliente) => {

    try {
      let response;

      if (idCliente == 0) {

        response = await API.post("Clientes", cliente);
        if (response.status == 200 || response.status == 204) {


          setidCliente(response.data);

          updateCliente({
            idCliente: response.data,
            nombreCliente: cliente.nombreCliente,
            idEstado: cliente.idEstado,
            idZona: cliente.idZona,
            idMunicipio: cliente.idMunicipio,
            tarifa: cliente.tarifa,
            tarifaHoraAdicional: cliente.tarifaHoraAdicional,
            tarifaConAyudante: cliente.tarifaConAyudante,
            tarifaSpot: cliente.tarifaSpot

          });

          accionExitosa({ titulo: 'Cliente Agregado', mensaje: ' ¡El Cliente ha sido creado satisfactoriamente!' });

        } else {
          accionFallida({ titulo: 'El Cliente no puedo se Agregado', mensaje: '¡Ha ocurrido un error al intentar agregar el cliente!' });
          updateCliente({ idCliente: response.data })
        }
      } else {
        try {

          response = await API.put(`Clientes/${idCliente}`, cliente);

          if (response.status == 200 || response.status == 204) {

            updateCliente({
              idCliente: idCliente,
              nombreCliente: cliente.nombreCliente,
              idEstado: cliente.idEstado,
              idMunicipio: cliente.idMunicipio,
              idZona: cliente.idZona,
              tarifa: cliente.tarifa,
              tarifaHoraAdicional: cliente.tarifaHoraAdicional,
              tarifaConAyudante: cliente.tarifaConAyudante,
              tarifaSpot: cliente.tarifaSpot
            });

            accionExitosa({ titulo: 'Cliente Actualizado', mensaje: '¡El Cliente ha sido actualizado satisfactoriamente!' });

          } else {
            accionFallida({ titulo: 'El Cliente no puedo ser Actualizado', mensaje: '¡Ha ocurrido un error al intentar actualizar el cliente!' });
            updateCliente({ idCliente: response.data })

          }
        } catch (e) {
          let errores = e.response.data;
          accionFallida({ titulo: 'El Cliente no puedo ser Actualizado', mensaje: procesarErrores(errores) });
        }

      }

    } catch (e) {

      let errores = e.response.data;

      accionFallida({ titulo: 'El Cliente no puedo se Agregado', mensaje: procesarErrores(errores) });
    }

  }

  return (
    <Form onSubmit={formik.handleSubmit}>
      <div className='mt-3'>
        <div className='row'>
          <CampoFormulario
            controlId="clave"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.clave}
            label="Clave"
            placeholder="Introduzca la clave"
            name="clave"
            error={formik.touched.clave && formik.errors.clave ? (<div className="text-danger">{formik.errors.clave}</div>) : null} />

          <CampoFormulario
            controlId="nombreCliente"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.nombreCliente}
            label="Nombre"
            placeholder="Introduzca el nombre"
            name="numeroContrato"
            error={formik.touched.nombreCliente && formik.errors.nombreCliente ? (<div className="text-danger">{formik.errors.nombreCliente}</div>) : null} />

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
              <Form.Text className="text-danger">
                {formik.touched.idEstado && formik.errors.idEstado ? (<div className="text-danger">{formik.errors.idEstado}</div>) : null}
              </Form.Text>
            </Form.Group>
          </div>

          <div className='col col-sm-6 mt-1'>
            <Form.Group controlId="idMunicipio">
              <Form.Label>Municipio:</Form.Label>
              <Form.Control as="select"
                value={formik.values.idMunicipio}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}>
                <option value="">Seleccione un municipio</option>
                {municipiosOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Form.Control>
              <Form.Text className="text-danger">
                {formik.touched.idMunicipio && formik.errors.idMunicipio ? (<div className="text-danger">{formik.errors.idMunicipio}</div>) : null}
              </Form.Text>
            </Form.Group>
          </div>


          <CampoFormulario
            controlId="tarifa"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.tarifa}
            label="Tarifa"
            placeholder="Introduzca la tarifa"
            name="tarifa"
            error={formik.touched.tarifa && formik.errors.tarifa ? (<div className="text-danger">{formik.errors.tarifa}</div>) : null} />

          <CampoFormulario
            controlId="tarifaHoraAdicional"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.tarifaHoraAdicional}
            label="Tarifa con hora adicional"
            placeholder="Introduzca la Tarifa con hora adicional"
            name="tarifaHoraAdicional"
            error={formik.touched.tarifaHoraAdicional && formik.errors.tarifaHoraAdicional ? (<div className="text-danger">{formik.errors.tarifaHoraAdicional}</div>) : null} />

          <CampoFormulario
            controlId="tarifaConAyudante"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.tarifaConAyudante}
            label="Tarifa con ayudante"
            placeholder="Introduzca la Tarifa con ayudante"
            name="tarifaConAyudante"
            error={formik.touched.tarifaConAyudante && formik.errors.tarifaConAyudante ? (<div className="text-danger">{formik.errors.tarifaConAyudante}</div>) : null} />

          <CampoFormulario
            controlId="tarifaSpot"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.tarifaSpot}
            label="Tarifa Spot"
            placeholder="Introduzca la Tarifa con ayudante"
            name="tarifaSpot"
            error={formik.touched.tarifaSpot && formik.errors.tarifaSpot ? (<div className="text-danger">{formik.errors.tarifaSpot}</div>) : null} />


        </div>

        <div className='mt-5 d-flex justify-content-end'>
          <Button variant="custom" type="submit" className='me-2' onClick={values => setFormState(values)}>Guardar <i className="fa-solid fa-plus"></i></Button>
          <Button variant="outline-secondary" type="button" className='me-2' onClick={() => { limpiarFormulario() }}>Nuevo <i className="fas fa-plus"></i></Button>
          <Button variant="outline-secondary" type="button" className='me-2' onClick={() => navigate(rutaServidor + "/Cliente/CatalogoCliente")}>Regresar <i className="fas fa-arrow-left"></i></Button>
        </div>
      </div>
    </Form>
  );
}

const CampoFormulario = (prop) => {

  return (
    <div className='col col-sm-6 mt-2'>
      <Form.Group controlId={prop.controlId}>
        <Form.Label>{prop.label}</Form.Label>
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