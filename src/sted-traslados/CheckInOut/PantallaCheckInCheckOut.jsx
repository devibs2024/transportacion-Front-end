import React, { useRef, useState, useEffect, useCallback, useContext } from "react";
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import Webcam from "react-webcam";
import API from "../../store/api";
import { accionExitosa, accionFallida, confirmarAccion } from "../../shared/Utils/modals";
import Form from 'react-bootstrap/Form';
import { Dropdown } from 'primereact/dropdown';

const imageCheckInLoaded = []
const imageCheckOutLoaded = []
let repetirImagen = "";
export const PantallaCheckInCheckOut = ({ title, setActiveIndex, activeIndex }) => {
  const webcamRef = useRef(null);
  const [showCamera, setShowCamera] = useState(false);
  const [capturing, setCapturing] = useState(false);
  const [idEmpleado, setIdEmpleado] = useState(0);
  const [seeCapture, setSeeCapture] = useState("");
  const [tiendasAsignadas, setTiendasAsignadas] = useState([]);
  const [allTiendas, setAllTiendas] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedAlltiendasOption, setAllTiendasSelectedOption] = useState(null);
  const [empleadoInfo, setEmpleadoInfo] = useState({});

  const [cameras, setCameras] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState(null);
  const [currentCamera, setCurrentCamera] = useState(0);

  useEffect(() => {
    if (activeIndex === 3) {
      tiendaAsignadasAEmpleado()
      getTiendas()

      fetchCameras();
    }
  }, [])

  useEffect(() => {
    getEmpleadosInfo()
  }, [])


  const fetchCameras = async () => {
    try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        setCameras(videoDevices);
    } catch (e) {
        console.error("Error fetching devices: ", e.message);
    }
}

const handleCameraChange = (e) => {
    setSelectedCamera(e.value);
}
    const switchCamera = () => {
        if (cameras.length > 1) {
            setCurrentCamera(prevCamera => (prevCamera + 1) % cameras.length);
        }
    }

