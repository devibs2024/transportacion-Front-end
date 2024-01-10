import { Button } from 'primereact/button';
import API from "../../../../store/api";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { accionExitosa, confirmarAccion, accionFallida } from "../../../../shared/Utils/modals";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

export const MarcasTable = ({getTipoVehiculoMarcas, tipovehiculo, tipovehiculoMarcas, setTipoVehiculoMarcas }) => {

    const MySwal = withReactContent(Swal)

    const eliminarMarca = async (tipovehiculoMarcas) => {


        confirmarAccion({ titulo: 'Eliminar Marca', mensaje: 'Estas seguro que deseas eliminar esta Marca?' }).then(async (result) => {
            if (result.isConfirmed) {
               // try{
                const response = await API.delete(`MarcaVehiculo/${tipovehiculoMarcas.idMarca}`);

                if (response.status == 200 || response.status == 204) {
                    accionExitosa({ titulo: 'Marca Eliminada', mensaje: 'La Marca ha sido eliminada Exitosamente' });
                    getTipoVehiculoMarcas();
                    const filtersTipoVehiculoMarcas = tipovehiculoMarcas.filter(x => x.idMarca != tipovehiculoMarcas.idMarca);
                    setTipoVehiculoMarcas(filtersTipoVehiculoMarcas);

                } else {

                    accionFallida({ titulo: 'Marca no pudo ser Eliminada', mensaje: 'ha ocurrido un error al intentar eliminar la marca' })
                }
            //}catch{
            //    accionFallida({ titulo: 'Marca no pudo ser Eliminada', mensaje: 'Ha ocurrido un error al intentar eliminar la marca' })
                
           // }

            }
        })
    }

    return (
        <DataTable value={tipovehiculoMarcas} paginator rows={5}>
            <Column field="tipoVehiculos.tipoVehiculo" header="Tipo Vehiculo"></Column>
            <Column field="marca" header="Nombre de Marca"></Column>
            <Column body={rowData => 
                // <Button variant="link" onClick={() => eliminarMarca(rowData)}>
                //     <i className="fa-solid fa-trash text-danger"></i>
                // </Button>
                <Button icon="pi pi-trash" rounded severity="danger" tooltip="Eliminar" onClick={() => eliminarMarca(rowData)} />
                } 
                header="Acción">
            </Column>
        </DataTable>
    );
}