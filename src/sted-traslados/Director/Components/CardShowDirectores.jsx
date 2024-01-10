import React, { useState, useEffect, useRef } from 'react'
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import API from "../../../store/api";
import { Toolbar } from 'primereact/toolbar';
import { useNavigate } from 'react-router';
import { FilterMatchMode } from 'primereact/api';
import { accionExitosa, accionFallida, confirmarAccion } from '../../../shared/Utils/modals';
import { rutaServidor } from '../../../routes/rutaServidor';
import { procesarErrores } from '../../../shared/Utils/procesarErrores'

export function CardShowDirectores() {

    const [directores, setDirectores] = useState([]);
    const dt = useRef(null);
    const navigate = useNavigate();
    const [filters, setFilters] = useState({});
    const [globalFilterValue, setGlobalFilterValue] = useState('');

    useEffect(() => {
        getDirectores();
        initFilters();
    }, [])

    const cols = [
        { field: 'nombres', header: 'Nombre Completo' },
        { field: 'municipio.estado.nombreEstado', header: 'Estado' },
        { field: 'municipio.nombreMunicipio', header: 'Municipio' },
        { field: 'telefono', header: 'Telefono' }
    ];

    const initFilters = () => {
        setFilters({
            global: { value: null, matchMode: FilterMatchMode.CONTAINS },
            nombres: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
            'municipio.nombreMunicipio': { value: null, matchMode: FilterMatchMode.STARTS_WITH },
            'municipio.estado.nombreEstado': { value: null, matchMode: FilterMatchMode.STARTS_WITH },
            telefono: { value: null, matchMode: FilterMatchMode.CONTAINS },

        });
        setGlobalFilterValue('');
    };

    const onGlobalFilterChange = (event) => {
        const value = event.target.value;
        let _filters = { ...filters };

        // Verificar si la propiedad global está definida antes de establecer su valor
        if (_filters.hasOwnProperty('global')) {
            _filters['global'].value = value;
        } else {
            // Si no está definida, crear la propiedad global con su valor
            _filters['global'] = { value: value };
        }

        setFilters(_filters);
        setGlobalFilterValue(value);
    };


    const exportColumns = cols.map((col) => ({ title: col.header, dataKey: col.field }));

    const getDirectores = async () => {
        const response = await API.get("Director");
        setDirectores(response.data.filter(x => x.idTipoEmpleado == 4))
    }

    const exportCSV = () => {
        dt.current.exportCSV();
    };

    const exportPdf = () => {
        import('jspdf').then((jsPDF) => {
            import('jspdf-autotable').then(() => {
                const doc = new jsPDF.default(0, 0);
                doc.autoTable(exportColumns, directores);
                doc.save('Directores.pdf');
            });
        });
    };

    const exportExcel = () => {
        import('xlsx').then((xlsx) => {
            const worksheet = xlsx.utils.json_to_sheet(directores);
            const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
            const excelBuffer = xlsx.write(workbook, {
                bookType: 'xlsx',
                type: 'array'
            });

            saveAsExcelFile(excelBuffer, 'Directores');
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

    const clearFilter = () => {
        initFilters();
    };
    const leftToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-2">
                <Button style={{ backgroundColor: "#2596be", borderColor: "#2596be" }} label="Agregar Nuevo Director" icon="pi pi-plus" iconPos='right' onClick={() => navigate(rutaServidor + "/director/MantenimientoDirector")} />
            </div>
        );
    };
    const rightToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-3 justify-content-center justify-content-between">
                <Button type="button" tooltip='Descargar CSV' icon="pi pi-file" severity="secondary" rounded onClick={() => exportCSV(false)} data-pr-tooltip="Descargar CSV" style={{ marginRight: "5px" }} />
                <Button type="button" icon="pi pi-file-excel" tooltip='Descargar Excel' severity="success" rounded onClick={exportExcel} data-pr-tooltip="Descargar Excel" style={{ marginRight: "5px" }} />
                <Button type="button" icon="pi pi-file-pdf" tooltip='Descargar PDF' style={{ 'backgroundColor': 'red', borderColor: 'white', color: 'white' }} rounded onClick={exportPdf} data-pr-tooltip="Descargar PDF" />
            </div>
        );
    };
    const header = (
        <div className="d-flex justify-content-between">
            <Button type="button" icon="pi pi-filter-slash" severity='secondary' label="Quitar Filtros" style={{ marginRight: "5px" }} outlined onClick={clearFilter} />
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Buscar..." />
            </span>
        </div>
    );

    const onEdit = (director) => {

        navigate(rutaServidor + '/director/MantenimientoDirector', { state: { director } })
    };

    const onDelete = (rowData) => {

        console.log(rowData)
        deleteSubDirector(rowData.idEmpleado);
    };
    const deleteSubDirector = async (idEmpleado) => {

        confirmarAccion({ titulo: 'Eliminar Director', mensaje: 'Estas seguro que deseas eliminar el Director?' }).then(async (result) => {

            try {
                if (result.isConfirmed) {

                    const response = await API.delete(`Director/${idEmpleado}`);

                    if (response.status == 200 || response.status == 204) {

                        const updatedDirector = directores.filter(o => o.idEmpleado != idEmpleado);

                        setDirectores(updatedDirector);

                        accionExitosa({ titulo: 'Director Eliminado', mensaje: 'El Director ha sido eliminado satisfactoriamente' });
                    } else {
                        accionFallida({ titulo: 'Director no pudo ser Eliminado', mensaje: '¡Ha ocurrido un error al intentar eliminar el Director' });
                    }
                }

            } catch (e) {
                let errores = e.response.data;
                accionFallida({ titulo: 'Director no pudo ser Eliminado', mensaje: procesarErrores(errores) });
            }
        });

    }


    const actionBodyTemplate = (rowData) => {
        return (
            <div style={{ alignItems: 'center' }}>
                <Button icon="pi pi-pencil" severity="warning" rounded style={{ marginRight: "5px" }} onClick={() => onEdit(rowData)} />
                <Button icon="pi pi-trash" rounded severity="danger" onClick={() => onDelete(rowData)} />
            </div>);
    };


    return (
        <>
            <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

            <DataTable stripedRows={true} ref={dt} value={directores} filterDisplay='row'
                dataKey="idEmpleado" paginator rows={5} rowsPerPageOptions={[5, 10, 25]}
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products" filters={filters}
                globalFilterFields={['nombres', 'municipio.nombreMunicipio', 'municipio.estado.nombreEstado', 'telefono']} header={header} >

                <Column field="nombres" header="Nombre Completo" filter filterPlaceholder="Buscar por name" style={{ minWidth: '12rem' }} />

                <Column header="Estado" filterField="municipio.estado.nombreEstado" filter filterPlaceholder="Buscar por estado" style={{ minWidth: '12rem' }}
                    body={(rowData) => rowData.municipio.estado.nombreEstado} />

                <Column header="Municipio" filterField="municipio.nombreMunicipio" filter filterPlaceholder="Buscar por municipio" style={{ minWidth: '12rem' }}
                    body={(rowData) => rowData.municipio.nombreMunicipio} />

                <Column field="telefono" header="Teléfono" filter filterPlaceholder="Buscar por telefono" style={{ minWidth: '12rem' }} />



                <Column header="Acción" body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }} />
            </DataTable>
        </>
    )

}