const cameraOptions = cameras.map(device => ({ label: device.label, value: device.deviceId }));

  const TiendasAsignadasOptions = tiendasAsignadas.map(s => ({
    key: s.key,
    value: s.value
  }));

  const allStore = allTiendas.map(s => ({
    key: s.key,
    value: s.value
  }));

  const tokenDecode = () => {
    const token = JSON.parse(localStorage.getItem("user")).token;
    const tokenPart = token.split('.');
    const encodePayload = tokenPart[1];

    const decodePayload = atob(encodePayload)//Buffer.from(encodePayload,'base64').toString('utf8');//Buffer.from(encodePayload, 'base64').toString('utf-8');
    const { Id } = JSON.parse(decodePayload);
    setIdEmpleado(Id);
    return Id;
  }

  const tiendaAsignadasAEmpleado = async () => {
    try {
      const idEmpleado = tokenDecode();//operadorLogueado.idEmpleado;
      const tiendaEmpleado = await API.get(`CheckIn_CkechOut/empleadoTienda/empleadoId/${idEmpleado}`)
      setTiendasAsignadas(tiendaEmpleado.data)
    } catch (error) {
      accionFallida({ titulo: 'Errorewt!', mensaje: error.message })
    }
  }

  const getTiendas = async () => {
    try {
      const tiendas = await API.get(`CheckIn_CkechOut/GetAllTiendaEmpleado`)
      setAllTiendas(tiendas.data)
    } catch (error) {
      accionFallida({ titulo: 'Errorasdfas!', mensaje: error.message })
    }
  }

  const getEmpleadosInfo = async () => {
    try {
      const idEmpleado = tokenDecode()
      const empleadoInfo = await API.get(`CheckIn_CkechOut/empleadoInfo/empleadoId/${idEmpleado}`)
      setEmpleadoInfo(empleadoInfo.data)
    } catch (error) {
      accionFallida({ titulo: 'Error!', mensaje: error.message })
    }
  }

  const storeImagenes = (activeIndex, imageSrc) => {
    switch (activeIndex) {
      case 0:
      case 1:
      case 2:
      case 3:
        imageCheckInLoaded.push(imageSrc)
        break;
      case 4:
      case 5:
      case 6:
        imageCheckOutLoaded.push(imageSrc)
        break;
      default:
        console.log("No existe esta opción")
        break;
    }
  }

  const capture = () => {
    if (!webcamRef.current) return;
    setCapturing(true);
    const imageSrc = webcamRef.current.getScreenshot();
    setSeeCapture(imageSrc);
    repetirImagen = imageSrc;
  };

  const showWebcam = () => {
    setShowCamera(true);
  };

  const RepetirFoto = () => {
    setSeeCapture(null)
  }

  const nextStepCount = useCallback(() => {
    storeImagenes(activeIndex, repetirImagen)
    setActiveIndex(activeIndex => activeIndex + 1);
  }, []);

  const shouldComponentUpdate = useCallback((nextCount) => {
    if (activeIndex === nextCount) return false;

    return true;
  }, [activeIndex]);

  const MostrarImagen = () => {
    return (
      <Card title={title} className="mt-3"
        style={{ boxShadow: '1px 5px 9px #898989' }}>
        <div style={{ marginTop: '5px' }}>
          <center>
            <img src={seeCapture}
              style={{ width: '58%', height: '58%', margin: '0 0 10px 0' }}></img>
            <br />
            {
              //El activeIndex representa el numero de Step o pasos del checkin  ----  OJO
              activeIndex < 3 || (activeIndex >= 4 && activeIndex < 6)
                ? <Button
                  label="Siguiente Imagen"
                  style={{ margin: '0 10px 10px 0' }}
                  severity="info"
                  onClick={nextStepCount}
                /> : <></>
            }
            {activeIndex === 3 || activeIndex === 6 ? <Button label="Guardar Imagen" style={{ margin: '0 10px 10px 0' }} severity="info" onClick={HandleSave} /> : <></>}

            <Button label="Repetir Foto" style={{ marginBottom: '10px' }} severity="warning" onClick={RepetirFoto} />
          </center>
        </div>
      </Card>
    )
  }

  const SelectSucursal = () => {
    const handleSelectChange = (event) => {
      setSelectedOption(event.target.value);
    }

    const handleAllTiendasSelectChange = (event) => {
      if (!event.target.value) {
        setAllTiendasSelectedOption(selectedOption);
      } else {
        event.preventDefault();
        confirmarAccion({ titulo: 'Advertencia', mensaje: "Cambiar la tienda de ubicacion puede ocasionar multas. Desea continuar?" }).then((resp) => {
          if (resp.isConfirmed) {
            setAllTiendasSelectedOption(event.target.value);
            accionExitosa({ titulo: "Cambio de tienda!", mensaje: 'La tienda fue modificada' })
          }
          else {
            setAllTiendasSelectedOption(selectedOption);
          }
        })
      }
    }

    return (
      <center>
        <div className="row">
          <div className="col-2"></div>
          <div className="col-8">
            <strong><label>Tienda Asignada</label></strong>
            <div className="card flex justify-content-start" style={{ border: 'white' }}>
              <Form.Control as="select"
                id="tiendaAsignada"
                onChange={handleSelectChange}
                value={selectedOption}
                disabled={true}>
                {TiendasAsignadasOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.key}
                  </option>
                ))}
              </Form.Control>
            </div>
          </div>

          <div className="" hidden={true}>
            <strong><label>Tienda Actual</label></strong>
            <div className="card flex justify-content-end" style={{ border: 'white' }}>
              <Form.Control as="select"
                id="tiendaActual"
                onChange={handleAllTiendasSelectChange}
                value={selectedAlltiendasOption}
                disabled={false}>
                {allStore.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.key}
                  </option>
                ))}
              </Form.Control>
            </div>
          </div>
          <div className="col-2"></div>
        </div>
      </center>
    )
  }

  const CamaraPhotos = () => {
    return( 
        <Card title="Foto de CheckIn" className="flex justify-content-center align-items-center mt-5" style={{boxShadow: '1px 5px 9px #898989' }}>
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              style={{width: '100%', height: "100%", marginTop: '10px'}}
              screenshotQuality={2048}
              videoConstraints={{ deviceId: cameras[currentCamera]?.deviceId }} // Configuramos la cámara seleccionada aquí
            />
            <div style={{textAlign:'center', marginTop: '10px', borderColor:'white'}}>
                <Button icon="pi pi-refresh" size="large" style={{boxShadow: '1px 5px 9px #898989', marginRight: '10px'}} rounded severity="info" aria-label="Switch Camera" tooltip="Cambiar Cámara" onClick={switchCamera}/>
                <Button icon="pi pi-camera" size="large" style={{boxShadow: '1px 5px 9px #898989' }} rounded severity="info" aria-label="Camara" tooltip="Tomar Foto" onClick={capture}/>            
            </div>
        </Card>
    )
}

  const HandleSave = async () => {
    storeImagenes(activeIndex, repetirImagen);
    const idEmpleadoToken = tokenDecode()
    let isCheckInExist = false;
    let TiendaAsignada = undefined
    let TiendaActual = undefined;

    if (activeIndex < 4) {
      TiendaAsignada = document.getElementById("tiendaAsignada").value
      TiendaActual = document.getElementById("tiendaActual").value
    }

    try {
      //setcheckInImages(imageCheckInLoaded)
      const existCheckIn = await isACheckInOrCheckOut(idEmpleadoToken);
      const currentDate = isACurrentDate(existCheckIn.checkIn)
      isCheckInExist = existCheckIn.length > 0 && currentDate ? true : false;

      const CheckIn_CkechOut = {
        IdEmpleado: Number(idEmpleadoToken),
        idSucursal: Number(TiendaAsignada),
        idSucursalActual: Number(TiendaActual),
        //Se comento ya que referencia la imagenes creadas
        //Image: [] //seeCapture,
      }

      CheckIn_CkechOut.Image = activeIndex <= 3 ? imageCheckInLoaded : imageCheckOutLoaded;
      //const results = existCheckIn ? `Realizo un CHECK-IN en fecha y hora: ${existCheckIn.checkIn}. Desea hacer un CHECK-OUT?` : "Desea hacer un CHECK-IN?";

      let result = null;
      //Se quitaron los parametros de && (existCheckIn.checkOut_Photo_Path !== undefined || existCheckIn.checkOut_Photo_Path !== null) que refencian a la fotos
      if (isCheckInExist && (existCheckIn.checkOut !== undefined || existCheckIn.checkOut !== null)) {
        result = await confirmarAccion({
          titulo: "DESEA PROCEDER?",
          mensaje: "Desea guardar el registro?"
        })
      } else {
        result = await confirmarAccion({
          titulo: activeIndex <= 3 ? "OJO: Está apunto de hacer CHECK-IN!" : "OJO: Está apunto de hacer CHECK-OUT!",
          mensaje: activeIndex <= 3 ? "Desea guardar el CHECK-IN?" : "Desea guardar el CHECK-OUT?"
        })
      }

      if (result.isConfirmed) {

        const response = await API.post("CheckIn_CkechOut", CheckIn_CkechOut);

        jornadaTerminada(response.data)

        if (response.status === 200) {
          const success = await accionExitosa({ titulo: activeIndex === 3 ? 'CHECK-IN GUARDADO EXITOSAMENTE!' : 'CHECK-OUT GUARDADO EXITOSAMENTE!', mensaje: response.data.message + " para la fecha: " + Date.now() })
          if (success.isConfirmed) {

            if (activeIndex > 5) {
              localStorage.removeItem("stepActiveChkOut")
              const redirectToPrincipalPage = await accionExitosa({ titulo: 'Gracias!', mensaje: 'Sera re-dirigido a la pagina principal!' })

              if (redirectToPrincipalPage.isConfirmed) { window.location.reload() }
            }

            reiniciarPantalla();

            if (activeIndex <= 3) {
              localStorage.setItem("stepActiveChkOut", "4");
            }

            activeIndex <= 3 ? setActiveIndex(4) : setActiveIndex(0)
          }
        } else {
          const checkin = await accionFallida({ titulo: "Error", mensaje: "Se produjo un error al hacer CheckIn.! " + response.data.message })
          if (checkin.isConfirmed) {
            console.log("Dissmiss Confirmed")
          }
        }
      } else {
        const calceled = await (accionFallida({ titulo: "Información", mensaje: "Se cancelo el registro para hacer CheckIn. Vuelva a intentarlo!" }))
        if (calceled.isConfirmed) {
          console.log("Confirmed!")
        }
      }
    } catch (error) {
      accionFallida({ titulo: "Error", mensaje: `${error?.response?.status} - ${error?.response.data?.message}` })
    }
  }

  const jornadaTerminada = (resp) => {
    if (resp.jornadaFinalizada) {
      return accionFallida({
        titulo: 'JORNADA FINALIZADA',
        mensaje: resp.data.message
      })
    }
  }

  const isACurrentDate = (fecha) => {
    const fechaActual = new Date();

    const año = fechaActual.getFullYear();
    const mes = String(fechaActual.getMonth() + 1).padStart(2, '0');
    const dia = String(fechaActual.getDate()).padStart(2, '0');
    const fechaFormateada = `${año}/${mes}/${dia}`;

    if (fecha === fechaFormateada) return true;
    else return false;
  }

  const isACheckInOrCheckOut = async (idEmpleado) => {
    try {
      const existCheckinData = await API.get(`CheckIn_CkechOut/empleado/${idEmpleado}`);

      if (existCheckinData.data.length === 0) {
        return existCheckinData.data.data;
      }

      return false;

    } catch (error) {
      accionFallida({ titulo: "Error", mensaje: `${error?.response?.status} - ${error?.response.data?.message}` })
    }
  }

  const reiniciarPantalla = () => {
    setCapturing(false)
    setShowCamera(false)
    setSeeCapture(null)
    webcamRef.current = null
    setActiveIndex(0)
  }

  const ActivarCamara = () => {
    return (
      <Card title={title} className="mt-2 mb-5" style={{ boxShadow: '1px 5px 9px #898989', maxHeight: '80vh' }}>

        <div className="row">
          <div className="col-4">
            <InfoScreenEmployee />
          </div>
          <div style={{
                display: 'flex',
                alignItems: 'center'
          }} className="col-4">
            <Button style={{ backgroundColor: '#050A30' }} label= { (activeIndex  <= 3)  ? "Presione Para Fotos de Entrada" : "Presione Para Fotos de Salida" }  severity="info" onClick={showWebcam} />
          </div>
        </div>

        {/* <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '40vh'
          }}>
          
            <Button label="Presione para mostrar la camara" severity="info" onClick={showWebcam} />
          </div> */}
      </Card>
    )
  }

  const InfoScreenEmployee = () => {

    return (
      <>
        <div>

          <ul style={{
            fontSize: '16px',
            listStyle: 'none',
            padding: '5px'
          }}>
            <li>
              <label style={{ fontWeight: 'bold' }}>Tienda </label><br />{empleadoInfo.nombreTienda}
            </li>
            <li>
              <label style={{ fontWeight: 'bold' }}>Empleado </label><br />{empleadoInfo.nombreEmpleado}
            </li>
            <li>
              <label style={{ fontWeight: 'bold' }}>Coordinador </label><br />{empleadoInfo.nombreCoordinador}
            </li>
            <li>
              <label style={{ fontWeight: 'bold' }}>Hora Entrada </label><br />{empleadoInfo.horaEntrada}
            </li>
            <li>
              <label style={{ fontWeight: 'bold' }}>Hora Salida </label><br />{empleadoInfo.horaSalida}
            </li>
          </ul>
        </div>
      </>
    )
  }

  const MemoizedSelectSucursal = React.memo(SelectSucursal)
  return (
    <>
      {
        activeIndex === 3 ?
          <MemoizedSelectSucursal /> : <></>
      }
      <div style={{ padding: '0 10% 10% 10%' }}>
        {!showCamera && <ActivarCamara />}
        {showCamera && !seeCapture && <CamaraPhotos />}
        {seeCapture && (<MostrarImagen />)}
      </div>
    </>
  )
}




