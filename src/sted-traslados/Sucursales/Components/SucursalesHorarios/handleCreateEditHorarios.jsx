import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useFormik } from 'formik';
import API from '../../../../store/api';
import * as Yup from "yup";
import Swal from 'sweetalert2';

export default function ModalCreateEditHorario({id}) { //Este id es el de la sucursal
  const [horarios, setHorarios] = useState([])
  const [sucursalDD, setSucursalDD] = useState([])

  useEffect(() => {
    getHorarios()
  },[]);

  useEffect(() => { 
    getSucursalesDropdown()
  }, [])

    const getSucursalesDropdown = async () => {
      const response = await API.get(`Sucursal`)
      setValuesToEdit(id)
      setSucursalDD(response.data)
    }
    const setValuesToEdit = (data) => formik.setFieldValue("idSucursal", data)

    const sucursalesOptions = sucursalDD.map(s => ({
        value: s.idSucursal,
        label: s.nombreSucursal
    }));
    
    const getHorarios = async () => {
        const response = await API.get(`Horarios`)  
        setHorarios(response.data);
    }
    
    const HorariosOptions = horarios.map(s => ({
        value: s.idHorario,
        label: `${s.descrDia} - ${s.horaInicio} - ${s.horaFin} `
    }));
    
    const validationSchema = Yup.object().shape({
        idHorario: Yup.number().required("Este campo es requerido"),
        idSucursal: Yup.number().required("Este campo es requerido")
    })

  const formik = useFormik({
    initialValues: {
      idHorario: 0,
      idSucursal: 0
    },
    validationSchema: validationSchema,
    Form,
    onSubmit:(values) => {
      let nuevaHorario ={
        idHorario: values.idHorario,
        idSucursal: values.idSucursal
      };

      handlerSaveForm(nuevaHorario)
    }
  });

  
  const handlerSaveForm = async (data) => {
    debugger
    try {
      if(data.idHorario === 0 || data.idSucursal === 0){
        Swal.fire({
            title: "Campos Obligatorios!",
            text: "Debe introducir el horario y la sucursal!",
            icon: 'error'
        })
        return null;
      }
      const saveData = await API.post("SucursalHorarios", data);
      if(saveData.status === 200 || saveData.status === 204){
        Swal.fire({
          title: "Guardado!",
          text: "El registro ha sido insertado exitosamente!",
          icon: 'success'
        }).then(value=>{
          if(value.isConfirmed){
            formik.resetForm()
            window.location.reload()
          }
        })
        return;
      }
      return Swal.fire({
        title: "Error!",
        text: "Hubo un problema al guardar la información!",
        icon: 'error'
      })
    } catch (error) {
      return Swal.fire({
        title: "Error!",
        text: `${error.response.data}`,
        icon: 'error'
      })
    }
  }

  return (
    <>
      <Form onSubmit={formik.handleSubmit} autoComplete='off'>
        
        <div className='col col-sm-12 mt-2'>
          <Form.Group controlId="idHorario">
            <Form.Label>Horario:</Form.Label>
            <Form.Control as="select" 
            onChange={formik.handleChange} 
            onBlur={formik.handleBlur} 
            value={formik.values.idHorario}>
              <option>Selecione el Horario</option>
              {HorariosOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                      {option.label}
                  </option>
              ))}
            </Form.Control>
            <Form.Text className="text-danger">
                {formik.touched.idHorario && formik.errors.idHorario ? (<div className="text-danger">{formik.errors.idHorario}</div>) : null}
            </Form.Text>
          </Form.Group>
        </div>
        
        <div className='col col-sm-12 mt-2'>
          <Form.Group controlId="idSucursal">
            <Form.Label>Sucursales:</Form.Label>
            <Form.Control as="select" 
            onChange={formik.handleChange} 
            onBlur={formik.handleBlur} 
            value={formik.values.idSucursal}
            disabled={id > 0}>
              <option>Selecione la sucursal</option>
              {sucursalesOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                      {option.label}
                  </option>
              ))}
            </Form.Control>
            <Form.Text className="text-danger">
                {formik.touched.idSucursal && formik.errors.idSucursal ? (<div className="text-danger">{formik.errors.idSucursal}</div>) : null}
            </Form.Text>
          </Form.Group>
        </div>

        <div className='mt-4 d-flex justify-content-end'>
            <Button variant="custom" type="submit">Guardar</Button>
        </div>
      </Form>
    </>
  );
}
