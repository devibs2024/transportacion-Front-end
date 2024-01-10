import React, { useState, useEffect, useRef } from 'react';
import { FilterMatchMode } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { TriStateCheckbox } from 'primereact/tristatecheckbox';
import API from '../../../store/api';
import { Button } from 'primereact/button';
import { accionExitosa, accionFallida, confirmarAccion } from '../../../shared/Utils/modals';
import { useNavigate } from 'react-router-dom';
import { Toolbar } from 'primereact/toolbar';
import { CustomCard } from '../../../shared/card-custom';
import { rutaServidor } from '../../../routes/rutaServidor';

export const PantallaOperador = () => {

    const [operadores, setOperadores] = useState([]);

    const cols = [
        { field: 'numeroContrato', header: 'Numero de Contrato' },
        { field: 'fullName', header: 'Nombre' },
        { field: 'municipio.estado.nombreEstado', header: 'Estado' },
        { field: 'municipio.nombreMunicipio', header: 'Municipio' },
        { field: 'telefono', header: 'Telefono' },
        { field: 'segmentoEmpleado', header: 'Tipo Empleado' },
    ];

    const dt = useRef(null);

    const exportColumns = cols.map((col) => ({ title: col.header, dataKey: col.field }));

    const navigate = useNavigate();

    useEffect(() => {
        geOperadores();
    }, [])

    const geOperadores = async () => {

        const response = await API.get('Operador');

        if (response.status == 200 || response.status == 204) {

            const filteredOperadores = response.data.filter(o => o.idTipoEmpleado == 1);
            setOperadores(filteredOperadores);
        }
    }

    const onEdit = (operador) => {

        navigate(rutaServidor + '/operador/crear', { state: { operador } })
    };

    const onDelete = (rowData) => {

        
        eliminarOperador(rowData.idEmpleado);
    };

    const eliminarOperador = async (idEmpleado) => {

        confirmarAccion({ titulo: 'Eliminar Operador', mensaje: 'Estas seguro que deseas eliminar el Operador?' }).then(async (result) => {

            if (result.isConfirmed) {
                try {
                    const response = await API.delete(`Operador/${idEmpleado}`);

                    if (response.status == 200 || response.status == 204) {

                        const updatedOperador = operadores.filter(o => o.idEmpleado != idEmpleado);

                        setOperadores(updatedOperador);

                        accionExitosa({ titulo: 'Operador Eliminado', mensaje: 'El operador ha sido eliminado satisfactoriamente' });
                    } else {
                        accionExitosa({ titulo: 'Operador Eliminado', mensaje: 'El operador ha sido eliminado satisfactoriamente' });
                    }
                } catch (error) {
                    accionFallida({ titulo: 'Operador no pudo ser Eliminado', mensaje: 'Ha ocurrido un error al intentar eliminar al Operador' });
                }

                const response = await API.delete(`Operador/${idEmpleado}`);

                if (response.status == 200 || response.status == 204) {

                    const updatedOperador = operadores.filter(o => o.idEmpleado != idEmpleado);

                    setOperadores(updatedOperador);

                    accionExitosa({ titulo: 'Operador Eliminado', mensaje: 'El operador ha sido eliminado satisfactoriamente' });
                } else {
                    accionFallida({ titulo: 'Operador no pudo ser Eliminado', mensaje: 'Ha ocurrido un error al intentar eliminar al Operador' });
                }
            }


        });
    }
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        numeroContrato: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        fullName: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        'municipio.nombreMunicipio': { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        'municipio.estado.nombreEstado': { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        segmentoEmpleado: { value: null, matchMode: FilterMatchMode.EQUALS }
    });

    const [globalFilterValue, setGlobalFilterValue] = useState('');


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
            fullName: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
            'municipio.nombreMunicipio': { value: null, matchMode: FilterMatchMode.STARTS_WITH },
            'municipio.estado.nombreEstado': { value: null, matchMode: FilterMatchMode.STARTS_WITH },
            segmentoEmpleado: { value: null, matchMode: FilterMatchMode.EQUALS }
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

    const empleadoInternoRowFilterTemplate = (options) => {
        return <TriStateCheckbox value={options.value} onChange={(e) => options.filterApplyCallback(e.value)} />;
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

                doc.autoTable(exportColumns, operadores);
                doc.save('Operadores.pdf');
            });
        });
    };

    const exportExcel = () => {
        import('xlsx').then((xlsx) => {
            const worksheet = xlsx.utils.json_to_sheet(operadores);
            const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
            const excelBuffer = xlsx.write(workbook, {
                bookType: 'xlsx',
                type: 'array'
            });

            saveAsExcelFile(excelBuffer, 'Operadores');
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

    const actionButtons = (rowData) => {

        return (
            <div className='row'>
                <Button icon="pi pi-pencil" severity="warning" rounded style={{ marginRight: "5px" }} tooltip="Editar" onClick={() => onEdit(rowData)} />
                <Button icon="pi pi-trash" rounded severity="danger" tooltip="Eliminar" onClick={() => onDelete(rowData)} />
            </div>
        );
    };

    const leftToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-2">
                <Button style={{ backgroundColor: "#2596be", borderColor: "#2596be" }} label="Agregar Nuevo Operador" icon="pi pi-plus right" iconPos='right' onClick={() => navigate(rutaServidor + "/operador/crear")} />
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
        <div className="mt-5">
            <CustomCard title="Catálogo Operadores" >
                <div className="p-3">
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>
                    <DataTable paginator rows={5} rowsPerPageOptions={[5, 10, 25]}
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products" ref={dt} style={customStyle} value={operadores} dataKey="idEmpleado" filters={filters} filterDisplay="row"
                        globalFilterFields={['numeroContrato', 'fullName', 'municipio.nombreMunicipio', 'municipio.estado.nombreEstado']} header={header} emptyMessage="No data found.">
                        <Column field="numeroContrato" header="Número de Contrato" filter filterPlaceholder="Buscar por Número de Contrato" style={{ minWidth: '12rem' }} />
                        <Column field="fullName" header="Nombre" filter filterPlaceholder="Buscar por Nombre" style={{ minWidth: '12rem' }} />
                        <Column header="Estado" filterField="municipio.estado.nombreEstado" filter filterPlaceholder="Buscar por Estado" style={{ minWidth: '12rem' }}
                            body={(rowData) => rowData.municipio.estado.nombreEstado} />
                        <Column header="Municipio" filterField="municipio.nombreMunicipio" filter filterPlaceholder="Buscar por Municipio" style={{ minWidth: '12rem' }}
                            body={(rowData) => rowData.municipio.nombreMunicipio} />
                        <Column field="segmentoEmpleado" header="Tipo 
                        Empleado" dataType="boolean" style={{ minWidth: '12rem' }}
                            body={(rowData) => rowData.segmentoEmpleado}
                            filter filterElement={empleadoInternoRowFilterTemplate} />
                        <Column header="Acción" body={actionButtons} style={{ minWidth: '12rem' }} />
                    </DataTable>
                </div>
            </CustomCard>
        </div>
    );
}