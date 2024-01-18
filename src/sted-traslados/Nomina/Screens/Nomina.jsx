import API from "../../../store/api";

import React, { useState, useEffect, useRef } from 'react';
import * as decodeToken from '../../../shared/Utils/decodeToken';

import { useNavigate } from "react-router";
import { rutaServidor } from '../../../routes/rutaServidor';

import { Toolbar } from 'primereact/toolbar';
import { CustomCard } from '../../../shared/card-custom';
import { FilterMatchMode } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';

import { accionFallida } from '../../../shared/Utils/modals';

export const PantallaNomina = () => {


    //####################################################################################################################################################
    //### VARIABLES GLOBALES


    const navigate = useNavigate();

    const [error, setError] = useState(null);

    const [productividades, setProductividades] = useState([]);


    //####################################################################################################################################################
    //### EVENTOS


    useEffect(() => {

        getProductividades();

    }, [])


    //####################################################################################################################################################
    //### API


    const getProductividades = async () => {

        try {

            const idCoordinador = decodeToken.tokenDecode()

            const response = await API.get(`ProductividadHeader/${Number(idCoordinador)}`);

            if (response.status == 200 || response.status == 204) {
                setProductividades(response.data);
            }

        }
        catch (e) {
            setError(e.response.data)
            accionFallida({ titulo: 'E R R O R', mensaje: JSON.stringify(e.response.data) });
        }

    }


    //####################################################################################################################################################
    //### COMBOS


    //####################################################################################################################################################
    //### LISTADO


    const cols = [
        { field: 'idPlanificacion', header: 'Id Secuencia' },
        { field: 'coordinador', header: 'Coordinador' },
        { field: 'frecuencia', header: 'Frecuencia' },
        { field: 'fechaDesde', header: 'Inicio' },
        { field: 'fechaHasta', header: 'Final' },
        { field: 'estatus', header: 'Estado' }
    ];

    const dt = useRef(null);


    //####################################################################################################################################################
    //### LISTADO | FILTROS

    const [globalFilterValue, setGlobalFilterValue] = useState('');

    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        idPlanificacion: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        coordinador: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        fechaDesde: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        fechaHasta: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        frecuencia: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        estatus: { value: null, matchMode: FilterMatchMode.STARTS_WITH }
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
            idPlanificacion: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
            coordinador: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
            fechaDesde: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
            fechaHasta: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
            frecuencia: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
            estatus: { value: null, matchMode: FilterMatchMode.STARTS_WITH }
        });
        setGlobalFilterValue('')
    }

    const clearFilter = () => { initFilters(); };


    //####################################################################################################################################################
    //### LISTADO | EXPORTAR


    const exportColumns = cols.map((col) => ({ title: col.header, dataKey: col.field }));
    const customStyle = { backgroundColor: '#f2f2f2' };

    //### LISTADO | EXPORTAR - CSV

    const exportCSV = () => { dt.current.exportCSV(); };

    //### LISTADO | EXPORTAR - PDF

    const exportPdf = () => {
        import('jspdf').then((jsPDF) => {
            import('jspdf-autotable').then(() => {
                const doc = new jsPDF.default(0, 0);
                doc.autoTable(exportColumns, productividades);
                doc.save('Productividades.pdf');
            });
        });
    };

    //### LISTADO | EXPORTAR - EXCEL

    const exportExcel = () => {

        import('xlsx').then((xlsx) => {
            const worksheet = xlsx.utils.json_to_sheet(productividades);
            const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
            const excelBuffer = xlsx.write(workbook, {
                bookType: 'xlsx',
                type: 'array'
            });
            saveAsExcelFile(excelBuffer, 'Productividades');
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
            <div className='flex flex-wrap gap-3 justify-content-center justify-content-between'>

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
            <CustomCard title="Nómina" >
                <div className="p-3">
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>
                    <DataTable paginator rows={5} rowsPerPageOptions={[5, 10, 25]}
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} rows" ref={dt} style={customStyle} value={productividades} dataKey="idEmpleado" filters={filters} filterDisplay="row"
                        globalFilterFields={['idPlanificacion', 'coordinador', 'fechaDesde', 'fechaHasta', 'estatus', 'frecuencia']} header={header} emptyMessage="No data found.">
                        <Column
                            field="idPlanificacion"
                            header="ID de Secuencia"
                            body=
                            {
                                (rowData) => {
                                    const idWithPadding = String(rowData.idPlanificacion).padStart(6, '0');
                                    return <a onClick={() => navigate(`${rutaServidor}/Nomina/Componentes/DetalleNomina`, { state: { productividad: rowData } })} style={{ color: '#007bff', cursor: 'pointer' }}>{idWithPadding}</a>
                                }
                            }
                            filter
                            filterPlaceholder="Buscar por Id de Secuencia"
                            style={{ minWidth: '12rem' }}
                        />
                        <Column field="coordinador" header="Coordinador" filter filterPlaceholder="Buscar por el nombre del coordinador" style={{ minWidth: '12rem' }} />
                        <Column field="fechaDesde" header="Fecha Desde" body={(rowData) => rowData.fechaDesde.substring(0, 10)} filter filterPlaceholder="Buscar por el fecha inicio" style={{ minWidth: '12rem' }} />
                        <Column field="fechaHasta" header="Fecha Hasta" body={(rowData) => rowData.fechaHasta.substring(0, 10)} filter filterPlaceholder="Buscar por fecha fin" style={{ minWidth: '12rem' }} />
                        <Column field="frecuencia" header="Frecuencia" filter filterPlaceholder="Buscar por frecuencia" style={{ minWidth: '12rem' }} />
                        <Column field="estatus" header="Estado" filter filterPlaceholder="Buscar por el nombre del estado" style={{ minWidth: '12rem' }} />
                    </DataTable>
                </div>
            </CustomCard>
        </div>
    );

}