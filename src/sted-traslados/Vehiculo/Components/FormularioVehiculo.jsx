import { useFormik } from "formik";
import * as Yup from "yup";
import React, { useEffect, useState } from "react";
import { Form, Select, Modal, Button } from "react-bootstrap";
import { useGetTipoVehiculos } from "../../../hooks/useGetTipoVehiculos";
import API from "../../../store/api";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useNavigate } from 'react-router';
import { useLocation } from 'react-router-dom';
import { accionExitosa, accionFallida, confirmarAccion } from '../../../shared/Utils/modals';
import { rutaServidor } from "../../../routes/rutaServidor";
import { procesarErrores } from '../../../shared/Utils/procesarErrores';
import ReactInputMask from 'react-input-mask';

export function FormularioVehiculo({ setVehiculo, vehiculo }) {


  const [idVehiculo, setIdVehiculo] = useState(0);
  const MySwal = withReactContent(Swal);
  const navigate = useNavigate();
  const location = useLocation();

  const [formState, setFormState] = useState(true);
  const [selectedValue, setSelectedValue] = useState("");
  const [marcaVehiculosOptions, setMarcaVehiculosOptions] = useState([]);
  const [modeloVehiculosOptions, setModeloVehiculosOptions] = useState([]);
  const [tarifa, setTarifa] = useState();
  
  useEffect(() => {
    if (location.state?.vehiculo) {

      formik.setValues(location.state.vehiculo)

      setIdVehiculo(location.state.vehiculo.idVehiculo);
      setVehiculo(location.state.vehiculo)

      getMarcaByIdTipoVehiculo(location.state.vehiculo.idVehiculo);
      getTarifaTipoVehiculo(location.state.vehiculo.idVehiculo);

      getModeloByIdMarca(location.state.vehiculo.idMarcaVehiculo);

    } else if (vehiculo.idVehiculo != 0) {
      formik.setValues(vehiculo)
    }
  }, []);


  const updateVehiculo = (updatedCoordinador) => {
    setVehiculo((prevCoordinador) => ({
      ...prevCoordinador,
      ...updatedCoordinador
    }));
  };
  const limpiarFormulario = () => {
    formik.resetForm();

    setIdVehiculo(0);

    setVehiculo({
      idVehiculo: 0,
      nombreVehiculo: "",
      idMarcaVehiculo: "",
      idTipoVehiculo: "",
      idModeloVehiculo: "",
      emisionVehiculo: "",
      vehiculoEmpresa: true,
    });

  }

  const tipoVehiculoOptions = useGetTipoVehiculos().map((tipoVehiculo) => ({
    value: tipoVehiculo.idTipoVehiculo,
    label: tipoVehiculo.tipoVehiculo,
  }));

  const getMarcaByIdTipoVehiculo = async (idTipoVehiculo) => {

    const response = await API.get(`MarcaVehiculo/${idTipoVehiculo}`);

    if (response.status == 200 || response.status == 204) {

      let data = response.data.map((data) => ({
        value: data.idMarca,
        label: data.marca
      }));
      
      setMarcaVehiculosOptions(data)
    }
  }

  const getTarifaTipoVehiculo = async (idTipoVehiculo) => {

    const response = await API.get(`TarifaTipoVehiculo/${idTipoVehiculo}`);

    if (response.status == 200 || response.status == 204) {

      console.log(response.data);

      // let data = response.data.filter(x => x.tipoVehiculos.idTipoVehiculo == idTipoVehiculo && x.principal == true && x.activa == true).map((data) => ({
      //   value: data.tarifa
      // }));
   

    //   console.log('data', data);
       setTarifa(response.data.tarifa);

    }

  };
  const getModeloByIdMarca = async (idMarca) => {

    const response = await API.get(`ModeloVehiculo/IdMarca?IdMarca=${idMarca}`);

    if (response.status == 200 || response.status == 204) {

      let data = response.data.map((data) => ({
        value: data.idModelo,
        label: data.modelo
      }));
      setModeloVehiculosOptions(data)
    }
  }

  const onChangeTipoVehiculo = (event) => {

    formik.handleChange(event);

    const idTipoVehiculo = document.getElementById('idTipoVehiculo').value;

    console.log(idTipoVehiculo)

    getMarcaByIdTipoVehiculo(idTipoVehiculo);
    getTarifaTipoVehiculo(idTipoVehiculo);

  }

  const onChangeMarca = (event) => {

    formik.handleChange(event);

    const idMarcaVehiculo = document.getElementById('idMarcaVehiculo').value;

    getModeloByIdMarca(idMarcaVehiculo);
  }

  const getInitialValues = () => {

    //  if (location.state?.operador) return location.state?.operador
    //  if (operador.idEmpleado != 0) return operador
    return {
      nombreVehiculo: "",
      idMarcaVehiculo: "",
      idTipoVehiculo: "",
      idModeloVehiculo: "",
      emisionVehiculo: "",
      tarifa: 0
    }
  }

  const formik = useFormik({
    initialValues: getInitialValues(),
    validationSchema: Yup.object({
      nombreVehiculo: Yup.string().required("Este campo es obligatorio"),
    //  idMarcaVehiculo: Yup.string().required("Este campo es obligatorio"),
    //  idTipoVehiculo: Yup.string().required("Este campo es obligatorio"),
    //  idModeloVehiculo: Yup.string().required("Este campo es obligatorio"),
      emisionVehiculo: Yup.string().required("Este campo es obligatorio"),
    }),
    Form,
    onSubmit: (values) => {
      let vehiculo = {
        idVehiculo: idVehiculo,
        nombreVehiculo: values.nombreVehiculo,
        idMarcaVehiculo: values.idMarcaVehiculo,
        idTipoVehiculo: values.idTipoVehiculo,
        idModeloVehiculo: values.idModeloVehiculo,
        emisionVehiculo: values.emisionVehiculo,
        vehiculoEmpresa: values.vehiculoEmpresa,
        tarifa: values.tarifa,
      };


      console.log(vehiculo);

      postOrPutVehiculo(vehiculo);

    },
  });


  const postOrPutVehiculo = async (vehiculo) => {

    try {
      let response;

      if (idVehiculo == 0) {

        response = await API.post("Vehiculos", vehiculo);

        if (response.status == 200 || response.status == 204) {

          setIdVehiculo(response.data);

          updateVehiculo({
            idVehiculo: response.data,
            nombreVehiculo: vehiculo.nombreVehiculo,
            idMarcaVehiculo: vehiculo.idMarcaVehiculo,
            idTipoVehiculo: vehiculo.idTipoVehiculo,
            idModeloVehiculo: vehiculo.idModeloVehiculo,
            emisionVehiculo: vehiculo.emisionVehiculo,
            vehiculoEmpresa: vehiculo.vehiculoEmpresa,
            tarifa: vehiculo.tarifa,
          });

          accionExitosa({ titulo: 'Vehículo Agregado', mensaje: ' ¡El Vehículo ha sido creado satisfactoriamente!' });

        } else {
          accionFallida({ titulo: 'El Vehículo no puedo se Agregado', mensaje: '¡Ha ocurrido un error al intentar agregar el vehículo!' });
          updateVehiculo({ idVehiculo: response.data })
        }
      } else {

        try {
          response = await API.put(`Vehiculos/${idVehiculo}`, vehiculo);

          if (response.status == 200 || response.status == 204) {
            accionExitosa({ titulo: 'Vehículo Actualizado', mensaje: ' ¡El vehículo ha sido creado satisfactoriamente!' });

            console.log(idVehiculo);
            updateVehiculo({
              idVehiculo: idVehiculo,
              nombreVehiculo: vehiculo.nombreVehiculo,
              idMarcaVehiculo: vehiculo.idMarcaVehiculo,
              idTipoVehiculo: vehiculo.idTipoVehiculo,
              idModeloVehiculo: vehiculo.idModeloVehiculo,
              emisionVehiculo: vehiculo.emisionVehiculo,
              vehiculoEmpresa: vehiculo.vehiculoEmpresa,
              tarifa: vehiculo.tarifa,
            });



          } else {
            accionFallida({ titulo: 'El Vehículo no puedo se Agregado', mensaje: '¡Ha ocurrido un error al intentar agregar el vehículo!' });
            updateVehiculo({ idVehiculo: response.data })
          }
        } catch (e) {

          let errores = e.response.data;

          accionFallida({ titulo: 'El Vehículo no puedo se Agregado', mensaje: procesarErrores(errores) });
        }

      }
    } catch (e) {
      let errores = e.response.data;

      accionFallida({ titulo: 'El Vehículo no puedo se Agregado', mensaje: procesarErrores(errores) });
    }

  }
  return (
    <>
      <Form onSubmit={formik.handleSubmit}>
        <div className="mt-3">
          <div className="row">
            <div className="col col-sm-6 mt-1">
              <Form.Group controlId="nombreVehiculo">
                <Form.Label>Placa:</Form.Label>
                <ReactInputMask
                  className="form-control"
                  mask="aaa-99-99"
                  placeholder="Introduzca la Placa"
                  value={formik.values.nombreVehiculo.toUpperCase()}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  name="nombreVehiculo"
                />
                <Form.Text className="text-danger">
                  {formik.touched.nombreVehiculo && formik.errors.nombreVehiculo && (
                    <div className="text-danger">{formik.errors.nombreVehiculo}</div>
                  )}
                </Form.Text>
              </Form.Group>
            </div>

            <CampoFormulario
              controlId="emisionVehiculo"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.emisionVehiculo}
              label="Emision Vehiculo"
              placeholder="Introduzca el Año del Vehiculo"
              name="emisionVehiculo"
              error={
                formik.touched.emisionVehiculo && formik.errors.emisionVehiculo ? (
                  <div className="text-danger">{formik.errors.emisionVehiculo}</div>
                ) : null
              }
            />
            <div className="col col-sm-6 mt-1">
              <Form.Group controlId="idTipoVehiculo" >
                <Form.Label>Tipo Vehiculo:</Form.Label>
                <Form.Control
                  as="select"
                  value={formik.values.idTipoVehiculo}
                  onChange={onChangeTipoVehiculo}
                  onBlur={formik.handleBlur}
                >
                  <option value="">Seleccione el Tipo Vehiculo</option>
                  {tipoVehiculoOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            </div>
            <div className="col col-sm-6 mt-1">
              <Form.Group controlId="idMarcaVehiculo">
                <Form.Label>Marca:</Form.Label>
                <Form.Control
                  as="select"
                  value={formik.values.idMarcaVehiculo}
                  onChange={onChangeMarca}
                  onBlur={formik.handleBlur}
                >
                  <option value="">Selecciona la Marca</option>
                  {marcaVehiculosOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            </div>

            <div className="col col-sm-6 mt-1">
              <Form.Group controlId="idModeloVehiculo">
                <Form.Label>Modelos:</Form.Label>
                <Form.Control
                  as="select"
                  value={formik.values.idModeloVehiculo}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                >
                  <option value="">Seleccione el Modelo</option>
                  {modeloVehiculosOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>

            </div>

            <CampoFormulario
              controlId="tarifa"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={tarifa}
              disabled={true}
              label="Tarifa"
              placeholder=""
              name="tarifa"
              error={
                formik.touched.tarifa && formik.errors.tarifa ? (
                  <div className="text-danger">{formik.errors.tarifa}</div>
                ) : null
              }
            />

            <Form.Check
              controlId="vehiculoEmpresa"
              type="switch"
              label="Vehiculo Empresa"
              checked={formik.values.vehiculoEmpresa}
              onChange={() => { formik.setFieldValue('vehiculoEmpresa', !formik.values.vehiculoEmpresa) }}
              className='mx-3'
            />
          </div>
          <div className='mt-3 d-flex justify-content-end'>
            <Button variant="custom" type="submit" className='me-2' onClick={values => setFormState(values)}> Guardar <i className="fa-solid fa-plus"></i></Button>
            <Button variant="outline-secondary" type="button" className='me-2' onClick={() => { limpiarFormulario() }}>Nuevo <i className="fas fa-plus"></i></Button>
            <Button variant="outline-secondary" type="button" className='me-2' onClick={() => navigate(rutaServidor + "/vehiculos/CatalogoVehiculos")}>Regresar <i className="fas fa-arrow-left"></i></Button>
          </div>
        </div>
      </Form>
    </>
  );
}

const CampoFormulario = (prop) => {
  return (
    <div className="col col-sm-6 mt-1">
      <Form.Group controlId={prop.controlId}>
        <Form.Label>{prop.label}</Form.Label>
        <Form.Control
          type="text"
          placeholder={prop.placeholder}
          onChange={prop.onChange}
          onBlur={prop.onBlur}
          value={prop.value}
          disabled={prop.disabled}
        />
        <Form.Text className="text-danger">{prop.error}</Form.Text>
      </Form.Group>
    </div>
  );
};
