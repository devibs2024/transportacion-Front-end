import React, { useState, useEffect, useRef } from 'react'
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import API from "../../../store/api";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { Toolbar } from 'primereact/toolbar';
import { useNavigate } from 'react-router';
import { FilterMatchMode } from 'primereact/api';
import { TriStateCheckbox } from 'primereact/tristatecheckbox';
import { accionExitosa, accionFallida, confirmarAccion } from '../../../shared/Utils/modals';
import { rutaServidor } from '../../../routes/rutaServidor';
import { procesarErrores } from '../../../shared/Utils/procesarErrores';

export function CardShowVehiculos() {

    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filters, setFilters] = useState({});
    const [vehiculos, setVehiculos] = useState([]);
    const MySwal = withReactContent(Swal);

    const dt = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        initFilters();

    }, [])

    useEffect(() => {
        geVehiculos();
    }, [])

    const geVehiculos = async () => {

        const response = await API.get(`Vehiculos`);

        if (response.status == 200 || response.status == 204) {
            setVehiculos(response.data.filter(c => c.vehiculoEmpresa == true))
        }
    }
    const cols = [
        { field: 'nombreVehiculo', header: 'Placas' },
        { field: 'tipoVehiculoDescr', header: 'Tipo Vehículo' },
        { field: 'marcaVehiculoDescr', header: 'Marcas' },
        { field: 'modeloVehiculoDescr', header: 'Modelos' },
        { field: 'emisionVehiculo', header: 'Emision Vehículo' },
        { field: 'vehiculoEmpresa', header: 'Vehículo Empresa' },


    ];


    const initFilters = () => {
        setFilters({
            global: { value: null, matchMode: FilterMatchMode.CONTAINS },
            nombreVehiculo: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
            tipoVehiculoDescr: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
            marcaVehiculoDescr: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
            modeloVehiculoDescr: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
            emisionVehiculo: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
            vehiculoEmpresa: { value: null, matchMode: FilterMatchMode.EQUALS }
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

    const exportCSV = () => {
        dt.current.exportCSV();
    };

    const exportPdf = () => {
        import('jspdf').then((jsPDF) => {
            import('jspdf-autotable').then(() => {
                const doc = new jsPDF.default(0, 0);

                doc.autoTable(exportColumns, vehiculos);
                doc.save('Vehículos.pdf');
            });
        });
    };

    const exportExcel = () => {
        import('xlsx').then((xlsx) => {
            const worksheet = xlsx.utils.json_to_sheet(vehiculos);
            const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
            const excelBuffer = xlsx.write(workbook, {
                bookType: 'xlsx',
                type: 'array'
            });

            saveAsExcelFile(excelBuffer, 'Vehículos');
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
                <Button style={{ backgroundColor: "#2596be", borderColor: "#2596be" }} label="Agregar Nuevo Vehiculo" icon="pi pi-plus" iconPos='right' severity="success" onClick={() => navigate( rutaServidor + "/vehiculos/MantenimientoVehiculos")} />
            </div>
        );
    };
    const rightToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-3 justify-content-center justify-content-between">
                <Button type="button" severity="secondary" tooltip='Descargar CSV' icon="pi pi-file" rounded onClick={() => exportCSV(false)} data-pr-tooltip="Descargar CSV" style={{ marginRight: "5px" }} />
                <Button type="button" tooltip='Descargar Excel' icon="pi pi-file-excel" severity="success" rounded onClick={exportExcel} data-pr-tooltip="Descargar Excel" style={{ marginRight: "5px" }} />
                <Button type="button" style={{ 'backgroundColor': 'red', borderColor: 'white', color: 'white' }} icon="pi pi-file-pdf" severity="warning" rounded onClick={exportPdf} data-pr-tooltip="Descargar PDF" tooltip='Descargar PDF' />
            </div>
        );
    };

    const header = (
        <div className="d-flex justify-content-between">
            <Button type="button" icon="pi pi-filter-slash" severity='secondary' label="Quitar Filtros" outlined onClick={clearFilter} />
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Buscar..." />
            </span>
        </div>
    );

    const vehiculoEmpresaRowFilterTemplate = (options) => {
        return <TriStateCheckbox value={options.value} onChange={(e) => options.filterApplyCallback(e.value)} />;
    };

    const onEdit = (vehiculo) => {

        navigate(rutaServidor + '/vehiculos/MantenimientoVehiculos', { state: { vehiculo } })
    };

    const onDelete = (rowData) => {

        deleteVehiculo(rowData.idVehiculo);
    };
    const deleteVehiculo = async (idVehiculo) => {

        confirmarAccion({ titulo: 'Eliminar Vehículo', mensaje: 'Estas seguro que deseas eliminar el vehículo?' }).then(async (result) => {
            try {

                if (result.isConfirmed) {
                    const response = await API.delete(`Vehiculos/${idVehiculo}`);

                    if (response.status == 200 || response.status == 204) {

                        const updatedVehiculo = vehiculos.filter(o => o.idVehiculo != idVehiculo);

                        setVehiculos(updatedVehiculo);

                        accionExitosa({ titulo: 'Vehículo Eliminado', mensaje: 'El vehículo ha sido eliminado satisfactoriamente' });
                    } else {
                        accionFallida({
                            titulo: 'Vehículo no pudo ser Eliminado', mensaje: '¡Favor eliminar la Asignacion que tiene el Vehículo para poder eliminar!' });
                    }
                }
            } catch (e) {
                let errores = e.response.data;

                accionFallida({ titulo: 'Vehículo no pudo ser Eliminado', mensaje: procesarErrores(errores) });
            }

        });

    }
    const actionBodyTemplate = (rowData) => {
        return (
            <div style={{ alignItems: 'center' }}>
                <Button icon="pi pi-pencil" severity="warning" rounded style={{ marginRight: "5px" }} onClick={() => onEdit(rowData)} />
                <Button icon="pi pi-trash" rounded severity="danger" onClick={() => onDelete(rowData)} />
            </div>
        );
    };

    return (
        <>
            <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

            <DataTable stripedRows={true} ref={dt} value={vehiculos}
                dataKey="idVehiculo" paginator rows={5} rowsPerPageOptions={[5, 10, 25]}
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products" filters={filters} filterDisplay="row"
                globalFilterFields={['nombreVehiculo', 'tipoVehiculoDescr', 'marcaVehiculoDescr', 'modeloVehiculoDescr', 'emisionVehiculo']} header={header}>
                <Column field="nombreVehiculo" header="Placas" filter filterPlaceholder="Buscar por placas" style={{ minWidth: '12rem' }} />
                <Column field="tipoVehiculoDescr" header="Tipo Vehiculo" filter filterPlaceholder="Buscar por tipo vehiculos" style={{ minWidth: '12rem' }} />
                <Column field="marcaVehiculoDescr" header="Marcas" filter filterPlaceholder="Buscar por marcas" style={{ minWidth: '12rem' }} />
                <Column field="modeloVehiculoDescr" header="Modelos" filter filterPlaceholder="Buscar por modelos" style={{ minWidth: '12rem' }} />
                <Column field="emisionVehiculo" header="Emision Vehiculo" filter filterPlaceholder="Buscar por emision" style={{ minWidth: '12rem' }} />
                <Column field="vehiculoEmpresa" header="Vehiculo Empresa" dataType="boolean" style={{ minWidth: '12rem' }}
                    body={(rowData) => rowData.vehiculoEmpresa ? 'Yes' : 'No'}
                    filter filterElement={vehiculoEmpresaRowFilterTemplate} />
                <Column header="Action" body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }} />
            </DataTable>
        </>
    )


}

