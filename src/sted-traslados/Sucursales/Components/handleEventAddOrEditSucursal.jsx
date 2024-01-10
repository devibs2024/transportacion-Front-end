import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useFormik } from 'formik';
import API from '../../../store/api';
import * as Yup from "yup";
import { accionExitosa, accionFallida, confirmarAccion } from '../../../shared/Utils/modals';

export default function ModalCreateEditSucursal({id}) {
  const [sucursal, setSucursal] = useState({})
  const [zonaDD, setZonaDD] = useState([])

  useEffect(()=>{
    if(id !== 0) getSucursalById(id)
  },[]);

  useEffect(() => { getZonaDropdown()}, [])

  const getSucursalById = async () => {
      const response = await API.get(`Sucursal/${id}`) 
      setValuesToEdit(response.data)   
      setSucursal(response.data);
  }

  const setValuesToEdit = (data) => formik.setValues(data);
  
  const getZonaDropdown = async () => {
    const response = await API.get("Zonas")
    setZonaDD(response.data)
  }

  const zonasOptions = zonaDD.map(s => ({
    value: s.idZona,
    label: s.claveDET
  }));
  
  const validationSchema = Yup.object().shape({
    nombreSucursal: Yup.string().required("Este campo es requerido"),
    idZona: Yup.string().required("Este campo es requerido"),
    tarifa: Yup.number().min(0, "El minimo es 0").required("Este campo es requerido"),
    tarifaDescanso: Yup.number().min(0, "El minimo es 0").required("Este campo es requerido"),
    numUnidades: Yup.number().min(0, "El minimo es 0").required("Este campo es requerido"),
    unidadesMaximas: Yup.number().min(0, "El minimo es 0").required("Este campo es requerido"),
  })

  const formik = useFormik({
    initialValues: {
      idSucursal: 0,
      nombreSucursal: "",
      idZona: "",
      activa: false,
      estatus: "",
      tarifa: 0,
      tarifaDescanso: 0,
      numUnidades: 0,
      unidadesMaximas: 0
    },
    validationSchema: validationSchema,
    Form,
    onSubmit:(values) => {
      let nuevaSucursal = {
        idSucursal: id,
        nombreSucursal: values.nombreSucursal,
        idZona: values.idZona,
        activa: values.activa,
        estatus: values.estatus,

        tarifa: values.tarifa,
        tarifaDescanso: values.tarifaDescanso,
        numUnidades: values.numUnidades,
        unidadesMaximas: values.unidadesMaximas
      };
      nuevaSucursal.idSucursal > 0 ? handlerEditForm(nuevaSucursal) : handlerSaveForm(nuevaSucursal)
    }
  });

  const handlerEditForm = async (data) => {
    debugger
    data.activa = JSON.parse(data.activa)
    const { estatus, ...rest } = data
    try {
      confirmarAccion({titulo: "Modificando", mensaje: "Desea modificar la sucursal?"}).then(async (response) => {
        if(response.isConfirmed) {  
          const saveData = await API.put(`Sucursal/${data.idSucursal}`, rest);
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
    debugger
    const { idSucursal, activa, estatus, ...rest } = data
    try {
    confirmarAccion({titulo: "Guardando", mensaje: "Desea guardar la sucursal?"}).then(async (response) => {
      if(response.isConfirmed) {  
        const saveData = await API.post("Sucursal", rest);
        if(saveData.status === 200 || saveData.status === 204){
          accionExitosa({titulo: "Guardado", mensaje: "El registro ha sido creado exitosamente!"}).then(resp=>{
            if(resp.isConfirmed){
              formik.resetForm()
              window.location.reload()
            }
          })
        }
      }else {
        accionFallida({titulo: "Cancelado", mensaje: "Se cancelo la inserción"})
      }
    })
    }catch(error) {
      return accionFallida({titulo: "Error", mensaje: "Ha ocurrido un error al tratar de guardar el registro. " + error.message})
    }  
  }

  return (
    <>
      <Form onSubmit={formik.handleSubmit} autoComplete='off'>
        {
          id !== 0 ?
          <div className='col col-sm-12 mt-1' hidden>
            <Form.Group className="mb-3" controlId="idSucursal">
              <Form.Label>Sucursal ID</Form.Label>
              <Form.Control
                type="text"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.idSucursal}
              />
              <Form.Text className="text-danger">
                  {formik.touched.idSucursal && formik.errors.idSucursal ? (<div className="text-danger">{formik.errors.idSucursal}</div>) : null}
              </Form.Text>
            </Form.Group>
          </div>
          : <></>
        }
        <div className='row'>
          <div className='col col-sm-6 mt-1'>
            <Form.Group className="mb-3" controlId="nombreSucursal">
              <Form.Label>Nombre Sucursal</Form.Label>
              <Form.Control
                type="text"
                placeholder="Introduzca el nombre de la sucursal"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.nombreSucursal}
              />
              <Form.Text className="text-danger">
                  {formik.touched.nombreSucursal && formik.errors.nombreSucursal ? (<div className="text-danger">{formik.errors.nombreSucursal}</div>) : null}
              </Form.Text>
            </Form.Group>
          </div>
          <div className='col col-sm-6 mt-1'>
            <Form.Group controlId="idZona">
              <Form.Label>Zona:</Form.Label>
              <Form.Control as="select" 
              onChange={formik.handleChange} 
              onBlur={formik.handleBlur} 
              value={formik.values.idZona}>
                <option>Selecione La sucursal</option>
                {zonasOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
              </Form.Control>
              <Form.Text className="text-danger">
                  {formik.touched.idZona && formik.errors.idZona ? (<div className="text-danger">{formik.errors.idZona}</div>) : null}
              </Form.Text>
            </Form.Group>
          </div>
        </div>
        
        {/*Campos Montos*/}
        <div className='row'>
          <div className='col col-sm-6 mt-1'>
            <Form.Group className="mb-3" controlId="tarifa">
              <Form.Label>Tarifa</Form.Label>
              <Form.Control
                type="number"
                min={0}
                placeholder="Introduzca la tarifa"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.tarifa}
              />
              <Form.Text className="text-danger">
                  {formik.touched.tarifa && formik.errors.tarifa ? (<div className="text-danger">{formik.errors.tarifa}</div>) : null}
              </Form.Text>
            </Form.Group>
          </div>
          
          <div className='col col-sm-6 mt-1'>
            <Form.Group className="mb-3" controlId="tarifaDescanso">
              <Form.Label>Tarifa Descanso</Form.Label>
              <Form.Control
                type="number"
                min={0}
                placeholder="Introduzca la tarifa de descanso"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.tarifaDescanso}
              />
              <Form.Text className="text-danger">
                  {formik.touched.tarifaDescanso && formik.errors.tarifaDescanso ? (<div className="text-danger">{formik.errors.tarifaDescanso}</div>) : null}
              </Form.Text>
            </Form.Group>
          </div>
        </div>  

        <div className='row'>        
          <div className='col col-sm-6 mt-1'>
            <Form.Group className="mb-3" controlId="numUnidades">
              <Form.Label>Numero Unidades</Form.Label>
              <Form.Control
                type="number"
                placeholder="Introduzca el numero de unidades"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.numUnidades}
              />
              <Form.Text className="text-danger">
                  {formik.touched.numUnidades && formik.errors.numUnidades ? (<div className="text-danger">{formik.errors.numUnidades}</div>) : null}
              </Form.Text>
            </Form.Group>
          </div>

          <div className='col col-sm-6 mt-1'>
            <Form.Group className="mb-3" controlId="unidadesMaximas">
              <Form.Label>Unidades Maximas</Form.Label>
              <Form.Control
                type="number"
                min={0}
                placeholder="Núm. Unidades Spot Max"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.unidadesMaximas}
              />
              <Form.Text className="text-danger">
                  {formik.touched.unidadesMaximas && formik.errors.unidadesMaximas ? (<div className="text-danger">{formik.errors.unidadesMaximas}</div>) : null}
              </Form.Text>
            </Form.Group>
          </div>
        </div>          
        {id !== 0 ?
          <div className='col col-sm-12 mt-2'>
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
        }
        {/* {id !== 0 ?
        <div className='col col-sm-12 mt-1'>
          <Form.Group className="mb-3" controlId="estatus">
            <Form.Label>Estatus</Form.Label>
            <Form.Control
              type="text"
              placeholder="Introduzca el estatus"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.estatus}
            />
            <Form.Text className="text-danger">
                {formik.touched.estatus && formik.errors.estatus ? (<div className="text-danger">{formik.errors.estatus}</div>) : null}
            </Form.Text>
          </Form.Group>
        </div>
        : <></>} */}
        <div className='mt-2 d-flex justify-content-end'>
            <Button variant="custom" type="submit">Guardar</Button>
        </div>
      </Form>
    </>
  );
}
