import React, { useState, useRef, useEffect } from 'react';
import { Steps } from 'primereact/steps';
import '../stepChk.css';
import { PantallaCheckInCheckOut } from '../PantallaCheckInCheckOut'
import * as decodeToken from '../../../shared/Utils/decodeToken';
import API from '../../../store/api';
import { accionFallida } from '../../../shared/Utils/modals';

export const StepChkInOut = () => {
    const [existCheckIn, setExistCheckIn] = useState(null);
    const [loaded, setLoaded] = useState(false);
    useEffect(() => {
        const handleBeforeUnload = (event) => {
            event.preventDefault();
            event.returnValue = ''; //Estaba a punto de hacer CheckIn. Desea Salir de esta pagina?
        };
        if (localStorage.getItem("stepActiveChkOut") !== null) {
            setActiveIndex(4)
        }
        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => { window.removeEventListener('beforeunload', handleBeforeUnload); };
    }, []);

    const [activeIndex, setActiveIndex] = useState(0);
    const [chkOutActiveIndex, setchkOutActiveIndex] = useState(0);
    const [chkInOutComplete, setChkInOutComplete] = useState(false);

    const items = [
        { label: 'Foto Entrada 1' },
        { label: 'Foto Entrada 2' },
        { label: 'Foto Entrada 3' },
        { label: 'Foto Entrada 4' },
    ];
    // {
    //label: 'Foto 2',
    //command: (event) => { }
    //},
    const checkOutItem = [
        { label: 'Foto Salida 1' },
        { label: 'Foto Salida 2' },
        { label: 'Foto Salida 3' },
    ];

    useEffect(() => {
        if (activeIndex === 4) {
            getCheckInOut()
        }
    }, [activeIndex])

    useEffect(() => {
        if (activeIndex === 0) {
            CheckInAndCheckOutCompleted()
        }
    }, [])

    const getCheckInOut = async () => {
        const idEmpleado = decodeToken.tokenDecode()
        try {
            const check = await API.get(`CheckIn_CkechOut/CheckInOut/${Number(idEmpleado)}`)
            if (check.data) {
                setExistCheckIn(true)
                setActiveIndex(4)
            }
        } catch (error) {
            setExistCheckIn(false)
            accionFallida({ titulo: 'Error!', mensaje: error.message })
        }
    }

    const CheckInAndCheckOutCompleted = async () => {
        const idEmpleado = decodeToken.tokenDecode()
        try {
            const check = await API.get(`CheckIn_CkechOut/CheckInAndCheckOutComplete/${Number(idEmpleado)}`)
            if (check.data) {
                setChkInOutComplete(true)
            } else {
                setChkInOutComplete(false)
            }
        } catch (error) {
            accionFallida({ titulo: 'Error!', mensaje: error.message })
        }
    }

    const StepPhotos = ({ activeIndex }) => {
        if (activeIndex === 4) {
            let activeStepLocalStorage = 0;
            if (localStorage.getItem("stepActiveChkOut") !== null) {
                activeStepLocalStorage = JSON.parse(localStorage.getItem("stepActiveChkOut"))
                setActiveIndex(Number(activeStepLocalStorage))
            }
        }

        if (activeIndex <= 3) {
            switch (activeIndex) {
                case 0:
                    return (<PantallaCheckInCheckOut title={"CheckIn 1 - Foto de perfil"} setActiveIndex={setActiveIndex} activeIndex={activeIndex} />)
                case 1:
                    return (<PantallaCheckInCheckOut title={"CheckIn 2 - Foto del Reloj"} setActiveIndex={setActiveIndex} activeIndex={activeIndex} />)
                case 2:
                    return (<PantallaCheckInCheckOut title={"CheckIn 3 - Foto del carro parte afuera"} setActiveIndex={setActiveIndex} activeIndex={activeIndex} />)
                case 3:
                    return (<PantallaCheckInCheckOut title={"CheckIn 4 - Foto del carro parte adentro"} setActiveIndex={setActiveIndex} activeIndex={activeIndex} />)
                default:
                    break;
            }
        } else {
            switch (activeIndex) {
                case 4:
                    return (<PantallaCheckInCheckOut title={"CheckOut 1 - Foto Perfil"} setActiveIndex={setActiveIndex} activeIndex={activeIndex} />)
                case 5:
                    return (<PantallaCheckInCheckOut title={"CheckOut 2 - Foto Uniforme"} setActiveIndex={setActiveIndex} activeIndex={activeIndex} />)
                case 6:
                    return (<PantallaCheckInCheckOut title={"CheckOut 3 - Foto Factura"} setActiveIndex={setActiveIndex} activeIndex={activeIndex} />)
                default:
                    break;
            }
        }
    }

    return (
        <>
            {
                chkInOutComplete === false ? //Si el CheckIn y el CheckOut esta completo presentara la pestaña debajo
                    <>
                        <div className="card mt-3 mb-3">
                            <Steps
                                className="p-menuitem-link p-2 p-steps-title"
                                model={existCheckIn ? checkOutItem : items}
                                activeIndex={activeIndex}
                                onSelect={(e) => setActiveIndex(e.index)}
                                readOnly={true}
                            />
                        </div>
                        <StepPhotos activeIndex={activeIndex} />
                    </> :
                    <>
                        <div className='mt-3'>
                            <center>
                                <h3>Ya hizo CheckIn y CkechOut, Vuelva mañana para hacer otro CheckIn</h3>
                            </center>
                        </div>
                    </>
            }
        </>
    )
}

