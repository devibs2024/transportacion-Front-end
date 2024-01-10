import { Button } from 'primereact/button';
import API from "../../../../store/api";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { accionExitosa, confirmarAccion, accionFallida } from "../../../../shared/Utils/modals";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

export const TarifaTipoVehiculoTable = ({ tipovehiculo, tipovehiculoTarifa, setTipoVehiculoTarifa, getTipoVehiculoTarifa }) => {


    const MySwal = withReactContent(Swal)

    const eliminarTarifa = (tarifa) => {

        confirmarAccion({ titulo: 'Eliminar Tarifa', mensaje: 'Estas seguro que deseas eliminar esta Tarifa?' }).then(async (result) => {

            if (result.isConfirmed) {
                try {
                    const response = await API.delete(`TarifaTipoVehiculo/${tarifa.idTarifa}`);

                    console.log(response)
                    if (response.status == 200 || response.status == 204) {
                        accionExitosa({ titulo: 'Tarifa Eliminada', mensaje: 'La Tarifa ha sido eliminada satisfactoriamente' });

                        const filteredTipoVehiculoTarifa = tipovehiculoTarifa.filter(x => x.tarifa.idTarifa != tarifa.idTarifa);

                        setTipoVehiculoTarifa(filteredTipoVehiculoTarifa)
                        getTipoVehiculoTarifa();
                    }
                } catch {
                    accionFallida({ titulo: 'Tarifa no pudo ser Eliminada', mensaje: 'Ha ocurrido un error al intentar eliminar la tarifa.' });
                }
            }
        });


    }




    return (
        <DataTable value={tipovehiculoTarifa} paginator rows={5}>
            <Column field="tipoVehiculos.tipoVehiculo" header="Tipo Vehiculo"></Column>
            <Column field="tarifa" header="Tarifa"></Column>
            <Column body={rowData => rowData.activa ? "Sí" : "No"} header="Activa"></Column>
            <Column body={rowData => rowData.principal ? "Sí" : "No"} header="Principal"></Column>
            <Column body={rowData => 
                // <Button variant="link" onClick={() => eliminarTarifa(rowData)}>
                //     <i className="fa-solid fa-trash text-danger"></i>
                // </Button>
                <Button icon="pi pi-trash" rounded severity="danger" tooltip="Eliminar" onClick={() => eliminarTarifa(rowData)} />

            } 
                header="Acción">
            </Column>
        </DataTable>
    );
}