import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useFormik } from 'formik';
import API from '../../../store/api';
import * as Yup from "yup";
import { confirmarAccion, accionFallida, accionExitosa } from '../../../shared/Utils/modals';

export default function ModalCreateEditZona({id}) {
  const [zona, setZonas] = useState({})
  const [tipoZona, setTipoZonas] = useState([])
  const [dropDowmValue, setDropDowmValue] = useState([])

  useEffect(()=>{
    if(id !== 0){
      getZonasById(id)
    }
  },[]);

  useEffect(()=>{
    getStatusOptions()
    getTipoZonas()
  },[])

  const getZonasById = async () => {
      const response = await API.get(`Zonas/${id}`)
      setValuesToEdit(response.data)
      setZonas(response.data);
  }
  const getTipoZonas = async () => {
    try{
      const response = await API.get(`TipoZonas`)
      if(response.status === 200 || response.status === 204){
        setTipoZonas(response.data)
      }
    }catch(error){
      accionFallida({titulo:"Error!", mensaje: `Hubo un error al obtener el tipo de zona. ${error.message}`})
    }
  }
  const tipoZonaOptions = tipoZona.map(t=> ({
    text: t.descripcionTipoZona,
    value: t.idTipoZona
  }))
  const getStatusOptions = () => {
    const statusOptions = [
      { Text: "Activo", Value: true },
      { Text: "Inactivo", Value: false }  
    ]
    setDropDowmValue(statusOptions);
  }

  const statusOptions = dropDowmValue.map(s => ({
    text: s.Text,
    value: s.Value
  }));

  const setValuesToEdit = (data) => formik.setValues(data)

  const validationSchema = Yup.object().shape({
    claveDET: Yup.string().required("Este campo es requerido"),
    idTipoZona: Yup.number().required("Este campo es requerido"),
    estado: Yup.boolean().required("Este campo es requerido")
  })

  const formik = useFormik({
    initialValues: {
      idZona: 0,
      claveDET: "",
      idTipoZona: 0,
      estado: false
    },
    validationSchema: validationSchema,
    Form,
    onSubmit:(values) => {
      let nuevaZona ={
        idZona: id,
        claveDET: values.claveDET,
        idTipoZona: values.idTipoZona,
        estado: values.estado
      };
      nuevaZona.idZona > 0 ? handlerEditForm(nuevaZona) : handlerSaveForm(nuevaZona)
    }
  });

  const handlerEditForm = async (data) => {
      const { estado } = data
      data.estado = JSON.parse(estado);

      try {
        confirmarAccion({titulo: "Modificando", mensaje: "Desea modificar la zona?"}).then(async (response) => {
          if(response.isConfirmed) {  
            const saveData = await API.put(`Zonas/${data.idZona}`, data);
            if(saveData.status === 200 || saveData.status === 204){
              accionExitosa({titulo: "Modificado", mensaje: "El registro ha sido modificado exitosamente!"}).then((resp)=>{
                if(resp.isConfirmed){
                  formik.resetForm()
                  window.location.reload()
                }
              })
            }
          }else {
            accionFallida({titulo: "Cancelado", mensaje: "Se cancelo la modificación"})
          }
        })
      } catch (error) {
        return accionFallida({titulo: "Error", mensaje: "Ha ocurrido un error al tratar de modificar el registro." + error.message})
      }

      
  }

  const handlerSaveForm = async (data) => {
    const { idZona, estado, ...rest } = data
    try {
      confirmarAccion({titulo: "Guardando", mensaje: "Desea guardar la zona?"}).then(async (response) => {
        if(response.isConfirmed) {  
          const saveData = await API.post("Zonas", rest);
          if(saveData.status === 200 || saveData.status === 204){
            accionExitosa({titulo: "Guardado", mensaje: "El registro ha sido creado exitosamente!"}).then(response=>{
              if(response.isConfirmed){
                formik.resetForm()
                window.location.reload()
              }
            })
          }
        }else {
          accionFallida({titulo: "Cancelado", mensaje: "Se cancelo la inserción"})
        }
      })
    }
    catch(error) {
      return accionFallida({titulo: "Error", mensaje: "Ha ocurrido un error al tratar de guardar el registro." + error.message})
    }  
  }

  return (
    <>
      <Form onSubmit={formik.handleSubmit} autoComplete='off'>
        {
          id !== 0 ?
          <div className='col col-sm-12 mt-1' hidden>
            <Form.Group className="mb-3" controlId="idZona">
              <Form.Label>Zona ID</Form.Label>
              <Form.Control
                type="text"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.idZona}
              />
              <Form.Text className="text-danger">
                  {formik.touched.claveDET && formik.errors.claveDET ? (<div className="text-danger">{formik.errors.claveDET}</div>) : null}
              </Form.Text>
            </Form.Group>
          </div>
          : <></>
        }
        <div className='col col-sm-12 mt-1'>
          <Form.Group className="mb-3" controlId="claveDET">
            <Form.Label>Clave DET</Form.Label>
            <Form.Control
              type="text"
              placeholder="Introduzca la Clave DET"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.claveDET}
            />
            <Form.Text className="text-danger">
                {formik.touched.claveDET && formik.errors.claveDET ? (<div className="text-danger">{formik.errors.claveDET}</div>) : null}
            </Form.Text>
          </Form.Group>
        </div>
        <div className='col col-sm-12 mt-2'>
          <Form.Group controlId="idTipoZona">
            <Form.Label>Tipo Zona:</Form.Label>
            <Form.Control as="select" 
            onChange={formik.handleChange} 
            onBlur={formik.handleBlur} 
            value={formik.values.idTipoZona}>
              <option>Seleccione Tipo Zona</option>
              {tipoZonaOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                      {option.text}
                  </option>
              ))}
            </Form.Control>
            <Form.Text className="text-danger">
                {formik.touched.idTipoZona && formik.errors.idTipoZona ? (<div className="text-danger">{formik.errors.idTipoZona}</div>) : null}
            </Form.Text>
          </Form.Group>
        </div>
        { id > 0 ?
        <div className='col col-sm-12 mt-2'>
          <Form.Group controlId="estado">
            <Form.Label>Estado:</Form.Label>
            <Form.Control as="select" 
            onChange={formik.handleChange} 
            onBlur={formik.handleBlur}
            value={formik.values.estado}
            >
              <option>Selecione el estado</option>
              {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                      {option.text}
                  </option>
              ))}
            </Form.Control>
            <Form.Text className="text-danger">
                {formik.touched.estado && formik.errors.estado ? (<div className="text-danger">{formik.errors.estado}</div>) : null}
            </Form.Text>
          </Form.Group>
        </div> : <></>
        }
        <div className='mt-2 d-flex justify-content-center'>
            <Button variant="custom" type="submit">Guardar</Button>
        </div>
      </Form>
    </>
  );
}
