import React, { useState, useEffect, useRef } from 'react';
import { FilterMatchMode } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import API from '../../../store/api';
import { Button } from 'primereact/button';
import { useLocation, useNavigate } from 'react-router-dom';
import { Toolbar } from 'primereact/toolbar';
import { CustomCard } from '../../../shared/card-custom';
import { rutaServidor } from '../../../routes/rutaServidor';
import * as decodeToken from '../../../shared/Utils/decodeToken';
import { NUM } from 'xlsx-populate/lib/FormulaError';

export const PantallaDetalleProductividad = () => {

    const [productividades, setProductividades] = useState([]);
    const [idOperador, setIdOperador] = useState(0);

    const cols = [
        { field: 'idPlanficacion', header: 'Id Secuencia' },
        { field: 'nombreOperador', header: 'Operador' },
        { field: 'nombreCliente', header: 'Cliente' },
        { field: 'nombreTienda', header: 'Tienda' },
        { field: 'spot', header: 'Spot' },
        { field: 'nombreEstado', header: 'Estado' },
    ];

    const dt = useRef(null);

    const exportColumns = cols.map((col) => ({ title: col.header, dataKey: col.field }));

    const navigate = useNavigate();
    const location = useLocation();


    useEffect(() => {
        if (location.state?.productividad) {
            getProductividades(location.state?.productividad.idPlanificacion)
        }
    }, [])

    const getProductividades = async (idPlanificacion) => {        
           
        const response = await API.get(`ProductividadHeader/${idPlanificacion},${Number(idOperador)}`);

        if (response.status == 200 || response.status == 204) {

            const dataWithDayOptions = response.data.map(item => {
                // Primero, ordena lstDias de menor a mayor
                const sortedDias = item.lstDias.sort((a, b) => a.nroDia - b.nroDia);

                return {
                    ...item,
                    dayOptions: sortedDias.map(dia => {
                        let color;
                        if (dia.accion === 'R') {
                            color = 'red';
                        } else if (dia.accion === 'A') {
                            color = 'yellow';
                        } else {
                            color = 'white';
                        }

                        return {
                            label: `${dia.nroDia}`,
                            value: dia.nroDia,
                            color: color,
                            action: dia.accion
                        };
                    })
                };
            });

            setProductividades(dataWithDayOptions);
        }
    };

    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        idPlanificacion: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        nombreOperador: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        nombreCliente: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        nombreTienda: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        spot: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        nombreEstado: { value: null, matchMode: FilterMatchMode.STARTS_WITH }
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
            idPlanificacion: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
            nombreOperador: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
            nombreCliente: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
            nombreTienda: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
            spot: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
            nombreEstado: { value: null, matchMode: FilterMatchMode.STARTS_WITH }
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
                doc.save('Productividades.pdf');
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
            <CustomCard title="Detalle de Productividad">
                <div className="p-3">
                    <Toolbar className="mb-4" right={rightToolbarTemplate}></Toolbar>
                    <DataTable
                        paginator rows={5}
                        rowsPerPageOptions={[5, 10, 25]}
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
                        ref={dt}
                        style={customStyle}
                        value={productividades}
                        dataKey="idEmpleado"
                        filters={filters}
                        filterDisplay="row"
                        globalFilterFields={['idSecuencia', 'coordinador', 'inicio', 'final', 'frecuencia', 'estado']}
                        header={header}
                        emptyMessage="No data found.">
                        <Column
                            field="idPlanificacion"
                            header="ID de Secuencia"
                            body={(rowData) => {
                                const idWithPadding = String(rowData.idPlanificacion).padStart(6, '0');

                                return <a onClick={() => navigate(`${rutaServidor}/productividad/registroIndividualProductividad`, { state: { productividad: rowData } })} style={{ color: '#007bff', cursor: 'pointer' }}>{idWithPadding}</a>
                            }}
                            filter
                            filterPlaceholder="Buscar por Id de Secuencia"
                            style={{ minWidth: '12rem' }}
                        />
                        <Column field="nombreOperador" header="Operador" filter filterPlaceholder="Buscar por el nombre del Operador" style={{ minWidth: '12rem' }} />
                        <Column field="nombreCliente" header="Cliente" filter filterPlaceholder="Buscar por el nombre del Operador" style={{ minWidth: '12rem' }} />
                        <Column field="nombreTienda" header="Tienda" filter filterPlaceholder="Buscar por el nombre del Operador" style={{ minWidth: '12rem' }} />
                        <Column field="spot" header="Spot" filter filterPlaceholder="Buscar por el nombre del Operador" style={{ minWidth: '12rem' }} />
                        <Column field="nombreEstado" header="Estado" filter filterPlaceholder="Buscar por el nombre del Operador" style={{ minWidth: '12rem' }} />
                        <Column style={{ minWidth: '50rem' }}
                            header="Días"
                            body={(rowData) => {
                                return (
                                    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                                        {rowData.dayOptions.map((option, index) => {
                                            let color, textColor;
                                            const action = option.action;
                                            if (action === 'R') {
                                                color = 'red';
                                                textColor = 'white';
                                            } else if (action === 'A') {
                                                color = 'yellow';
                                                textColor = 'black';  // Texto negro para fondo amarillo para mejor legibilidad
                                            } else {
                                                color = 'white';
                                                textColor = 'black';  // Texto negro para fondo blanco
                                            }
                                            return (
                                                <div
                                                    key={index}
                                                    style={{
                                                        backgroundColor: color,
                                                        color: textColor,  // Color de texto basado en el color de fondo
                                                        padding: '10px',
                                                        fontWeight: 'bold',
                                                        // margin: '5px',
                                                        // borderRadius: '5px',
                                                        textAlign: 'center',
                                                        width: '80px', // Puedes ajustar el tamaño según tus necesidades
                                                        border: '1px solid brown' // Añadido borde
                                                    }}
                                                >
                                                    {option.label}
                                                </div>
                                            );
                                        })}
                                    </div>
                                );
                            }}
                            autoWidth
                        />
                    </DataTable>
                </div>                
            </CustomCard>            
        </div>
        
    );
}



