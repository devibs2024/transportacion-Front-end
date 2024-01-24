import API from "../../../store/api";

import React, { useState, useEffect, useRef } from 'react';
import * as decodeToken from '../../../shared/Utils/decodeToken';

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
import { Input } from "@mui/material";
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';

import { accionExitosa, accionFallida } from '../../../shared/Utils/modals';

import { useGetEmpleadoCoordinadores } from "../../../hooks/useGetEmpleadoCoordinador";
import { useGetTiendaCoordinadores } from "../../../hooks/useGetTiendaCoordinador";

export const PantallaRegistroIndividualProductividad = () => {


    //####################################################################################################################################################
    //### VARIABLES GLOBALES


    const navigate = useNavigate();
    const location = useLocation();

    const [show, setShow] = useState(false);
    const [error, setError] = useState(null);

    const [productividad, setProductividad] = useState([]);
    const [detalle, setDetalle] = useState([]);
    const [ejecuciones, setEjecuciones] = useState([]);
    const [changedCells, setChangedCells] = useState([]);

    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);

    const idCoordinador = decodeToken.tokenDecode();

    //####################################################################################################################################################
    //### EVENTOS


    useEffect(() => {

        if (location.state?.productividad) {

            formik.setValues(location.state.productividad);
            setProductividad(location.state.productividad);

        }

        if (location.state?.detalle) {

            formik.setValues(location.state.detalle);
            setDetalle(location.state.detalle);

            getEjecuciones(location.state.detalle)
            getOperadorVehiculos(location.state.detalle)

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

        try {

            changedCells.forEach((item) => { putEjecucionPlanificacion(item); });

            accionExitosa({ titulo: "Registro Individual de Productividad", mensaje: "¡Actualización satisfactoria!" });

            navigate(`${rutaServidor}/productividad/registroIndividualProductividad`, { state: { detalle: detalle } })

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

    const cancelarEjecucion = () => {

        setEjecuciones([])
        getEjecuciones(detalle)

    }

    const openEjecucion = () => {

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

            setChangedCells([])
            setEjecuciones([])

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

    const putEjecucionPlanificacion = async (pEjecucion) => {

        try {

            let HoraEntrada = new Date(obtenerFechaHoraFormateada(new Date(pEjecucion.fecha), pEjecucion.horaInicioEjecucion))
            let HoraSalida = new Date(obtenerFechaHoraFormateada(new Date(pEjecucion.fecha), pEjecucion.horaFinEjecucion))

            let pEjecucionPlanificacion =
            {
                idPlanificacion: pEjecucion.idPlanificacion,
                idDetallePlanificacion: pEjecucion.idDetallePlanificacion,
                idEjecucionPlanificacion: pEjecucion.idEjecucionPlanificacion,
                idOperador: pEjecucion.idOperador,
                idTienda: pEjecucion.idTienda,
                fecha: pEjecucion.fecha,
                horaE: HoraEntrada.getHours(),
                minutoE: HoraEntrada.getMinutes(),
                horaF: HoraSalida.getHours(),
                minutoF: HoraSalida.getMinutes(),
                descanso: pEjecucion.descanso,
                incentivoFactura: pEjecucion.incentivoFactura,
                descuentoTardanza: pEjecucion.descuentoTardanza,
                montoHorasExtras: pEjecucion.montoHorasExtras,
                justificacion: pEjecucion.justificacion,
                idVehiculo: pEjecucion.idVehiculo,
            }

            const response = await API.put(`EjecucionPlanificaciones/${pEjecucionPlanificacion.idEjecucionPlanificacion}`, pEjecucionPlanificacion);

            if (response.status == 200 || response.status == 204) {
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

    };

    const getOperadorVehiculos = async (pDetalle) => {

        const response = await API.get(`OperadorVehiculo/${pDetalle.idOperador}`);

        if (response.status == 200 || response.status == 204) {

            let data = response.data.map((list) => ({ value: list.vehiculo.idVehiculo, label: list.vehiculo.nombreVehiculo }));

            setOperadorVehiculosOptions(data)

        }

    }

    //####################################################################################################################################################
    //### COMBOS

    const operadoresOptions = useGetEmpleadoCoordinadores(idCoordinador).map((list) => ({ value: list.idOperador, label: list.nombres }));
    const tiendasOptions = useGetTiendaCoordinadores(idCoordinador).map((list) => ({ value: list.idTienda, label: list.nombreTienda }));
    const [operadorVehiculosOptions, setOperadorVehiculosOptions] = useState([])

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

        rowData.horaInicioEjecucion = obtenerFechaFormateada(e.value);

        let updatedProductividades = [...ejecuciones];
        let index = updatedProductividades.findIndex(data => data.idEjecucionPlanificacion === rowData.idEjecucionPlanificacion);
        updatedProductividades[index].horaInicioEjecucion = obtenerFechaFormateada(e.value);
        setEjecuciones(updatedProductividades);

        setChangedCells(prev => {

            const index = prev.findIndex(el => el.idEjecucionPlanificacion === rowData.idEjecucionPlanificacion);

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

        rowData.horaFinEjecucion = obtenerFechaFormateada(e.value);

        let updatedProductividades = [...ejecuciones];
        let index = updatedProductividades.findIndex(data => data.idEjecucionPlanificacion === rowData.idEjecucionPlanificacion);
        updatedProductividades[index].horaFinEjecucion = obtenerFechaFormateada(e.value);
        setEjecuciones(updatedProductividades);

        setChangedCells(prev => {

            const index = prev.findIndex(el => el.idEjecucionPlanificacion === rowData.idEjecucionPlanificacion);

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

    const onListVehiculosChange = (e, rowData) => {

        rowData.idVehiculo = e.value;

        if (e.value > 0) {
            let selecion = operadorVehiculosOptions.filter(x => x.value == e.value)
            if (selecion.length == 1)
                rowData.nombreVehiculo = selecion[0].label;
        }

        let updatedProductividades = [...ejecuciones];
        let index = updatedProductividades.findIndex(data => data.idDetallePlanificacion === rowData.idDetallePlanificacion);
        updatedProductividades[index].idVehiculo = e.value;
        updatedProductividades[index].nombreVehiculo = rowData.nombreVehiculo;
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

    const onTextIFChange = (e, rowData) => {

        rowData.incentivoFactura = e.target.value;

        let updatedProductividades = [...ejecuciones];
        let index = updatedProductividades.findIndex(data => data.idEjecucionPlanificacion === rowData.idEjecucionPlanificacion);
        updatedProductividades[index].incentivoFactura = e.target.value;
        setEjecuciones(updatedProductividades);

        setChangedCells(prev => {

            const index = prev.findIndex(el => el.idEjecucionPlanificacion === rowData.idEjecucionPlanificacion);

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

    const onTextMHEChange = (e, rowData) => {


        rowData.montoHorasExtras = e.target.value;

        let updatedProductividades = [...ejecuciones];
        let index = updatedProductividades.findIndex(data => data.idEjecucionPlanificacion === rowData.idEjecucionPlanificacion);
        updatedProductividades[index].montoHorasExtras = e.target.value;
        setEjecuciones(updatedProductividades);

        setChangedCells(prev => {

            const index = prev.findIndex(el => el.idEjecucionPlanificacion === rowData.idEjecucionPlanificacion);

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
                id={props.rowData.idEjecucionPlanificacion}
                value={new Date(obtenerFechaHoraFormateada(new Date(props.rowData.fecha), props.rowData.horaInicioEjecucion))}
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
                id={props.rowData.idEjecucionPlanificacion}
                value={new Date(obtenerFechaHoraFormateada(new Date(props.rowData.fecha), props.rowData.horaFinEjecucion))}
                appendTo={document.body}
                onChange={(e) => onEndTimeChange(e, props.rowData)}
                timeOnly
                locale="es"
                hourFormat="24"
                dateFormat="HH:mm:ss"
            />
        );

    };

    const renderListVehiculos = (props) => {
        return (
            <Dropdown
                id={props.rowData.idDetallePlanificacion}
                value={props.rowData.idVehiculo}
                options={operadorVehiculosOptions}
                onChange={(e) => onListVehiculosChange(e, props.rowData)}
                placeholder="Selecciona un Vehículo" />
        );
    };

    const renderTextIF = (props) => {
        return (
            <Input
                id={props.rowData.idDetallePlanificacion}
                value={props.rowData.incentivoFactura}
                onChange={(e) => onTextIFChange(e, props.rowData)}
                placeholder="Ingrese el incentivo factura" />
        );
    };

    const renderTextMHE = (props) => {
        return (
            <Input
                id={props.rowData.idDetallePlanificacion}
                inputId={props.rowData.idDetallePlanificacion}
                value={props.rowData.montoHorasExtras}
                onChange={(e) => onTextMHEChange(e, props.rowData)}
                placeholder="Ingrese el incentivo factura" />
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
                    productividad={productividad}
                    detalle={detalle}
                    setDetalle={setDetalle}
                    ejecuciones={ejecuciones}
                    setEjecuciones={setEjecuciones}
                    operadoresOptions={operadoresOptions}
                    tiendasOptions={tiendasOptions}
                    operadorVehiculosOptions={operadorVehiculosOptions}
                />

                <div className="flex flex-wrap gap-3 justify-content-center justify-content-between">
                    <Button type="button" style={{ backgroundColor: "#2596be", borderColor: "#2596be" }} label="Nuevo Registro" onClick={openEjecucion} />
                    <Button type="button" style={{ backgroundColor: "#2596be", borderColor: "#2596be" }} label="Guardar" onClick={() => guardarEjecucion()} />
                    <Button type="button" style={{ backgroundColor: "#2596be", borderColor: "#2596be" }} label="Cancelar" onClick={() => cancelarEjecucion()} />
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
                            style={{ minWidth: '12rem' }}
                        />

                        <Column
                            field="horaInicioEjecucion"
                            header="Hora Inicio"
                            body=
                            {
                                (rowData) =>
                                    <div style={isCellChanged(rowData.idEjecucionPlanificacion + 'horaInicioEjecucion') ? { border: '1px solid red' } : {}}>
                                        {rowData.horaInicioEjecucion}
                                    </div>
                            }
                            editor=
                            {
                                (props) => renderStartTimeEditor(props)
                            }
                            style={{ minWidth: '12rem' }}
                        />

                        <Column
                            field="horaFinEjecucion"
                            header="Hora Fin"
                            body=
                            {
                                (rowData) =>
                                    <div style={isCellChanged(rowData.idEjecucionPlanificacion + 'horaFinEjecucion') ? { border: '1px solid red' } : {}}>
                                        {rowData.horaFinEjecucion}
                                    </div>
                            }
                            editor=
                            {
                                (props) => renderEndTimeEditor(props)
                            }
                            style={{ minWidth: '12rem' }} />

                        <Column
                            field="idVehiculo"
                            header="Vehículo"
                            body=
                            {
                                (rowData) =>
                                    <div style={isCellChanged(rowData.idEjecucionPlanificacion + 'idVehiculo') ? { border: '1px solid red' } : {}}>
                                        {rowData.nombreVehiculo}
                                    </div>
                            }
                            editor=
                            {
                                (props) => renderListVehiculos(props)
                            }
                            style={{ minWidth: '12rem' }} />

                        <Column
                            field="incentivoFactura"
                            header="Incentivo Factura"
                            body=
                            {
                                (rowData) =>
                                    <div style={isCellChanged(rowData.idEjecucionPlanificacion + 'incentivoFactura') ? { border: '1px solid red' } : {}}>
                                        {rowData.incentivoFactura}
                                    </div>
                            }
                            editor=
                            {
                                (props) => renderTextIF(props)
                            }
                            style={{ minWidth: '12rem' }} />

                        <Column
                            field="montoHorasExtras"
                            header="Monto Horas Extras"
                            body=
                            {
                                (rowData) =>
                                    <div style={isCellChanged(rowData.idEjecucionPlanificacion + 'montoHorasExtras') ? { border: '1px solid red' } : {}}>
                                        {rowData.montoHorasExtras}
                                    </div>
                            }
                            editor=
                            {
                                (props) => renderTextMHE(props)
                            }
                            style={{ minWidth: '12rem' }} />

                        <Column
                            field="nombreTienda"
                            header="Tienda"
                            body=
                            {
                                (rowData) =>
                                    <div style={isCellChanged(rowData.idEjecucionPlanificacion + 'nombreTienda') ? { border: '1px solid red' } : {}}>
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