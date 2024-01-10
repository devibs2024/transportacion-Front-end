import React, { useState, useEffect, useRef } from 'react';
import { FilterMatchMode } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import API from '../../../store/api';
import { Button } from 'primereact/button';
import { accionExitosa, accionFallida, confirmarAccion } from '../../../shared/Utils/modals';
import { useNavigate } from 'react-router-dom';
import { Toolbar } from 'primereact/toolbar';
import { CustomCard } from '../../../shared/card-custom';
import { rutaServidor } from '../../../routes/rutaServidor';

export const PantallaPlanificaciones = () => {

    const [planificaciones, setPlanificaciones] = useState([]);

    const cols = [
        { field: 'fechaDesde', header: 'Fecha Desde' },
        { field: 'fechaHasta', header: 'Fecha Hasta' },
        { field: 'comentario', header: 'Comentario' }
    ];

    const dt = useRef(null);

    const exportColumns = cols.map((col) => ({ title: col.header, dataKey: col.field }));

    const navigate = useNavigate();

    useEffect(() => {
        getPlanificaciones();
    }, [])

    const getPlanificaciones = async () => {

        const response = await API.get(`Planificaciones`);

        if (response.status == 200 || response.status == 204) {


            setPlanificaciones(response.data);
        }
    }

    const onEdit = (planificacion) => {

        navigate(rutaServidor + '/planificacion/crear', { state: { planificacion } })
    };

    const onDelete = (rowData) => {


        eliminarPlanificacion(rowData.idPlanificacion);
    };



    const eliminarPlanificacion = async (idPlanificacion) => {

        confirmarAccion({ titulo: 'Eliminar Planificacion', mensaje: 'Estas seguro que deseas eliminar la Planificacion?' }).then(async (result) => {

            if (result.isConfirmed) {
                try {
                    const response = await API.delete(`Planificaciones/${idPlanificacion}`);

                    if (response.status == 200 || response.status == 204) {

                        const filteredPlanificaciones = planificaciones.filter(x => x.idPlanificacion != idPlanificacion);

                        setPlanificaciones(filteredPlanificaciones);

                        accionExitosa({ titulo: 'Planificación Eliminada', mensaje: 'La Planificacion ha sido eliminada satisfactoriamente' });
                    } else {
                        accionExitosa({ titulo: 'Planificación Eliminada', mensaje: 'La Planificacion ha sido eliminada satisfactoriamente' });
                    }
                } catch (error) {
                    accionFallida({ titulo: 'La Planificación no pudo se eliminada', mensaje: 'Ha ocurrido un error al intentar eliminar la Planificación' });
                }
            }
        });
    }


    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        fechaDesde: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        fechaHasta: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        comentario: { value: null, matchMode: FilterMatchMode.STARTS_WITH }
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
            fechaDesde: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
            fechaHasta: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
            comentario: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
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

                doc.autoTable(exportColumns, planificaciones);
                doc.save('Planificaciones.pdf');
            });
        });
    };

    const exportExcel = () => {
        import('xlsx').then((xlsx) => {
            const worksheet = xlsx.utils.json_to_sheet(planificaciones);
            const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
            const excelBuffer = xlsx.write(workbook, {
                bookType: 'xlsx',
                type: 'array'
            });

            saveAsExcelFile(excelBuffer, 'Planificaciones');
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
                <Button style={{ backgroundColor: "#2596be", borderColor: "#2596be" }} label="Agregar Nueva Planificación" icon="pi pi-plus right" iconPos='right' onClick={() => navigate(rutaServidor + "/planificacion/crear")} />
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
            <CustomCard title="Catálogo Planificaciones" >
                <div className="p-3">
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>
                    <DataTable paginator rows={5} rowsPerPageOptions={[5, 10, 25]}
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
                         ref={dt} style={customStyle}
                          value={planificaciones} 
                          dataKey="idEmpleado"
                          filters={filters} 
                          filterDisplay="row"
                        globalFilterFields={['fechaDesde', 'fechaHasta', 'comentario']}
                         header={header} emptyMessage="No data found.">
                        <Column field="coordinador.nombres" header="Nombre Completo" filter filterPlaceholder="Buscar por Nombre Completo" style={{ minWidth: '12rem' }} />
                        <Column field="fechaDesde" body={(rowData) => rowData.fechaDesde.substring(0, 10)} header="Fecha Desde" filter filterPlaceholder="Buscar por Fecha Inicial" style={{ minWidth: '12rem' }} />
                        <Column field="fechaHasta" header="Fecha Hasta" body={(rowData) => rowData.fechaHasta.substring(0, 10)} filter filterPlaceholder="Buscar por Fecha Final" style={{ minWidth: '12rem' }} />
                        <Column field='comentario' header="Comentario" filter filterPlaceholder="Buscar por Comentario" style={{ minWidth: '12rem' }} />
                        <Column header="Acción" body={actionButtons} style={{ minWidth: '12rem' }} />
                    </DataTable>
                </div>
            </CustomCard>
        </div>
    );
}