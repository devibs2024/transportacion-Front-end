import API from "../../../store/api";
import { useEffect, useRef, useState } from "react";
import CustomModal from '../Components/CustomModal';
import ModalCreateEditSucursal from '../Components/handleEventAddOrEditSucursal'
import Swal from 'sweetalert2';
import { DataTable } from 'primereact/datatable';
import { FilterMatchMode } from 'primereact/api';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import ModalCreateEditHorario from '../Components/SucursalesHorarios/handleCreateEditHorarios'
import { Toolbar } from "primereact/toolbar";
import { useNavigate}  from 'react-router-dom';
import { accionExitosa, accionFallida, confirmarAccion } from "../../../shared/Utils/modals";
import { rutaServidor } from "../../../routes/rutaServidor";

export const CatalogoSucursales = () => {
    const [showModal, setShowModal] = useState(false);
    const [showModalHorarios, setShowModalHorarios] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [title, setTitle] = useState("")
    const [expandedRows, setExpandedRows] = useState(null); //Expanded
    const [horariosSucursal, setHorariosSucursal] = useState([]); //expanded
    const [sucursalID, setSucursalID] = useState(null);
    const [selectedSucursalId, setSelectedSucursalId] = useState(null);
    const [sucursales, setSucursales] = useState([])

    const handleOpenModal = (id) => {
        setSelectedId(id)
        setShowModal(true);
        const titleText = id > 0 ? "Editar Registro" : "Guardar Registo"
        setTitle(titleText);
    }

    const handleHorariosOpenModal = (id) => {
        setSelectedSucursalId(id)      
        //getHorariosSucursal(id)
        setShowModalHorarios(true)
    }
    const handleHorariosCloseModal = () => setShowModalHorarios(false)

    const handleCloseModal = () => setShowModal(false);
    const handleSaveChanges = () => setShowModal(false);

    //const [sucursalesById, setSucursalesById] = useState([])
    const cols = [
        { field: 'nombreSucursal', header: 'Nombres' },
        { field: 'numUnidades', header: 'Número Unidades' },
        { field: 'unidadesMaximas', header: 'Unidades Máximas' },
        { field: 'tarifa', header: 'Tarifa' },
        { field: 'tarifaDescanso', header: 'Tarifa Descanso' },
      
    ];

    const dt = useRef(null);

    const exportColumns = cols.map((col) => ({ title: col.header, dataKey: col.field }));
    const navigate = useNavigate()
    useEffect(()=>{
        sucursales.map(resp=> getHorariosSucursal(resp.idSucursal))
    },[sucursales])

    const getSucursales = async () => {
        const response = await API.get("Sucursal")
        
        if(response.status === 200 || response.status === 204){
            setSucursales(response.data);
        }
    }

    useEffect(() => { 
        getSucursales() 
    }, []);
    
    // useEffect(() => {
    //     getHorariosSucursal(2)
    // },[])

    const getHorariosSucursal = async (idSucursal) => {
        const api = await API.get(`SucursalHorarios/${idSucursal}`)
        if(api.status === 200 || api.status === 204){ 
            setHorariosSucursal(api.data);
        }
    }

    const handleDeleteSucursal = async (idSucursal) => {   
        try {
            const existHorario = await API.get(`SucursalHorarios/${idSucursal}`);
            if(existHorario.data.length !== 0) {    
                return accionFallida({
                    titulo: "TIENE HORARIOS!",
                    mensaje: "El registro que intenta eliminar tiene horarios relacionados. Elimine los horarios y proceda con este registro!",
                })
            }
            confirmarAccion({titulo:"Eliminar!", 
                mensaje: "Seguro que desea eliminar la sucursal?"}).then(async (response)=> {
                    if(response.isConfirmed){
                        const deleted = await API.delete(`Sucursal/${idSucursal}`)

                        if (deleted.status === 200 || deleted.status === 204){
                            return accionExitosa({title:"Eliminado", mensaje:"El registro ha sido eliminado exitosamente!"}).then(resp=>{
                                if(resp.isConfirmed){
                                    window.location.reload()
                                }
                            })
                        }
                        else
                            return accionFallida({title:"Error", mensaje:"Hubo un error al tratar de eliminar la sucursal!"})     
                        
                    }else{
                        accionFallida({title:"Información", mensaje:"Se cancelado la eliminación del registro!"})     
                    }
                    
                })
        } catch (error) {
            return accionFallida({title:"Error", mensaje:`Hubo un problema al eliminar la información! ${error.message}`}) 
        }
    }

    const handleDeleteHorarios = async (idHorario, idSucursal) => {       
        try {
            const obj = {
                idHorario: idHorario,
                idSucursal: idSucursal
            }
            console.log(obj)
           
            Swal.fire({
                title: "Eliminar!",
                text: "Desea eliminar este registro?",
                icon: 'info',
                showConfirmButton: true,
                showCancelButton: true
            }).then(async (value) => {
                if (value.isConfirmed) {
                    const deleted = await API.delete(`SucursalHorarios`, { data: obj })
                        if (deleted.status === 200 || deleted.status === 204) {
                            Swal.fire({
                                title: "Eliminado!",
                                text: "El registro ha sido eliminado exitosamente!",
                                icon: 'success'
                            }).then(response => {
                                if(response.isConfirmed){
                                    window.location.reload()
                                }
                            })
                            return;
                        }else{
                            Swal.fire({
                                title: "Error!",
                                text: "Hubo un error al guardar el registro! - " + deleted.statusText,
                                icon: 'error'
                            })
                        }
                    }
                    else {
                        Swal.fire({
                            title: "Cancelado!",
                            text: "Se cancelo la eliminación del registro!",
                            icon: 'info'
                        })
                        return;
                    }
                })
                
        } catch (error) {
            return Swal.fire({
                title: "Error!",
                text: `Hubo un problema al eliminar la información! ${error.message}`,
                icon: 'error'
            })
        }
    }

    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        // nombreSucursal: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        // numUnidades: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        // unidadesMaximas: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        // tarifa: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        // tarifaDescanso: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        // activa: { value: null, matchMode: FilterMatchMode.STARTS_WITH }
    });

    const [globalFilterValue, setGlobalFilterValue] = useState('');

    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };

        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    const customStyle = {
        backgroundColor: '#f2f2f2', // Agregar el color de fondo deseado
    };
    
    const actionButtonTemplate = (idSucursal) => {
        return (
            <div>
                <Button icon="pi pi-plus" rounded severity="success" tooltip="Nuevo Horario" aria-label="Agregar Horarios" onClick={() => handleHorariosOpenModal(idSucursal)} />
                <span className="mx-2"></span>
                <Button icon="pi pi-pencil" rounded severity="warning" tooltip="Modificar Sucursal" aria-label="Modificar" onClick={() => handleOpenModal(idSucursal)} />
                <span className="mx-2"></span>
                <Button icon="pi pi-trash" rounded severity="danger" tooltip="Eliminar Sucursal" aria-label="Eliminar" onClick={() => handleDeleteSucursal(idSucursal)} />
            </div>
        );
    } 
    
    //Expanded
    const allowExpansion = (rowData) => {
        debugger
        return horariosSucursal.some(resp => resp.idSucursal === rowData.idSucursal)//horariosSucursal.some(response => rowData.idSucursal === response.idSucursal)
    };

    const bodyTemplateHorarios = (idHorario, idSucursal) => {
        return (
            <Button icon="pi pi-trash" rounded severity="danger" tooltip="Eliminar Horario" aria-label="Eliminar Horarios" onClick={() => handleDeleteHorarios(idHorario, idSucursal)} />
        )
    };

    const expandAll = () => {
        debugger
        let _expandedRows = {};
        
        horariosSucursal.forEach((p) => (_expandedRows[`${p.idSucursal}`] = true));
        
        setExpandedRows(_expandedRows);
    };
    
    const collapseAll = () => {
        setExpandedRows(null);
    };
    
    const header = () => {
        return (
            <>
                <div className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Busqueda General" />
                </div>
                
                {/* <div className="p-input-icon-right" style={{float: "right"}}>
                    <Button icon="pi pi-plus" label="Agregar Horarios" className="mx-2" severity="warning" onClick={()=>handleOpenModal(0)}/>
                    <Button icon="pi pi-plus" label="Agregar Nuevo" severity="info" onClick={()=>handleOpenModal(0)}/>
                </div>             */}
                {/* <div className="flex flex-wrap justify-content-end gap-2" style={{float: "right"}}>
                    <Button icon="pi pi-plus" label="Expandir Tabla" onClick={expandAll} text />
                    <Button icon="pi pi-minus" label="Contraer Tabla" onClick={collapseAll} text />
                </div> */}
            </>
        );
    };

    const [tbl2, setTbl2] = useState([]) 
    const onRowCollapse = () => {
        setTbl2([])
    }
    const onRowExpand = (event) => {
        console.log(event)
        const { idSucursal } = event.data
        
        API.get(`SucursalHorarios/${idSucursal}`).then((response)=>{
            console.log("resp", response.data)
            setTbl2(response.data)
        })
    };

    const rowExpansionTemplate = (data) => {
        return (
            <div className="p-3">
                <h5>Horarios para la sucursal {data.nombreSucursal}</h5>
                <DataTable value={tbl2} emptyMessage="No existen horarios asignados.">
                    <Column field="idSucursal" header="Sucursal ID" style={{ width: '12rem' }} sortable></Column>
                    <Column field="nombreSucursal" header="Nombre Sucursal" style={{ width: '12rem' }} sortable></Column>
                    <Column field="descripcion" header="Descripción" style={{ width: '12rem' }} sortable></Column>
                    <Column field="horaInicio" header="Hora Inicio" style={{ width: '12rem' }} sortable></Column>
                    <Column field="horaFin" header="Hora Fin" style={{ width: '12rem' }} sortable></Column>
                    <Column headerStyle={{ width: '5rem' }} header="Opciones" body={(rowData) => bodyTemplateHorarios(rowData.idHorario, rowData.idSucursal)}></Column>
                </DataTable>
            </div>
        );
    };

    const headers = (
        <div className="flex flex-wrap justify-content-end gap-2">
            <Button icon="pi pi-plus" label="Expand All" onClick={expandAll} text />
            <Button icon="pi pi-minus" label="Collapse All" onClick={collapseAll} text />
        </div>
    );
    const exportCSV = () => {
        dt.current.exportCSV();
    };

    const exportPdf = () => {
        import('jspdf').then((jsPDF) => {
            import('jspdf-autotable').then(() => {
                const doc = new jsPDF.default(0, 0);

                doc.autoTable(exportColumns, sucursales);
                doc.save('Sucursales.pdf');
            });
        });
    };

    const exportExcel = () => {
        import('xlsx').then((xlsx) => {
            const worksheet = xlsx.utils.json_to_sheet(sucursales);
            const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
            const excelBuffer = xlsx.write(workbook, {
                bookType: 'xlsx',
                type: 'array'
            });

            saveAsExcelFile(excelBuffer, 'Sucursales');
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
                <Button style={{ backgroundColor: "#2596be", borderColor: "#2596be", margin: "0 10px" }} label="Agregar Nueva Sucursal" icon="pi pi-plus right" iconPos='right' onClick={() => handleOpenModal(0)} />
                <Button style={{ backgroundColor: "#006E95", borderColor: "#006E95" }} label="Agregar Horarios" icon="pi pi-plus right" iconPos='right' onClick={() => navigate( rutaServidor +  "horarios")} />
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
        <div className='mt-5'>
            <div className="card">
                <div className="mx-3 mt-2" style={{ fontSize:'25px', fontWeight:"bold" }}>Catálogo Sucursales</div>
                <div className="card-body">
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>
                        <DataTable style={customStyle} value={sucursales} paginator rows={10} dataKey="idSucursal" filters={filters} filterDisplay="row"
                            rowsPerPageOptions={[5, 10, 25]}
                            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"  ref={dt} 
                            globalFilterFields={['nombreSucursal', 'numUnidades', 'unidadesMaximas','tarifa','tarifaDescanso', 'activa']} 
                            header={header} expandedRows={expandedRows} onRowToggle={(e) => setExpandedRows(e.data)} 
                            onRowExpand={onRowExpand} onRowCollapse={onRowCollapse}
                            rowExpansionTemplate={rowExpansionTemplate} emptyMessage="No hay datos disponibles.">
                            <Column field="idSucursal" expander={true} style={{ width: '12rem' }} />
                            <Column field="nombreSucursal" header="Nombre Sucursal" style={{ minWidth: '12rem' }} /> 
                            <Column field="numUnidades" header="Numero Unidades" style={{ minWidth: '12rem' }} />
                            <Column field="unidadesMaximas" header="Unidades Maximas" style={{ minWidth: '12rem' }} />
                            <Column field="tarifa" header="Tarifa" style={{ minWidth: '12rem' }} />
                            <Column field="tarifaDescanso" header="Tarifa Descanso" style={{ minWidth: '12rem' }} />
                            <Column field="activa" header="Activo" dataType="boolean" style={{ minWidth: '12rem' }}  
                                body={(rowData)=> rowData.activa ? "Si" : "No"} />
                            <Column field="idSucursal" header="Opciones" style={{ minWidth: '20rem' }}
                                body={(rowData) => actionButtonTemplate(rowData.idSucursal)}/>
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
                body={ <ModalCreateEditSucursal id={selectedId}/>}
            />  

            <CustomModal
                show={showModalHorarios}
                handleClose={handleHorariosCloseModal}
                //handleSave={handleSaveChanges}
                title='Agregar Nuevos Horarios'
                selectedId={selectedSucursalId}
                body={ <ModalCreateEditHorario id={selectedSucursalId} />}
            />  
            
        </div>        
    );
}
{/* <div className="mt-5">
        <CustomCard title="Catálogo Operadores" >
            <div className="p-3">

            <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>
                <DataTable   paginator rows={5} rowsPerPageOptions={[5, 10, 25]}
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"  ref={dt} style={customStyle} value={operadores}   dataKey="idEmpleado" filters={filters} filterDisplay="row"
                    globalFilterFields={['nombres', 'apellidoPaterno', 'apellidoMaterno', 'municipio.nombreMunicipio', 'municipio.estado.nombreEstado']} header={header} emptyMessage="No data found.">
                    <Column field="nombres" header="Nombres" filter filterPlaceholder="Buscar por Nombre" style={{ minWidth: '12rem' }} />
                    <Column field="apellidoPaterno" header="Apellido Paterno" filter filterPlaceholder="Buscar por Apellido Paterno" style={{ minWidth: '12rem' }} />
                    <Column field="apellidoMaterno" header="Apellido Materno" filter filterPlaceholder="Buscar por Apellido Materno" style={{ minWidth: '12rem' }} />
                    <Column header="Municipio" filterField="municipio.nombreMunicipio" filter filterPlaceholder="Buscar por Municipio" style={{ minWidth: '12rem' }}
                        body={(rowData) => rowData.municipio.nombreMunicipio} />
                    <Column field="empleadoInterno" header="Empleado Interno" dataType="boolean" style={{ minWidth: '12rem' }}
                        body={(rowData) => rowData.empleadoInterno ? 'Yes' : 'No'}
                        filter filterElement={empleadoInternoRowFilterTemplate} />
                    <Column header="Acción" body={actionButtons} style={{ minWidth: '12rem' }} />
                </DataTable>
                </div>
            </CustomCard>
        </div> */}

