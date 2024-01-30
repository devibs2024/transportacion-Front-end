import API from "../../../store/api";

import React, { useState, useEffect, useRef } from "react";
import * as decodeToken from '../../../shared/Utils/decodeToken';

import { useNavigate } from "react-router";
import { useLocation } from "react-router-dom";

import { useFormik } from "formik";
import { Form, Modal } from "react-bootstrap";
import { ModalComprobanteNomina } from "./ModalComprobanteNomina";

import { Toolbar } from "primereact/toolbar";
import { CustomCard } from "../../../shared/card-custom";
import { FilterMatchMode } from "primereact/api";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import DatePicker from 'react-datepicker';

import { accionExitosa, accionFallida } from '../../../shared/Utils/modals';

import { useGetEmpleadoCoordinadores } from "../../../hooks/useGetEmpleadoCoordinador";
import { useGetTiendaCoordinadores } from "../../../hooks/useGetTiendaCoordinador";

export const PantallaDetalleNomina = () => {


    //####################################################################################################################################################
    //### VARIABLES GLOBALES


    const navigate = useNavigate();
    const location = useLocation();

    const [show, setShow] = useState(false);
    const [error, setError] = useState(null);

    const [productividad, setProductividad] = useState([]);
    const [comprobantes, setComprobantes] = useState([]);
    const [comprobante, setComprobante] = useState([]);
    const [nomina, setNomina] = useState([]);

    const idCoordinador = decodeToken.tokenDecode();
    const idProcesoNomina = 0

    const handleShow = () => setShow(true);


    //####################################################################################################################################################
    //### EVENTOS


    useEffect(() => {

        if (location.state?.productividad) {

            formik.setValues(location.state.productividad);
            setProductividad(location.state.productividad);
        }
        else
            accionFallida({ titulo: 'E R R O R', mensaje: 'FALTA INFORMACIÓN' });

    }, []);

    const getInitialValues = () => {

        return {
            idProcesoNomina: 0,
            idPlanificacion: productividad.idPlanificacion,
            idCoordinador: productividad.idCoordinador,
            idOperador: 0,
            idTienda: 0,
            fechaDesde: productividad.fechaDesde,
            fechaHasta: productividad.fechaHasta,
            procesar: false,
        }

    }

    const formik = useFormik({
        initialValues: getInitialValues(),
        Form,
        onSubmit: values => {

            let idProcesoNomina = 0
            formik.values.procesar = false;

            let nomina = {
                idProcesoNomina: 0,
                idPlanificacion: productividad.idPlanificacion,
                idCoordinador: productividad.idCoordinador,
                idOperador: isNaN(values.idOperador) ? 0 : values.idOperador,
                idTienda: isNaN(values.idTienda) ? 0 : values.idTienda,
                fechaIni: values.fechaDesde,
                fechaEnd: values.fechaHasta,
                procesado: false
            };

            setNomina(nomina);
            getCalculoNomina(nomina);

        },
    });

    const getComprobanteNomina = () => {

        let idProcesoNomina = 0
        formik.values.procesar = false;

        let nomina = {
            idProcesoNomina: 0,
            idPlanificacion: productividad.idPlanificacion,
            idCoordinador: productividad.idCoordinador,
            idOperador: isNaN(formik.values.idOperador) ? 0 : formik.values.idOperador,
            idTienda: isNaN(formik.values.idTienda) ? 0 : formik.values.idTienda,
            fechaIni: formik.values.fechaDesde,
            fechaEnd: formik.values.fechaHasta,
            procesado: false
        };

        setNomina(nomina);
        getConsultaNomina(nomina);
    }

    const putProcesoNomina = () => {

        if (comprobantes.length > 0) {

            let nomina = {
                idProcesoNomina: comprobantes[0].idProcesoNomina,
                idPlanificacion: productividad.idPlanificacion,
                idCoordinador: productividad.idCoordinador,
                idOperador: isNaN(formik.values.idOperador) ? 0 : formik.values.idOperador,
                idTienda: isNaN(formik.values.idTienda) ? 0 : formik.values.idTienda,
                fechaIni: formik.values.fechaDesde,
                fechaEnd: formik.values.fechaHasta,
                procesado: true
            };

            setNomina(nomina)
            putPago(nomina)

        }
        else {
            accionFallida({ titulo: 'E R R O R', mensaje: "Debe generar un cálculo de nómina" });
        }

    }

    //### LISTADO

    const openComprobante = (row) => {

        setComprobante(row);
        setShow(true);
    }

    //####################################################################################################################################################
    //### FUNCIONES


    const strMoneda = new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", minimumFractionDigits: 2, });

    const strFecha = (date) => {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const strFechaList = (date) => {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${month}/${day}/${year}`;
    };

    //####################################################################################################################################################
    //### API


    const getCalculoNomina = async (pNomina) => {

        try {

            setComprobantes([])

            const response = await API.get(`Nomina/Calculo/${Number(pNomina.idPlanificacion)},${pNomina.fechaIni},${pNomina.fechaEnd},${Number(pNomina.idCoordinador)},${Number(pNomina.idOperador)},${Number(pNomina.idTienda)}`);

            if (response.status == 200 || response.status == 204) {
                setComprobantes(response.data);
                formik.values.procesar = true;
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

    const getConsultaNomina = async (pNomina) => {

        try {

            setComprobantes([])

            const response = await API.get(`Nomina/Consulta/${Number(pNomina.idProcesoNomina)},${Number(pNomina.idPlanificacion)},${pNomina.fechaIni},${pNomina.fechaEnd},${Number(pNomina.idCoordinador)},${Number(pNomina.idOperador)},${Number(pNomina.idTienda)}`);

            if (response.status == 200 || response.status == 204) {
                setComprobantes(response.data);
                formik.values.procesar = false;
            }
        }
        catch (er) {

            setComprobantes([])

            if (er.response?.data) {
                setError(er.response.data)
                accionFallida({ titulo: 'E R R O R', mensaje: JSON.stringify(er.response.data) });
            }
            else {
                accionFallida({ titulo: 'E R R O R', mensaje: er.message });
            }

        }
    }

    const putPago = async (pNomina) => {

        try {

            const response = await API.put(`Nomina/Pago/${Number(pNomina.idProcesoNomina)}`, pNomina);

            if (response.status == 200 || response.status == 204) {

                setComprobantes([])
                formik.values.procesar = false;
                accionExitosa({ titulo: 'E X I T O', mensaje: "Nómina pagada" })

            }
        }
        catch (er) {

            if (er.response?.data) {
                setError(er.response.data)
                accionFallida({ titulo: 'E R R O R', mensaje: JSON.stringify(er.response.data) });
            }
            else {
                accionFallida({ titulo: 'E R R O R', mensaje: er.message });
            }

        }

    }

    //####################################################################################################################################################
    //### COMBOS


    const operadoresOptions = useGetEmpleadoCoordinadores(idCoordinador).map((list) => ({ value: list.idOperador, label: list.nombres }));
    const tiendasOptions = useGetTiendaCoordinadores(idCoordinador).map((list) => ({ value: list.idTienda, label: list.nombreTienda }));


    //####################################################################################################################################################
    //### LISTADO


    const customStyle = { backgroundColor: '#F2F2F2' };


    //####################################################################################################################################################
    //### LISTADO | FILTROS


    const [globalFilterValue, setGlobalFilterValue] = useState('');

    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        idOperador: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        operador: { value: null, matchMode: FilterMatchMode.STARTS_WITH }
    });

    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };
        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    const initFilters = () => {
        setFilters({
            global: { value: null, matchMode: FilterMatchMode.CONTAINS },
            idOperador: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
            operador: { value: null, matchMode: FilterMatchMode.STARTS_WITH }
        });
        setGlobalFilterValue('')
    };

    const clearFilter = () => { initFilters(); }


    //####################################################################################################################################################
    //### LISTADO | EXPORTAR


    //### LISTADO | EXPORTAR - CSV

    const dt = useRef(null);

    const exportCSV = () => { dt.current.exportCSV(); };

    //### LISTADO | EXPORTAR - PDF

    const cols = [
        { field: 'IdOperador', header: 'Id Secuencia' },
        { field: 'Operador', header: 'Operador' },
        { field: 'Spot', header: 'Spot' },
        { field: 'Banco', header: 'Banco' },
        { field: 'Tarjeta', header: 'Tarjeta' },

        { field: 'Dias', header: 'Dias' },

        { field: 'Salario', header: 'Sueldo' },
        { field: 'SubTotal1', header: 'SubTotal' },

        { field: 'Descuento', header: 'Descuento' },
        { field: 'Bono', header: 'Bono' },
        { field: 'Gasolina', header: 'Gasolina' },
        { field: 'SubTotal2', header: 'Subtotal' },

        { field: 'SMG', header: 'SMG' },
        { field: 'Total', header: 'Total' },

        { field: 'STED', header: 'STED' },
        { field: 'Pago', header: 'Pago' },
    ];

    const exportColumns = cols.map((col) => ({ title: col.header, datakey: col.field }));

    const exportPdf = () => {
        import('jspdf').then((jsPDF) => {
            import('jspdf-autotable').then(() => {
                const doc = new jsPDF.default(0, 0);
                doc.autoTable(exportColumns, comprobantes);
                doc.save('Nomina.pdf');
            });
        });
    };

    //### LISTADO | EXPORTAR - EXCEL

    const exportExcel = () => {
        import('xlsx').then((xlsx) => {
            const worksheet = xlsx.utils.json_to_sheet(comprobantes);
            const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
            const excelBuffer = xlsx.write(workbook, {
                bookType: 'xlsx',
                type: 'array'
            });
            saveAsExcelFile(excelBuffer, 'Nómina');
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

                <ModalComprobanteNomina
                    show={show}
                    setShow={setShow}
                    comprobante={comprobante}
                    setcomprobante={setComprobante}
                />

                <div className='flex flex-wrap gap-2'>

                    <div className='col col-sm-3'>
                        <Form.Group>
                            <Form.Label>Operador:</Form.Label>
                            <Form.Control name="idOperador" as="select" value={formik.values.idOperador} onChange={formik.handleChange} onBlur={formik.handleBlur} >
                                <option value="">Seleccione un Operador</option>
                                {
                                    operadoresOptions.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))
                                }
                            </Form.Control>
                            <Form.Text className="text-danger">
                                {formik.touched.idOperador && formik.errors.idOperador ? (<div className="text-danger">{formik.errors.idOperador}</div>) : null}
                            </Form.Text>
                        </Form.Group>
                    </div>

                    <br />

                    <div className='col col-sm-3'>
                        <Form.Group>
                            <Form.Label>Sucursal:</Form.Label>
                            <Form.Control name="idTienda" as="select" value={formik.values.idTienda} onChange={formik.handleChange} onBlur={formik.handleBlur}>
                                <option value="">Seleccione la Sucursal</option>
                                {
                                    tiendasOptions.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))
                                }
                            </Form.Control>
                            <Form.Text className="text-danger">
                                {formik.touched.idTienda && formik.errors.idTienda ? (<div className="text-danger">{formik.errors.idTienda}</div>) : null}
                            </Form.Text>
                        </Form.Group>
                    </div>

                    <br />

                    <div className='col col-sm-2'>
                        <Form.Group>
                            <Form.Label>Fecha Desde:</Form.Label>
                            <DatePicker name="fechaDesde" autoComplete="off" style={{ width: "63%" }}
                                selected={formik.values.fechaDesde ? new Date(formik.values.fechaDesde) : null}
                                onChange={(date) => formik.setFieldValue('fechaDesde', date)}
                                onBlur={formik.handleBlur}
                                showMonthDropdown
                                showYearDropdown
                                className='form-control'
                            >
                            </DatePicker>
                            {formik.touched.fechaDesde && formik.errors.fechaDesde ? (<Form.Text className="text-danger">{formik.errors.fechaDesde}</Form.Text>) : null}
                        </Form.Group>
                    </div>

                    <br />

                    <div className='col col-sm-2'>
                        <Form.Group>
                            <Form.Label>Fecha Hasta:</Form.Label>
                            <DatePicker name="fechaHasta" autoComplete="off" style={{ width: "63%" }}
                                selected={formik.values.fechaHasta ? new Date(formik.values.fechaHasta) : null}
                                onChange={(date) => formik.setFieldValue('fechaHasta', date)}
                                onBlur={formik.handleBlur}
                                showMonthDropdown
                                showYearDropdown
                                className='form-control'
                            >
                            </DatePicker>
                            {formik.touched.fechaHasta && formik.errors.fechaHasta ? (<Form.Text className="text-danger">{formik.errors.fechaHasta}</Form.Text>) : null}
                        </Form.Group>
                    </div>

                    <br />

                    <div className='col col-sm-6'>
                        <Button
                            type="button"
                            style={{ backgroundColor: "#2596BE", borderColor: "#2596BE", width: "120px", height: "43px", marginLeft: "0px" }}
                            onClick={() => getComprobanteNomina()}
                            label="Consulta"
                            icon="pi pi-plus right"
                            iconPos="right"
                        >
                        </Button>
                        &nbsp;
                        <Button
                            type="submit"
                            style={{ backgroundColor: "#2596BE", borderColor: "#2596BE", width: "120px", height: "43px", marginLeft: "0px" }}
                            label="Cálculo"
                            icon="pi pi-plus right"
                            iconPos="right"
                        >
                        </Button>
                        &nbsp;
                        <Button
                            type="button"
                            style={{ backgroundColor: "#2596BE", borderColor: "#2596BE", width: "120px", height: "43px", marginLeft: "0px" }}
                            onClick={() => putProcesoNomina()}
                            label="Pago"
                            icon="pi pi-plus right"
                            iconPos="right"
                            disabled={formik.values.procesar ? false : true}
                        >
                        </Button>

                    </div>

                </div>

            </Form>

        );
    };

    const rightToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-3 justify-content-center justify-content-between">
                <Button type="button" tooltip="Descargar CSV" icon="pi pi-file" severity="secondary" rounded onClick={() => exportCSV(false)} data-pr-tooltip="CSV" style={{ marginRight: "5px" }}></Button>
                <Button type="button" icon="pi pi-file-excel" tooltip="Descargar Excel" severity="success" rounded onClick={exportExcel} data-pr-tooltip="XLS" style={{ marginRight: "5px" }}></Button>
                <Button type="button" icon="pi pi-file-pdf" tooltip="Descargar PDF" style={{ 'backgroundColor': 'red', borderColor: 'white', color: 'white' }} rounded onClick={exportPdf} data-pr-tooltip="PDF"></Button>
            </div>
        );
    };

    //### PANTALLA | LISTADO | HEADER

    const renderHeader = () => {
        return (

            <div className="d-flex justify-content-between">

                <Button type="button" icon="pi pi-filter-slash" severity="secondary" label="Quitar Filtros" style={{ marginRight: "5px" }} outlined onClick={clearFilter}></Button>
                <span className="p-input-icon-left">
                    <i className="pi pi-search"></i>
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Buscar..."></InputText>
                </span>

            </div>

        );
    };

    const header = renderHeader();

    //### PANTALLA | LISTADO | BODY

    return (

        <div className="mt-5">

            <CustomCard title="Calculo de Nomina">
                <div className="p-3">
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>
                    <DataTable
                        paginator rows={5}
                        rowsPerPageOptions={[5, 10, 25]}
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} rows"
                        ref={dt}
                        style={customStyle}
                        value={comprobantes}
                        dataKey="idEmpleado"
                        filters={filters}
                        filterDisplay="row"
                        globalFilterFields={['idOperador', 'operador']}
                        header={header}
                        emptyMessage="No data found.">
                        <Column
                            field="idOperador"
                            header="ID de Secuencia"
                            body=
                            {
                                (rowData) => {
                                    const _idOperador = String(rowData.idOperador).padStart(6, '0');
                                    return <a onClick={() => openComprobante(rowData)} style={{ color: '#007bff', cursor: 'pointer' }}>{_idOperador}</a>
                                }
                            }
                            filter
                            filterPlaceholder="Buscar por Id de Secuencia"
                            style={{ minWidth: '12rem' }}
                        />
                        <Column field="operador" header="Operador" filter filterPlaceholder="Buscar por operador" style={{ minWidth: '12rem' }}></Column>
                        <Column field="spot" header="Spot" style={{ minWidth: '12rem', textAlign: 'center' }}></Column>
                        <Column field="banco" header="Banco" style={{ minWidth: '12rem' }}></Column>
                        <Column field="tarjeta" header="Tarjeta" style={{ minWidth: '12rem' }}></Column>
                        
                        <Column field="dias" header="Días" style={{ minWidth: '12rem', textAlign: 'center' }}></Column>
                        <Column field="descansos" header="Descansos" style={{ minWidth: '12rem', textAlign: 'center' }}></Column>
                        <Column field="faltas" header="Faltas" style={{ minWidth: '12rem', textAlign: 'center' }}></Column>

                        <Column field="salario" header="Sueldo" body={(rowData) => strMoneda.format(rowData.salario)} style={{ minWidth: '12rem', textAlign: 'right' }}></Column>
                        <Column field="subTotal1" header="SubTotal" body={(rowData) => strMoneda.format(rowData.subTotal1)} style={{ minWidth: '12rem', textAlign: 'right' }}></Column>
                        <Column field="descuento" header="Desc." body={(rowData) => strMoneda.format(rowData.descuento)} style={{ minWidth: '12rem', textAlign: 'right' }}></Column>
                        <Column field="bono" header="Bono" body={(rowData) => strMoneda.format(rowData.bono)} style={{ minWidth: '12rem', textAlign: 'right' }}></Column>
                        <Column field="gasolina" header="Gasolina" body={(rowData) => strMoneda.format(rowData.gasolina)} style={{ minWidth: '12rem', textAlign: 'right' }}></Column>
                        <Column field="subTotal2" header="SubTotal" body={(rowData) => strMoneda.format(rowData.subTotal2)} style={{ minWidth: '12rem', textAlign: 'right' }}></Column>
                        <Column field="smg" header="SMG" body={(rowData) => strMoneda.format(rowData.smg)} style={{ minWidth: '12rem', textAlign: 'right' }}></Column>
                        <Column field="total" header="Total" body={(rowData) => strMoneda.format(rowData.total)} style={{ minWidth: '12rem', textAlign: 'right' }}></Column>
                        <Column field="sted" header="STED" body={(rowData) => strMoneda.format(rowData.sted)} style={{ minWidth: '12rem', textAlign: 'right' }}></Column>
                        <Column field="pago" header="Pago" body={(rowData) => strMoneda.format(rowData.pago)} style={{ minWidth: '12rem', textAlign: 'right' }}></Column>

                    </DataTable>
                </div>
            </CustomCard>

        </div>
    );

}