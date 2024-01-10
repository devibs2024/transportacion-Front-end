import API from "../../../store/api";
import { useEffect, useState } from "react";
import CustomModal from '../Components/CustomModal';
import ModalCreateEditZona from '../Components/handleEventAddOrEditZone'
import { FilterMatchMode } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { getZonas } from "../Services/zonaServices";
import { confirmarAccion, accionExitosa, accionFallida } from "../../../shared/Utils/modals";

export const CatalogoZonas = () => {
    const [showModal, setShowModal] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [title, setTitle] = useState(null);

    const handleOpenModal = (id) => {

        setSelectedId(id)
        setShowModal(true);
        const titleForm = id > 0 ? "Modificar Registro" : "Insertar Registro"
        setTitle(titleForm)
    }
    const handleCloseModal = () => setShowModal(false)
    const handleSaveChanges = () => setShowModal(false);
    const [zonas, setZonas] = useState([])

    useEffect(() => {
        getAllZonas()
    }, []);

    const getAllZonas = async () => {
        const response = await getZonas();
        setZonas(response.data);
    }

    const handleDeleteZona = async (id) => {
        try {
            confirmarAccion({titulo:"Eliminar Registro!", 
            mensaje: "Seguro que desea eliminar la zona?"}).then(async (response)=> {
            if(response.isConfirmed){
                    const deleted = await API.delete(`Zonas/${id}`)
                    if (deleted.status === 200 || deleted.status === 204){ 
                        accionExitosa({title:"Eliminado", mensaje:"El registro ha sido eliminado exitosamente!"}).then((resp)=>{
                            if(resp.isConfirmed){
                                window.location.reload()
                            }
                        })
                    }
                    else return accionFallida({title:"Error", mensaje:"Hubo un error al tratar de eliminar la zona!"})     

                }else{
                    accionFallida({title:"Información", mensaje:"Se cancelado la eliminación del registro!"})     
                }
            })
        } catch (error) {
            if(error.response.status === 500){
                return accionFallida({ titulo: 'Información', mensaje: "No se puede eliminar porque contiene datos relacionados con la sucursal!"})
            }
            return accionFallida({titulo:"Error", mensaje:`Hubo un problema al eliminar la información! ${error.message}`}) 
        }
    }

    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        claveDET: { value: null, matchMode: FilterMatchMode.STARTS_WITH }
    });

    const [globalFilterValue, setGlobalFilterValue] = useState('');


    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };

        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    const renderHeader = () => {
        return (
            <>
                <div className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Busqueda General" />
                </div>
                <div className="p-input-icon-right" style={{ float: "right" }}>
                    <Button style={{ backgroundColor: "#2596be", borderColor: "#2596be", margin: "0 10px", color: 'white' }} icon="pi pi-plus" label="Agregar Nuevo" severity="info" outlined onClick={() => handleOpenModal(0)} />
                </div>
            </>
        );
    };

    const header = renderHeader();

    const customStyle = {
        backgroundColor: '#f2f2f2', // Agregar el color de fondo deseado
    };

    const actionButtonTemplate = (rowData) => {
        return (
            <div>
                <Button icon="pi pi-pencil" rounded severity="warning" aria-label="Modificar" onClick={() => handleOpenModal(rowData)} />
                <span className="mx-2"></span>
                <Button icon="pi pi-trash" rounded severity="danger" aria-label="Eliminar" onClick={() => handleDeleteZona(rowData)} />
            </div>
        );
    }

    return (
        <div className='mt-2'>
            <div className="card">
                <div className="mx-3 mt-2" style={{ fontSize: '25px', fontWeight: "bold" }}>Catálogo Zonas</div>
                <div className="card-body">
                    <DataTable style={customStyle} value={zonas} paginator rows={5} dataKey="idZona" filters={filters} filterDisplay="row"
                        rowsPerPageOptions={[5, 10, 25]}
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
                        globalFilterFields={['claveDET', 'tipoZona', 'estado']} header={header} emptyMessage="No data found.">
                        <Column field="claveDET" header="Clave DET" style={{ minWidth: '12rem' }} />

                        <Column field="idZona" header="Opciones" style={{ minWidth: '20rem' }}
                            body={(rowData) => actionButtonTemplate(rowData.idZona)} />
                    </DataTable>
                </div>
            </div>

            <CustomModal
                show={showModal}
                handleClose={handleCloseModal}
                handleSave={handleSaveChanges}
                title={title}
                selectedId={selectedId}
                body={<ModalCreateEditZona id={selectedId} />}
            />
        </div>
    );
}


