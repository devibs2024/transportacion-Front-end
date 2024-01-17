import API from "../../../store/api";

import React, { useState, useEffect, useRef } from 'react';

import { useLocation, useNavigate } from 'react-router-dom';
import { rutaServidor } from '../../../routes/rutaServidor';

import { useFormik } from "formik";
import { Form, Modal } from 'react-bootstrap';
import { ModalCrearEjecucionPlanificacion } from './ModalCrearEjecucionPlanificacion';

import { Toolbar } from 'primereact/toolbar';
import { CustomCard } from '../../../shared/card-custom';
import { FilterMatchMode } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';

import { accionExitosa, accionFallida, confirmarAccion } from '../../../shared/Utils/modals';
import { procesarErrores } from '../../../shared/Utils/procesarErrores';

export const PantallaRegistroIndividualProductividad = () => {


    //####################################################################################################################################################
    //### VARIABLES GLOBALES


    const navigate = useNavigate();
    const location = useLocation();

    const [show, setShow] = useState(false);
    const [error, setError] = useState(null);

    const [ejecucion, setEjecucion] = useState([]);
    const [ejecuciones, setEjecuciones] = useState([]);
    const [changedCells, setChangedCells] = useState([]);

    const [planificacionEjecucion, setPlanificacionEjecucion] = useState({});

    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);


    //####################################################################################################################################################
    //### EVENTOS


    useEffect(() => {

        if (location.state?.detalle) {

            formik.setValues(location.state.detalle);
            setEjecucion(location.state.detalle);

            getEjecuciones(location.state?.detalle)

        }
        else
            accionFallida({ titulo: 'E R R O R', mensaje: 'FALTA INFORMACIÓN' });

    }, [])

    const getInitialValues = () => {

        return {
            idPlantificacion: 0,
            idDetallePlanificacion: 0
        }

    }

    const formik = useFormik({
        initialValues: getInitialValues(),
        Form,
        onSubmit: values => {

        },
    });

    const guardarEjecucion = () => {

        changedCells.forEach(item => {
            postEjecucion(item);
        });
    }

    const cancelarEjecucion = () => {

        setChangedCells([]);

    }

    const openEjecucion = (row) => {

        setShow(true);
    }

    //####################################################################################################################################################
    //### FUNCIONES

    const obtenerFechaFormateada = (fecha) => {

        const horas = fecha.getHours().toString().padStart(2, '0');
        const minutos = fecha.getMinutes().toString().padStart(2, '0');

        return `${horas}:${minutos}:00`;
    }

    const obtenerFechaHoraFormateada = (fecha, hora) => {

        const year = fecha.getFullYear();
        const month = (fecha.getMonth() + 1).toString().padStart(2, '0');
        const day = fecha.getDate().toString().padStart(2, '0');

        return `${year}-${month}-${day}T${hora}`;
    }

    //####################################################################################################################################################
    //### API

    const getEjecuciones = async (pDetalle) => {

        try {

            const response = await API.get(`Productividad/${pDetalle.idPlanificacion},${Number(pDetalle.idOperador)}`);

            if (response.status == 200 || response.status == 204) {
                setEjecuciones(response.data);
            }

        }
        catch (er) {

            if (er.response?.data) {
                setError(er.response.data);
                accionFallida({ titulo: 'E R R O R', mensaje: JSON.stringify(er.response.data) });
            }
            else {
                accionFallida({ titulo: 'E R R O R', mensaje: er.message });
            }

        }
    }

    const postEjecucion = async (ejecucion) => {

        try {

            const response = await API.post("EjecucionPlanificaciones", ejecucion);

            if (response.status == 200 || response.status == 204) {

                console.log('datos guardados')
            }

        } catch (e) {

            accionFallida({ titulo: 'Ha ocurrido un error', mensaje: procesarErrores(e.response.data) })

        }

    }

    //####################################################################################################################################################
    //### COMBOS


    //####################################################################################################################################################
    //### LISTADO


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

    const onStartTimeChange = (e, rowData) => {

        rowData.horaInicioPlanificacion = obtenerFechaFormateada(e.value);

        let updatedProductividades = [...ejecuciones];
        let index = updatedProductividades.findIndex(data => data.idDetallePlanificacion === rowData.idDetallePlanificacion);
        updatedProductividades[index].horaInicioPlanificacion = rowData.horaInicioPlanificacion;
        setEjecuciones(updatedProductividades);

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

        rowData.horaFinPlanificacion = obtenerFechaFormateada(e.value);

        let updatedProductividades = [...ejecuciones];
        let index = updatedProductividades.findIndex(data => data.idDetallePlanificacion === rowData.idDetallePlanificacion);
        updatedProductividades[index].horaFinPlanificacion = rowData.horaFinPlanificacion;
        setEjecuciones(updatedProductividades);

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

    const renderStartTimeEditor = (props) => {

        return (
            <Calendar
                id={props.rowData.idDetallePlanificacion}
                value={new Date(obtenerFechaHoraFormateada(new Date(props.rowData.fecha), props.rowData.horaInicioPlanificacion))}
                appendTo={document.body}
                onChange={(e) => onStartTimeChange(e, props.rowData)}
                timeOnly
                locale="es"
                hourFormat="24"
                dateFormat="HH:mm:ss"
            />
        );

    };

    const renderEndTimeEditor = (props) => {

        return (
            <Calendar
                id={props.rowData.idDetallePlanificacion}
                value={new Date(obtenerFechaHoraFormateada(new Date(props.rowData.fecha), props.rowData.horaFinPlanificacion))}
                appendTo={document.body}
                onChange={(e) => onEndTimeChange(e, props.rowData)}
                timeOnly
                locale="es"
                hourFormat="24"
                dateFormat="HH:mm:ss"
            />
        );

    };


    //####################################################################################################################################################
    //### LISTADO | FILTROS


    const [globalFilterValue, setGlobalFilterValue] = useState('');

    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        idSecuencia: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        fechaDesde: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        fechaHasta: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        estatus: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        frecuencia: { value: null, matchMode: FilterMatchMode.STARTS_WITH }
    });

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

    const clearFilter = () => { initFilters(); };


    //####################################################################################################################################################
    //### LISTADO | EXPORTAR


    const exportColumns = cols.map((col) => ({ title: col.header, dataKey: col.field }));
    const customStyle = { backgroundColor: '#f2f2f2' };

    //### LISTADO | EXPORTAR - CSV

    const exportCSV = () => {
        dt.current.exportCSV();
    };

    //### LISTADO | EXPORTAR - PDF

    const exportPdf = () => {
        import('jspdf').then((jsPDF) => {
            import('jspdf-autotable').then(() => {

                const doc = new jsPDF.default(0, 0);

                doc.autoTable(exportColumns, ejecuciones);
                doc.save('Registro Individual de Productividad.pdf');
            });
        });
    };

    //### LISTADO | EXPORTAR - EXCEL

    const exportExcel = () => {

        import('xlsx').then((xlsx) => {
            const worksheet = xlsx.utils.json_to_sheet(ejecuciones);
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


    //####################################################################################################################################################
    //### PANTALLA

    //### PANTALLA | TOP

    const leftToolbarTemplate = () => {
        return (

            <Form onSubmit={formik.handleSubmit}>

                <ModalCrearEjecucionPlanificacion
                    show={show}
                    setShow={setShow}
                    ejecucion={ejecucion}
                    setEjecucion={setEjecucion}
                />

                <div className="flex flex-wrap gap-3 justify-content-center justify-content-between">
                    <Button style={{ backgroundColor: "#2596be", borderColor: "#2596be" }} label="Nuevo Registro" onClick={openEjecucion} />
                    <Button style={{ backgroundColor: "#2596be", borderColor: "#2596be" }} label="Guardar" onClick={() => guardarEjecucion()} />
                    <Button style={{ backgroundColor: "#2596be", borderColor: "#2596be" }} label="Cancelar" onClick={() => cancelarEjecucion()} />
                </div>

            </Form>
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

    //### PANTALLA | LISTADO | HEADER

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

    //### PANTALLA | LISTADO | BODY

    return (

        <div className="mt-5">
            <CustomCard title="Registro Individual de Productividad" >
                <div className="p-3">
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>
                    <DataTable
                        paginator rows={5}
                        rowsPerPageOptions={[5, 10, 25]}
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} rows"
                        value={ejecuciones}
                        editMode="cell"
                        className="editable-cells-table">

                        <Column
                            field="fecha"
                            header="Fecha"
                            body={(rowData) => rowData.fecha.substring(0, 10)}
                            filter
                            filterPlaceholder="Buscar por fecha"
                            style={{ minWidth: '12rem' }}
                        />

                        <Column
                            field="horaInicioPlanificacion"
                            header="Hora Inicio"
                            body=
                            {
                                (rowData) =>
                                    <div style={isCellChanged(rowData.idDetallePlanificacion + 'horaInicioPlanificacion') ? { border: '1px solid red' } : {}}>
                                        {rowData.horaInicioPlanificacion}
                                    </div>
                            }
                            editor=
                            {
                                (props) => renderStartTimeEditor(props)
                            }
                            filter
                            filterPlaceholder="Buscar por hora inicio"
                            style={{ minWidth: '12rem' }}
                        />

                        <Column
                            field="horaFinPlanificacion"
                            header="Hora Fin"
                            body=
                            {
                                (rowData) =>
                                    <div style={isCellChanged(rowData.idDetallePlanificacion + 'horaFinPlanificacion') ? { border: '1px solid red' } : {}}>
                                        {rowData.horaFinPlanificacion}
                                    </div>
                            }
                            editor=
                            {
                                (props) => renderEndTimeEditor(props)
                            }
                            filter
                            filterPlaceholder="Buscar por hora fin"
                            style={{ minWidth: '12rem' }} />

                        <Column
                            field="nombreTienda"
                            header="Tienda"
                            body=
                            {
                                (rowData) =>
                                    <div style={isCellChanged(rowData.idDetallePlanificacion + 'nombreTienda') ? { border: '1px solid red' } : {}}>
                                        {rowData.nombreTienda}
                                    </div>
                            }
                        />
                    </DataTable>
                </div>
            </CustomCard>
        </div>

    );

}