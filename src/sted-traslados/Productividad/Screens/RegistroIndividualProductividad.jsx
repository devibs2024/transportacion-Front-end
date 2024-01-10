import React, { useState, useEffect, useRef } from 'react';
import { FilterMatchMode } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { TriStateCheckbox } from 'primereact/tristatecheckbox';
import API from '../../../store/api';
import { Button } from 'primereact/button';
import { accionExitosa, accionFallida, confirmarAccion } from '../../../shared/Utils/modals';
import { useLocation, useNavigate } from 'react-router-dom';
import { Toolbar } from 'primereact/toolbar';
import { CustomCard } from '../../../shared/card-custom';
import { rutaServidor } from '../../../routes/rutaServidor';
import { Link } from 'react-router-dom';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { procesarErrores } from '../../../shared/Utils/procesarErrores';
import { ModalCrearEjecucionPlanificacion } from './ModalCrearEjecucionPlanificacion';
import { Modal } from 'bootstrap';
import { Form } from 'react-bootstrap';

export const PantallaRegistroIndividualProductividad = () => {

    const [productividades, setProductividades] = useState([]);
    const [selectedStore, setSelectedStore] = useState(null);
    const [changedCells, setChangedCells] = useState([]);
    //const [idOperador, setIdOperador] = useState(0);
    

    const [show, setShow] = useState(false);
    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);
    const [planificacionEjecucion, setPlanificacionEjecucion] = useState({});
    const [idOperador, setIdOperador] = useState(0);
     
   // const [detallesGeneralesPlanificacion, setDetallesGeneralesPlanificacion] = useState([]);


   //  const [detallesPlanificacion, setDetallesPlanificacion] = useState([]);


    const stores = [
        { label: 'Tienda 1', value: 'tienda1' },
        { label: 'Tienda 2', value: 'tienda2' },
        // ... your stores
    ];

    const cols = [
        { field: 'fecha', header: 'Fecha' },
        { field: 'horaInicioPlanificacion', header: 'Hora Inicio' },
        { field: 'horaFinPlanificacion', header: 'Hora Final' },
        { field: 'descanso', header: 'Descanso' },
        { field: 'nombreTienda', header: 'Tienda' },
        { field: 'horaInicioEjecucion', header: 'Inicio Real' },
        { field: 'horaFinEjecucion', header: 'Final Real' },

    ];

    const dt = useRef(null);

    const exportColumns = cols.map((col) => ({ title: col.header, dataKey: col.field }));

    const navigate = useNavigate();

    const location = useLocation();

    useEffect(() => {
        if (location.state?.productividad) {
            getProductividades(location.state?.productividad.idPlanificacion, location.state.productividad.idOperador)

            console.log(productividades)
        }
    }, [])

    const getProductividades = async (idPlanificacion, idOperador) => {
        
        const response = await API.get(`Productividad/${idPlanificacion},${Number(idOperador)}`);

        if (response.status == 200 || response.status == 204) {

            setProductividades(response.data);
        }
    }

    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        idSecuencia: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        fechaDesde: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        fechaHasta: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        estatus: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        frecuencia: { value: null, matchMode: FilterMatchMode.STARTS_WITH }
    });

    const [globalFilterValue, setGlobalFilterValue] = useState('');

    const obtenerFechaFormateada = (fecha) => {
        const horas = fecha.getHours().toString().padStart(2, '0');
        const minutos = fecha.getMinutes().toString().padStart(2, '0');
        //   const segundos = fecha.getSeconds().toString().padStart(2, '0');

        return `${horas}:${minutos}:00`;
    }

    const onStartTimeChange = (e, rowData) => {
        let updatedProductividades = [...productividades];
        let index = updatedProductividades.findIndex(data => data.idDetallePlanificacion === rowData.idDetallePlanificacion);
        updatedProductividades[index].horaInicioPlanificacion = obtenerFechaFormateada(e.value);
        setProductividades(updatedProductividades);


        setChangedCells(prev => {

            const index = prev.findIndex(el => el.idDetallePlanificacion === rowData.idDetallePlanificacion);

            if (index !== -1) {
                return [
                    ...prev.slice(0, index),
                    rowData,
                    ...prev.slice(index + 1)
                ];
            }
            else {
                return [...prev, rowData];
            }
        });
    };


    const onEndTimeChange = (e, rowData) => {
        let updatedProductividades = [...productividades];
        let index = updatedProductividades.findIndex(data => data.idDetallePlanificacion === rowData.idDetallePlanificacion);
        updatedProductividades[index].horaFinPlanificacion = obtenerFechaFormateada(e.value);
        setProductividades(updatedProductividades);

        setChangedCells(prev => {

            const index = prev.findIndex(el => el.idDetallePlanificacion === rowData.idDetallePlanificacion);

            if (index !== -1) {
                return [
                    ...prev.slice(0, index),
                    rowData,
                    ...prev.slice(index + 1)
                ];
            }
            else {
                return [...prev, rowData];
            }
        });
    };

    const isCellChanged = (id) => {
        return changedCells.find(cell => cell.id === id)?.changed;
    };

    const onStoreChange = (e, rowData) => {
        let updatedProductividades = [...productividades];
        let index = updatedProductividades.findIndex(data => data.idDetallePlanificacion === rowData.idDetallePlanificacion);
        updatedProductividades[index].nombreTienda = e.value;
        setProductividades(updatedProductividades);

        setChangedCells(prev => {

            const index = prev.findIndex(el => el.idDetallePlanificacion === rowData.idDetallePlanificacion);

            if (index !== -1) {
                return [
                    ...prev.slice(0, index),
                    rowData,
                    ...prev.slice(index + 1)
                ];
            }
            else {
                return [...prev, rowData];
            }
        });
    };

    const renderStartTimeEditor = (props, field) => {
        return (
            <Calendar id={props.rowData.idDetallePlanificacion} value={props.rowData[field]} appendTo={document.body}
                onChange={(e) => onStartTimeChange(e, props.rowData)} timeOnly hourFormat="24" dateFormat="HH:mm:ss" />
        );
    };

    const renderEndTimeEditor = (props, field) => {
        return (
            <Calendar id={props.rowData.idDetallePlanificacion} value={props.rowData[field]} appendTo={document.body}
                onChange={(e) => onEndTimeChange(e, props.rowData)} timeOnly hourFormat="24" dateFormat="HH:mm:ss" />
        );
    };

    const renderStoreEditor = (props, field) => {
        return (
            <Dropdown id={props.rowData.idDetallePlanificacion} value={props.rowData[field]} options={stores}
                onChange={(e) => onStoreChange(e, props.rowData)} placeholder="Selecciona una tienda" />
        );
    };


    const onGlobalFilterChange = (e) => {

        const value = e.target.value;

        let _filters = { ...filters };

        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    const initFilters = () => {
        setFilters({
            global: { value: null, matchMode: FilterMatchMode.CONTAINS },
            inicio: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
            final: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
            estado: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
            frecuencia: { value: null, matchMode: FilterMatchMode.EQUALS }
        });

        setGlobalFilterValue('')
    }
    const clearFilter = () => {
        initFilters();
    };

    const renderHeader = () => {
        return (
            <div className="d-flex justify-content-between">
                <Button type="button" icon="pi pi-filter-slash" severity='secondary' label="Quitar Filtros" style={{ marginRight: "5px" }} outlined onClick={clearFilter} />
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Buscar..." />
                </span>
            </div>
        );
    };


    const header = renderHeader();

    const customStyle = {
        backgroundColor: '#f2f2f2',
    };

    const exportCSV = () => {
        dt.current.exportCSV();
    };

    const exportPdf = () => {
        import('jspdf').then((jsPDF) => {
            import('jspdf-autotable').then(() => {

                const doc = new jsPDF.default(0, 0);

                doc.autoTable(exportColumns, productividades);
                doc.save('Registro Individual de Productividad.pdf');
            });
        });
    };

    const exportExcel = () => {

        import('xlsx').then((xlsx) => {
            const worksheet = xlsx.utils.json_to_sheet(productividades);
            const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
            const excelBuffer = xlsx.write(workbook, {
                bookType: 'xlsx',
                type: 'array'
            });

            saveAsExcelFile(excelBuffer, 'Registro Individual de Productividad');
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
        return (<>
            <div className="flex flex-wrap gap-3 justify-content-center justify-content-between">
                {/* <Button style={{ backgroundColor: "#2596be", borderColor: "#2596be" }} label="Nuevo Registro" onClick={() => navigate(rutaServidor + "/operador/crear")} /> */}
                <Button style={{ backgroundColor: "#2596be", borderColor: "#2596be" }} label="Nuevo Registro" onClick={() => navigate( rutaServidor + "/registroIndividualProductividad/ModalCrearEjecucionPlanificacion")} />
                <Button style={{ backgroundColor: "#2596be", borderColor: "#2596be" }} label="Guardar" onClick={() => guardarProductividades()} />
                <Button style={{ backgroundColor: "#2596be", borderColor: "#2596be" }} label="Cancelar" onClick={() => cancelarProductividades()} />
            </div>
        </>);
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

    const guardarProductividades = () => {

        changedCells.forEach(item => {

            console.log(item)
            postProductividad(item);
        });
    }

    const cancelarProductividades = () => {

        setChangedCells([]);

    }



    const postProductividad = async (productividad) => {

        try {
            const response = await API.post("EjecucionPlanificaciones", productividad);

            if (response.status == 200 || response.status == 204) {

                console.log('datos guardados')
            }
        } catch (e) {
            console.log(e)

            accionFallida({ titulo: 'Ha ocurrido un error', mensaje: procesarErrores(e.response.data) })

        }



    }



    return (
        <>
          <ModalCrearEjecucionPlanificacion 
                        show={show}
                        setShow={setShow}
                        detallePlanificacion={planificacionEjecucion}
                        getDetallesPlanificacion={getProductividades}
                        setDetallePlanificacion={setPlanificacionEjecucion}
                        setDetallesPlanificacion={setProductividades}
                    />
            <div className="mt-5">
                <CustomCard title="Registro Individual de Productividad" >
                    <div className="p-3">
                        <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>
                        <DataTable paginator rows={5} rowsPerPageOptions={[5, 10, 25]} paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products" value={productividades} editMode="cell" className="editable-cells-table">
                            <Column field="fecha" header="Fecha" body={(rowData) => rowData.fecha.substring(0, 10)} filter filterPlaceholder="Buscar por Fecha" style={{ minWidth: '12rem' }} />
                            <Column field="horaInicioPlanificacion" header="Hora Inicio"
                                body={(rowData) =>
                                    <div style={isCellChanged(rowData.idDetallePlanificacion + 'horaInicioPlanificacion') ? { border: '1px solid red' } : {}}>
                                        {rowData.horaInicioPlanificacion}
                                    </div>
                                }
                                editor={(props) => renderStartTimeEditor(props, 'horaInicioPlanificacion')} filter filterPlaceholder="Buscar por Hora Inicio" style={{ minWidth: '12rem' }} />

                            <Column field="horaFinPlanificacion" header="Hora Fin"
                                body={(rowData) =>
                                    <div style={isCellChanged(rowData.idDetallePlanificacion + 'horaFinPlanificacion') ? { border: '1px solid red' } : {}}>
                                        {rowData.horaFinPlanificacion}
                                    </div>
                                }
                                editor={(props) => renderEndTimeEditor(props, 'horaFinPlanificacion')} filter filterPlaceholder="Buscar por Hora Fin" style={{ minWidth: '12rem' }} />

                            <Column field="nombreTienda" header="Tienda"
                                body={(rowData) =>
                                    <div style={isCellChanged(rowData.idDetallePlanificacion + 'nombreTienda') ? { border: '1px solid red' } : {}}>
                                        {rowData.nombreTienda}
                                    </div>
                                }
                                editor={(props) => renderStoreEditor(props, 'nombreTienda')} filter filterPlaceholder="Buscar por Tienda" style={{ minWidth: '12rem' }} />
                        </DataTable>
                    </div>
                </CustomCard>
            </div>
        </>


    );
}