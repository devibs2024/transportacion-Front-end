import { useFormik } from "formik";
import * as Yup from "yup";
import React, { useEffect, useState } from "react";
import { Form, Select, Button } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useGetTipoVehiculos } from "../../../hooks/useGetTipoVehiculos";
import { useGetModelos } from "../../../hooks/useGetModelos";
import { postVehiculo } from "../../../store/slices/thunks/vehiculoThunks";

export function FormularioVehiculo() {
  const [formState, setFormState] = useState(true);
  const [selectedValue, setSelectedValue] = useState("");

  const dispatch = useDispatch();

  const tipoVehiculos = useGetTipoVehiculos();
  const modelos = useGetModelos();

  const tipoVehiculoOptions = tipoVehiculos.map((tipoVehiculo) => ({
    value: tipoVehiculo.idTipoVehiculo,
    label: tipoVehiculo.nombreTipoVehiculo,
  }));

  const modeloOptions = modelos.map((modelo) => ({
    value: modelo.idModelo,
    label: modelo.nombreModelo,
  }));

  const form = useFormik({
    initialValues: {
      marca: "",
      tipoVehiculo: "",
      modelo: "",
      tarifa: "",
    },
    validationSchema: Yup.object({
      marca: Yup.string().required("Este campo es obligatorio"),
      tipoVehiculo: Yup.string().required("Este campo es obligatorio"),
      modelo: Yup.string().required("Este campo es obligatorio"),
      tarifa: Yup.string().required("Este campo es obligatorio"),
    }),
    onSubmit: (values) => {
      const vehiculo = {
        marca: values.marca,
        tipoVehiculo: values.tipoVehiculo,
        modelo: values.modelo,
        tarifa: values.tarifa,
      };

      dispatch(postVehiculo(vehiculo));
    },
  });

  return (
    <Form onSubmit={form.handleSubmit}>
      <div className="mt-3">
        <div className="row">
          <CampoFormulario
            controlId="marca"
            onChange={form.handleChange}
            onBlur={form.handleBlur}
            value={form.values.nombre}
            label="Marca"
            placeholder="Introduzca la Marca"
            name="marca"
            error={
              form.touched.marca && form.errors.marca ? (
                <div className="text-danger">{form.errors.marca}</div>
              ) : null
            }
          />
          <div className="col col-sm-6 mt-1">
            <Form.Group controlId="tipoVehiculo">
              <Form.Label>Tipo Vehiculo:</Form.Label>
              <Form.Control
                as="select"
                value={form.values.estado}
                onChange={form.handleChange}
                onBlur={form.handleBlur}
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
            <Form.Group controlId="modelos">
              <Form.Label>Modelos:</Form.Label>
              <Form.Control
                as="select"
                value={form.values.municipio}
                onChange={form.handleChange}
                onBlur={form.handleBlur}
              >
                <option value="">Seleccione el Modelo</option>
                {modeloOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </div>
          <CampoFormulario
            controlId="tarifa"
            onChange={form.handleChange}
            onBlur={form.handleBlur}
            value={form.values.tarifa}
            label="Tarifa"
            placeholder="Introduzca la Tarifa"
            name="tarifa"
            error={
              form.touched.tarifa && form.errors.tarifa ? (
                <div className="text-danger">{form.errors.tarifa}</div>
              ) : null
            }
          />
        </div>
        <div className="mt-2 d-flex justify-content-end">
          <Button
            variant="success ms-auto"
            type="submit"
            onClick={(values) => setFormState(values)}
          >
            Guardar
          </Button>
        </div>
      </div>
    </Form>
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
        />
        <Form.Text className="text-danger">{prop.error}</Form.Text>
      </Form.Group>
    </div>
  );
};
