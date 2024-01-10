import { useEffect, useState } from "react";
import {  Card } from "react-bootstrap";
import {  Button as BButton } from "react-bootstrap";
import { Button } from 'primereact/button';
import { ModalCrearModelo } from "./ModalCrearModelo";
import API from "../../../../store/api";
import { ModeloTable } from "./ModeloTable";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { accionExitosa, accionFallida, confirmarAccion } from "../../../../shared/Utils/modals";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

export const CardModelo = () => {

    const [show, setShow] = useState(false);
    const handleShow = () => setShow(true);
    const [tipovehiculoModelo, setTipoVehiculoModelo] = useState([])

    useEffect(() => {
        getTipoVehiculoModelo();
    }, [])

    const getTipoVehiculoModelo = async () => {


        const response = await API.get(`ModeloVehiculo`);

        if (response.status == 200 || response.status == 204) {
            setTipoVehiculoModelo(response.data)
        }

    }

    const MySwal = withReactContent(Swal)

    const eliminarModelo = (modelo) => {

        confirmarAccion({ titulo: 'Eliminar Modelo', mensaje: 'Estas seguro que deseas eliminar este Modelo?' }).then(async (result) => {

            if (result.isConfirmed) {
                try {
                    const response = await API.delete(`ModeloVehiculo/${modelo.idModelo}`);

                    console.log(response)
                    if (response.status == 200 || response.status == 204) {
                        accionExitosa({ titulo: 'Modelo Eliminada', mensaje: 'El modelo ha sido eliminado satisfactoriamente' });

                        const filteredModelos = tipovehiculoModelo.filter(x => x.idModelo != modelo.idModelo);

                        setTipoVehiculoModelo(filteredModelos)
                    }
                } catch (e) {
                    console.log(e)
                    accionFallida({ titulo: 'El Modelo no pudo ser Eliminado', mensaje: 'Ha ocurrido un error al intentar eliminar el Modelo.' });
                }
            }
        });


    }

   
    return (
        <div className="col col-sm-12">
            <Card>
                <ModalCrearModelo show={show} setShow={setShow} tipovehiculoModelo={tipovehiculoModelo} setTipoVehiculoModelo={setTipoVehiculoModelo} getTipoVehiculoModelo = {getTipoVehiculoModelo} />
                <div className="d-flex justify-content-start mt-2 ms-3 me-3">
                    <BButton onClick={handleShow} variant="custom" className="me-3 mt-3" >Agregar Nuevo Modelo <i className="fa-solid fa-plus"></i></BButton>
                </div>
                <div className="mt-3">
                    <DataTable value={tipovehiculoModelo} paginator rows={5}>
                        <Column field="marcaVehiculos.marca" header="Marca"></Column>
                        <Column field="modelo" header="Modelo"></Column>
                        <Column body={rowData => rowData.activo ? "Sí" : "No"} header="Activo"></Column>
                        <Column body={rowData =>
                            //  <Button variant="link" onClick={() => { eliminarModelo(rowData) }}>
                            //     <i className="fa-solid fa-trash text-danger"></i></Button>
                            <Button icon="pi pi-trash" rounded severity="danger" tooltip="Eliminar" onClick={() => eliminarModelo(rowData)} />

                            
                            } header="Acción"></Column>
                    </DataTable>
                </div>
            </Card>
        </div>
    )
}