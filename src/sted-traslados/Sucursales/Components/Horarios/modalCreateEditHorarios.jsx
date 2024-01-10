import React, { useState, useEffect } from 'react';
import API from '../../../../store/api';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useFormik } from 'formik';
import * as Yup from "yup";
import Swal from 'sweetalert2';
//import { Calendar } from 'primereact/calendar';

export default function ModalCreateEditHorarios({id}) {
  const [horarios, setHorarios] = useState({})
  const [diasDD, setDiasDD] = useState([])

  useEffect(()=>{
    if(id !== 0) getHorariosById(id)
  },[]);

  useEffect(() => { getDiasDropdown() }, [])

  const getHorariosById = async (idHorario) => {
      
      const response = await API.get(`Horarios/${idHorario}`) 
      console.log("HorarioID",response.data)
      splitDateAndHourToEdit(response.data, idHorario)
      //setValuesToEdit(response.data)   
      setHorarios(response.data);
  }

  //const setValuesToEdit = (data) => formik.setValues(data);
  
  const splitDateAndHourToEdit = (data, idHorario) => {
    
    const splitArray = []
    splitArray.push(data)
    const horarioFiltro = splitArray.find(horarios => horarios.idHorario === idHorario)
    const horaE = String(horarioFiltro.horaInicio).split(':')[0]
    const minutoE = String(horarioFiltro.horaInicio).split(':')[1]
    const horaF = String(horarioFiltro.horaFin).split(':')[0]
    const minutof = String(horarioFiltro.horaFin).split(':')[1]
    
    formik.setFieldValue("idDia", data.idDia)
    formik.setFieldValue("horaE", horaE)
    formik.setFieldValue("minutoE", minutoE)
    formik.setFieldValue("horaF", horaF)
    formik.setFieldValue("minutof", minutof)
    formik.setFieldValue("activa", data.activo)

  }

  const getDiasDropdown = async () => {
    const response = await API.get("Dias")
    setDiasDD(response.data)
  }

  const diasOptions = diasDD.map(s => ({
    value: s.idDia,
    label: s.descripcion
  }));
  
  const validationSchema = Yup.object().shape({
    idHorario: Yup.number().required("Este campo es requerido"),
    idDia: Yup.number().required("Este campo es requerido"),
    horaE: Yup.number()
              .min(0, "El valor mínimo es 0")
              .max(23, "El valor mínimo es 23")
              .required("Este campo es requerido"),
    minutoE: Yup.number()
                .min(0,"El valor mínimo es 0")
                .max(59,"El valor mínimo es 59")
                .required("Este campo es requerido"),
    horaF: Yup.number()
              .min(0, "El valor mínimo es 0")
              .max(23, "El valor mínimo es 23")
              .required("Este campo es requerido"),
    minutoF: Yup.number()
                .min(0,"El valor mínimo es 0")
                .max(59,"El valor mínimo es 59")
                .required("Este campo es requerido"),
    activo: Yup.boolean().required("Este campo es requerido"),
  })

  const formik = useFormik({
    initialValues: {
      idHorario: 0,
      idDia: 0,
      horaE: 0,
      minutoE: 0,
      horaF: 0,
      minutoF: 0,
      activo: false
    },
    validationSchema: validationSchema,
    Form,
    onSubmit:(values) => {
      let nuevoHorario ={
        idHorario: id,
        idDia: values.idDia,
        horaE: values.horaE,
        minutoE: values.minutoE,
        horaF: values.horaF,
        minutoF: values.minutoF,
        activo: values.activo
      };
      nuevoHorario.idHorario > 0 ? handlerEditForm(nuevoHorario) : handlerSaveForm(nuevoHorario)
    }
  });

  const handlerEditForm = async (data) => {

    try {
      const saveData = await API.put(`Horarios/${data.idHorario}`, data);
      if(saveData.status === 200 || saveData.status === 204){
        Swal.fire({
          title: "Modificando!",
          text: "El registro ha sido modificado exitosamente!",
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
        text: "Hubo un problema al modificar la información!",
        icon: 'error'
      })
    } catch (error) {
      return Swal.fire({
        title: "Error!",
        text: error.response.data,
        icon: 'error'
      })
    }
  }

  const handlerSaveForm = async (data) => {
    const { idHorario, activo, ...rest } = data
    try {
      const saveData = await API.post("Horarios", rest);
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
        text: error.message,
        icon: 'error'
      })
    }
  }

  return (
    <>
      <Form onSubmit={formik.handleSubmit} autoComplete='off'>
        {
          id !== 0 ?
          <div className='col col-sm-12 mt-1' hidden>
            <Form.Group className="mb-3" controlId="idHorario">
              <Form.Label>Horario ID</Form.Label>
              <Form.Control
                type="text"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.idHorario}
              />
              <Form.Text className="text-danger">
                  {formik.touched.idHorario && formik.errors.idHorario ? (<div className="text-danger">{formik.errors.idHorario}</div>) : null}
              </Form.Text>
            </Form.Group>
          </div>
          : <></>
        }

        <div className='col col-sm-12 mt-1'>
            <Form.Group controlId="idDia">
              <Form.Label>Dia:</Form.Label>
              <Form.Control as="select" 
              onChange={formik.handleChange} 
              onBlur={formik.handleBlur} 
              value={formik.values.idDia}>
                <option>Selecione el día</option>
                {diasOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
              </Form.Control>
              <Form.Text className="text-danger">
                  {formik.touched.idDia && formik.errors.idDia ? (<div className="text-danger">{formik.errors.idDia}</div>) : null}
              </Form.Text>
            </Form.Group>
          </div>

        <div className='row'>
          <div className='col col-sm-6 mt-1'>
            <Form.Group className="mb-3" controlId="horaE">
              <Form.Label>Hora Inicio</Form.Label>
              <Form.Control
                type="number"
                placeholder="Introduzca horas E"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.horaE}
              />
              <Form.Text className="text-danger">
                  {formik.touched.horaE && formik.errors.horaE ? (<div className="text-danger">{formik.errors.horaE}</div>) : null}
              </Form.Text>
            </Form.Group>
          </div>
          <div className='col col-sm-6 mt-1'>
            <Form.Group className="mb-3" controlId="minutoE">
              <Form.Label>Minuto Inicio</Form.Label>
              <Form.Control
                type="number"
                placeholder="Introduzca los minutos"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.minutoE}
              />
              <Form.Text className="text-danger">
                  {formik.touched.minutoE && formik.errors.minutoE ? (<div className="text-danger">{formik.errors.minutoE}</div>) : null}
              </Form.Text>
            </Form.Group>
          </div>
        </div>

        <div className='row'>
          <div className='col col-sm-6 mt-1'>
            <Form.Group className="mb-3" controlId="horaF">
              <Form.Label>Horas Final</Form.Label>
              <Form.Control
                type="number"
                placeholder="Introduzca el numero de horas E"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.horaF}
              />
              <Form.Text className="text-danger">
                  {formik.touched.horaF && formik.errors.horaF ? (<div className="text-danger">{formik.errors.horaF}</div>) : null}
              </Form.Text>
            </Form.Group>
          </div>
          <div className='col col-sm-6 mt-1'>
            <Form.Group className="mb-3" controlId="minutoF">
              <Form.Label>Minuto Final</Form.Label>
              <Form.Control
                type="number"
                placeholder="Introduzca el numero de unidades"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.minutoF}
              />
              <Form.Text className="text-danger">
                  {formik.touched.minutoF && formik.errors.minutoF ? (<div className="text-danger">{formik.errors.minutoF}</div>) : null}
              </Form.Text>
            </Form.Group>
          </div>
        </div>            
           
        <div className='col col-sm-12 mt-2' hidden={id === 0}>
          <Form.Group controlId="activa">
            <Form.Label>Activo:</Form.Label>
            <Form.Control as="select" 
            onChange={formik.handleChange} 
            onBlur={formik.handleBlur}
            value={formik.values.activa}
            >
              <option>--Seleccione--</option>
              <option value={true}>Activo</option>
              <option value={false}>Inactivo</option>
            </Form.Control>
            <Form.Text className="text-danger">
                {formik.touched.activa && formik.errors.activa ? (<div className="text-danger">{formik.errors.activa}</div>) : null}
            </Form.Text>
          </Form.Group>
        </div>: <></>          

        <div className='mt-2 d-flex justify-content-end'>
            <Button variant="custom" type="submit">Guardar</Button>
        </div>
      </Form>
    </>
  );
}
