import React, { useEffect, useRef, useState } from 'react';
import API from '../../../store/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';

export const PlanificacionDetalleTable = ({
    planificacion, detallesGeneralesPlanificacion, setDetallesGeneralesPlanificacion, handleShow, detallePlanificacion, setDetallePlanificacion
}) => {

    useEffect(() => {
        getPlanificacionDetalles();
    }, [])

    const cols = [
        { field: 'fecha', header: 'Fecha' },
        { field: 'nombreCoordinador', header: 'Nombre Coordinador' },
        { field: 'tienda', header: 'Tienda' },
        { field: 'operador', header: 'Operador' },
        { field: 'horaInicio', header: 'Hora Inicio' },
        { field: 'horaFin', header: 'Hora Fin' },
    ];

    const dt = useRef(null);

    const exportColumns = cols.map((col) => ({ title: col.header, dataKey: col.field }));

    const getPlanificacionDetalles = async () => {

        const response = await API.get(
            `PlanificacionDetalleGeneral/${planificacion.idPlanificacion}`
        );

        if (response.status == 200 || response.status == 204) {
            setDetallesGeneralesPlanificacion(response.data);
            setExpandedRows(response.data)
        }
    };




    const [expandedRows, setExpandedRows] = useState(null);

    const [globalFilter, setGlobalFilter] = useState(null);

    const flattenData = () => {
        const flatData = [];

        detallesGeneralesPlanificacion.forEach((planificacion) => {
            planificacion.tiendas.forEach((tienda) => {
                tienda.operadores.forEach((operador) => {
                    flatData.push({
                        fecha: planificacion.fecha,
                        nombreCoordinador: planificacion.nombreCoordinador,
                        tienda: tienda.nombreTienda,
                        operador: operador.nombreOperador,
                        horaInicio: operador.horaInicio,
                        horaFin: operador.horaFin,
                    });
                });
            });
        });

        return flatData;
    };

    const exportCSV = () => {
        const flatData = flattenData();
        dt.current.exportCSV({ data: flatData });
    };

    const exportPdf = () => {
        const flatData = flattenData();

        import('jspdf').then((jsPDF) => {
            import('jspdf-autotable').then(() => {
                const doc = new jsPDF.default(0, 0);
                doc.autoTable(exportColumns, flatData);
                doc.save('Planificaciones.pdf');
            });
        });
    };

    const exportExcel = () => {
        const flatData = flattenData();

        import('xlsx').then((xlsx) => {
            const worksheet = xlsx.utils.json_to_sheet(flatData);
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

    const rightToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-3 justify-content-center justify-content-between">
                <Button type="button" tooltip='Descargar CSV' icon="pi pi-file" severity="secondary" rounded onClick={() => exportCSV(false)} data-pr-tooltip="CSV" style={{ marginRight: "5px" }} />
                <Button type="button" icon="pi pi-file-excel" tooltip='Descargar Excel' severity="success" rounded onClick={exportExcel} data-pr-tooltip="XLS" style={{ marginRight: "5px" }} />
                <Button type="button" icon="pi pi-file-pdf" tooltip='Descargar PDF' style={{ 'backgroundColor': 'red', borderColor: 'white', color: 'white' }} rounded onClick={exportPdf} data-pr-tooltip="PDF" />
            </div>
        );
    };

    const onRowToggle = (event) => {
        setExpandedRows(event.data);
    };

    const rowExpansionTemplate = (rowData) => {
        return (
            <div>
                {rowData.tiendas.map((tienda) => (
                    <div key={tienda.idTienda}>
                        <h5 style={{ margin: '20px' }}>
                            {tienda.nombreTienda}
                            <span style={{ float: 'right' }}>({tienda.total})</span>
                        </h5>
                        <div>
                            <DataTable value={tienda.operadores}>
                                <Column field="nombreOperador" style={{ fontSize: '1.2em' }} header="Nombre Operador" />
                                <Column field="horaInicio" style={{ fontSize: '1.2em' }} header="Hora Inicio" />
                                <Column field="horaFin" style={{ fontSize: '1.2em' }} header="Hora Fin" />
                                <Column header="Acción" body={(data) => { return actionButtons(rowData, tienda, data) }} style={{ minWidth: '12rem' }} />
                            </DataTable>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    const headerTemplate = (
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <span>Fecha</span>
            <InputText
                placeholder="Filtrar por fecha"
                onChange={(e) => setGlobalFilter(e.target.value)}
                style={{ marginLeft: '1rem' }}
            />
        </div>
    );

    

    const onDelete = (rowData, tienda, operador) => {

        deleteDetalle(planificacion.idPlanificacion, operador.idDetallePlanificacion)

    }

    const deleteDetalle = async (idPlanificacion, idDetallePlanificacion) => {

        const response = await API.delete(`DetallePlanificaciones/${idPlanificacion},${idDetallePlanificacion}`);

        if (response.status == 200 || response.status == 204) {
          getPlanificacionDetalles();
        }

    };

    const updateDetallePlanificacion = (rowData, tienda, operador) => {

        setDetallePlanificacion({
            idDetallePlanificacion: operador.idDetallePlanificacion,
            idOperador: operador.idOperador,
            idTienda: tienda.idTienda,
            fecha: rowData.fecha,
            horaInicio: operador.horaInicio,
            horaFin: operador.horaFin,
        });

        handleShow();

    }

    const actionButtons = (rowData, tienda, operador) => {


        return (
            <div className='row'>
                <Button icon="pi pi-pencil" severity="warning" rounded style={{ marginRight: "5px" }} tooltip="Editar" onClick={() => {                    updateDetallePlanificacion(rowData, tienda, operador);                }} />
             <Button icon="pi pi-trash" rounded severity="danger" tooltip="Eliminar" onClick={() => onDelete(rowData, tienda, operador)} /> 
            </div>
        );
    };



    return (
        <>
            <Toolbar className="mb-4" right={rightToolbarTemplate}></Toolbar>
            <DataTable
                ref={dt}
                value={detallesGeneralesPlanificacion}
                expandedRows={expandedRows}
                rowExpansionTemplate={rowExpansionTemplate}
                onRowToggle={onRowToggle}
                filterDisplay="row"
                globalFilter={globalFilter}
            >
                <Column expander style={{ width: '3em' }} />
                <Column field="fecha" header={headerTemplate} />
                <Column field="nombreCoordinador" header="Nombre Coordinador" />

            </DataTable>
        </>
    );
};
