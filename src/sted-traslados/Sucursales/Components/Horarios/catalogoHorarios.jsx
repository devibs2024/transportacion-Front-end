import API from "../../../../store/api";
import { useEffect, useRef, useState } from "react";
import CustomModal from '../CustomModal';
import ModalCreateEditHorarios from '../../Components/Horarios/modalCreateEditHorarios'
import Swal from 'sweetalert2';
import { FilterMatchMode } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { accionFallida, accionExitosa,confirmarAccion } from "../../../../shared/Utils/modals";
import { Toolbar } from "primereact/toolbar";
import { useNavigate } from 'react-router-dom';

export default function CatalogoHorarios () {
    const [showModal, setShowModal] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [title, setTitle] = useState(null);

    const handleOpenModal = (id) => {
        setSelectedId(id)
        setShowModal(true); 
        const titleForm = id > 0 ? "Modificar Registro" : "Insertar Registro"
        setTitle(titleForm)
    }
    const handleCloseModal = () => setShowModal(false);
    const handleSaveChanges = () => setShowModal(false);
    const [horarios, setHorarios] = useState([])

    useEffect(() => { getAllHorarios() },[]);
    
    const cols = [
        { field: 'descrDia', header: 'Descripcion Día' },
        { field: 'horaInicio', header: 'Hora Inicio' },
        { field: 'horaFin', header: 'Hora Fin' }
    ];

    const dt = useRef(null);

    const exportColumns = cols.map((col) => ({ title: col.header, dataKey: col.field }));

    const getAllHorarios = async () => {      
        const response = await API.get("Horarios")
        setHorarios(response.data);
    }

    const handleDeleteHorarios = async (id) => {
        try {
            debugger
            const deleted = await API.delete(`Horarios/${id}`)
            if(deleted.status === 200 || deleted.status === 204){
                Swal.fire({
                    title: "Eliminado!",
                    text: "El registro ha sido eliminado exitosamente!",
                    icon: 'success'
                }).then(value=>{
                    if(value.isConfirmed){
                        window.location.reload()
                    }
                })
                return;
            }
            return Swal.fire({
                title: "Error!",
                text: "Hubo un problema al eliminar la información!",
                icon: 'error'
            })
        } catch (error) {
            if(error.response.status === 500) {
                accionFallida({titulo:"Información", mensaje: "Este horario no se puede eliminar ya que esta atado a una sucursal"})
              }else{
                accionFallida({titulo:"Error", mensaje: error.response.data})
            }
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
                <div className="p-input-icon-right" style={{float: "right"}}>
                    {/* <Button style={{ backgroundColor: "#2596be", borderColor: "#2596be", margin: "0 10px" }} label="Agregar Nuevo" icon="pi pi-plus right" iconPos='right' onClick={() => handleOpenModal(0)} /> */}
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
                <Button icon="pi pi-trash" rounded severity="danger" aria-label="Eliminar" onClick={() => handleDeleteHorarios(rowData)} />
            </div>
        );
    }  

     const exportCSV = () => {
        dt.current.exportCSV();
    };

    const exportPdf = () => {
        import('jspdf').then((jsPDF) => {
            import('jspdf-autotable').then(() => {
                const doc = new jsPDF.default(0, 0);

                doc.autoTable(exportColumns, horarios);
                doc.save('Horarios.pdf');
            });
        });
    };

    const exportExcel = () => {
        import('xlsx').then((xlsx) => {
            const worksheet = xlsx.utils.json_to_sheet(horarios);
            const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
            const excelBuffer = xlsx.write(workbook, {
                bookType: 'xlsx',
                type: 'array'
            });

            saveAsExcelFile(excelBuffer, 'Horarios');
        });
    };
    const saveAsExcelFile = (buffer, fileName) => {
        import('file-saver').then((module) => {
            if (module && module.default) {
                let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
                let EXCEL_EXTENSION = '.xlsx';
                const data = new Blob([buffer], {
                    type: EXCEL_TYPE
                });

                module.default.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
            }
        });
    };
    const leftToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-2">
                    <Button style={{ backgroundColor: "#2596be", borderColor: "#2596be", margin: "0 10px" }} label="Agregar Nuevo" icon="pi pi-plus right" iconPos='right' onClick={() => handleOpenModal(0)} />
            </div>
        );
    };
    const rightToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-3 justify-content-center justify-content-between">
                <Button type="button" tooltip='Descargar CSV' icon="pi pi-file" severity="secondary" rounded onClick={() => exportCSV(false)} data-pr-tooltip="CSV" style={{ marginRight: "5px" }} />
                <Button type="button" icon="pi pi-file-excel" tooltip='Descargar Excel' severity="success" rounded onClick={exportExcel} data-pr-tooltip="XLS" style={{ marginRight: "5px" }} />
                <Button type="button" icon="pi pi-file-pdf" tooltip='Descargar PDF' style={{ 'backgroundColor': 'red', borderColor: 'white', color: 'white' }} rounded onClick={exportPdf} data-pr-tooltip="PDF" />
            </div>
        );
    };

    return (
        <div className='mt-2'>
            <div className="card">
            <div className="mx-3 mt-2" style={{ fontSize:'25px', fontWeight:"bold" }}>Catálogo Horarios</div>
                <div className="card-body">
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>
                        <DataTable style={customStyle}  value={horarios} paginator rows={5} dataKey="idHorario" filters={filters} filterDisplay="row"
                            rowsPerPageOptions={[5, 10, 25]}
                            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"  ref={dt} 
                            globalFilterFields={['idHorario', 'descrDia', 'horaInicio',"horaFin"]} header={header} emptyMessage="No data found.">
                            <Column field="idHorario" header="Horario ID" style={{ minWidth: '12rem' }} /> 
                            <Column field="descrDia" header="Día" style={{ minWidth: '12rem' }} /> 
                            <Column field="horaInicio" header="Hora Inicio" style={{ minWidth: '12rem' }} /> 
                            <Column field="horaFin" header="Hora Fin" style={{ minWidth: '12rem' }} /> 
                            <Column field="activo" header="Activo" style={{ minWidth: '12rem' }} body={(rowData)=>{
                                return rowData.idHorario ? "Activo" : "Inactivo"
                            }}/> 
                            
                            <Column field="idHorario" header="Opciones" style={{ minWidth: '20rem' }}
                                body={(rowData) => actionButtonTemplate(rowData.idHorario)}/>
                        </DataTable>
                    <Toolbar/>
                </div>    
            </div>

            <CustomModal
                show={showModal}
                handleClose={handleCloseModal}
                handleSave={handleSaveChanges}
                title={title}
                selectedId={selectedId}
                body={ <ModalCreateEditHorarios id={selectedId} />}
            />  
        </div> 
    );
}


