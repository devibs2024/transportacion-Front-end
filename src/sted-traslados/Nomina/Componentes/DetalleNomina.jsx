import React, { useState, useEffect, useRef } from "react";
import { FilterMatchMode } from "primereact/api";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import API from "../../../store/api";
import { Button } from "primereact/button";
import { useNavigate } from "react-router";
import { useLocation } from "react-router-dom";
import { Toolbar } from "primereact/toolbar";
import { CustomCard } from "../../../shared/card-custom";
import { rutaServidor } from "../../../routes/rutaServidor";
import * as decodeToken from '../../../shared/Utils/decodeToken';
import { Modal, Form } from "react-bootstrap";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import jsPDF from "jspdf";
import { array, date } from "yup";
import { data, event } from "jquery";
import { Formik, useFormik } from "formik";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import * as Yup from "yup";
import { accionExitosa, accionFallida } from '../../../shared/Utils/modals';
import { procesarErrores } from "../../../shared/Utils/procesarErrores";

import { useGetEmpleadoCoordinadores } from "../../../hooks/useGetEmpleadoCoordinador";
import { useGetTiendaCoordinadores } from "../../../hooks/useGetTiendaCoordinador";

export const PantallaDetalleNomina = (setNomina, nomina) => {

    const MySwal = withReactContent(Swal);
    const navigate = useNavigate();
    const location = useLocation();

    const [formState, setFormState] = useState(true);
    const [error, setError] = useState(null);

    const [productividades, setProductividades] = useState([]);
    const [volantes, setVolantes] = useState([]);

    const idCoordinador = decodeToken.tokenDecode();

    useEffect(() => {
        if (location.state?.productividad) {
            formik.setValues(location.state.productividad);
        }
        setProductividades(location.state.productividad)
    }, []);

    const getInitialValues = () => {

        return {
            idPlanificacion: 0,
            idCoordinador: 0,
            idOperador: 0,
            idTienda: 0,
            fechaDesde: '',
            fechaHasta: ''
        }

    }

    const formik = useFormik({
        initialValues: getInitialValues(),
        Form,
        onSubmit: values => {

            let nomina = {
                idPlanificacion: productividades.idPlanificacion,
                idCoordinador: productividades.idCoordinador,
                idOperador: isNaN(values.idOperador) ? 0 : values.idOperador,
                idTienda: isNaN(values.idTienda) ? 0 : values.idTienda,
                fechaDesde: values.fechaDesde,
                fechaHasta: values.fechaHasta
            };

            getCalculoNomina(nomina);

        },
    });

    const getCalculoNomina = async (datos) => {

        try {

            const response = await API.get(`CalculoNomina/${Number(datos.idPlanificacion)},${datos.fechaDesde},${datos.fechaHasta},${Number(datos.idCoordinador)},${Number(datos.idOperador)},${Number(datos.idTienda)}`);

            if (response.status == 200 || response.status == 204)
                setVolantes(response.data);
            else
                accionFallida({ titulo: 'E R R O R', mensaje: 'NO SE PUDO PROCESAR' });

        }
        catch (error) {

            setError(error.response.data);
            accionFallida({ titulo: 'E R R O R', mensaje: JSON.stringify(error.response.data) });

        }
    }


    //####################################################################################################################################################
    //### COMBOS


    const operadoresOptions = useGetEmpleadoCoordinadores(idCoordinador).map((list) => ({ value: list.idOperador, label: list.nombres }));
    const tiendasOptions = useGetTiendaCoordinadores(idCoordinador).map((list) => ({ value: list.idTienda, label: list.nombreTienda }));


    //####################################################################################################################################################
    //### LISTADO


    const cols = [
        { field: 'IdCoordinador', header: 'Id Secuencia' },
        { field: 'Coordinador', header: 'Coordinador' },

        { field: 'IdOperador', header: 'IdOperador' },
        { field: 'Operador', header: 'Operador' },

        { field: 'IdSegmento', header: 'IdSegmento' },
        { field: 'Segmento', header: 'Segmento' },
        { field: 'Spot', header: 'Spot' },

        { field: 'Tarjeta', header: 'Tarjeta' },
        { field: 'IdBanco', header: 'IdBanco' },
        { field: 'Banco', header: 'Banco' },

        { field: 'Salario', header: 'Salario' },
        { field: 'SMG', header: 'SMG' },

        { field: 'IdTienda', header: 'Tienda' },
        { field: 'Tienda', header: 'Tienda' },
        { field: 'IdZonaSted', header: 'Tienda' },
        { field: 'ZonaSted', header: 'ZonaSted' },

        { field: 'Dias', header: 'Dias' },

        { field: 'SubTotal1', header: 'SubTotal1' },
        { field: 'Descuento', header: 'Descuento' },
        { field: 'Bono', header: 'Bono' },
        { field: 'Gasolina', header: 'Gasolina' },
        { field: 'SubTotal2', header: 'SubTotal2' },
        { field: 'Total', header: 'Total' },
        { field: 'STED', header: 'STED' },
        { field: 'Pago', header: 'Pago' },
    ];

    const dt = useRef(null);


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


    const exportColumns = cols.map((col) => ({ title: col.header, datakey: col.field }));

    const customStyle = { backgroundColor: '#F2F2F2' };

    //### LISTADO | EXPORTAR - CSV

    const exportCSV = () => { dt.current.exportCSV(); };

    //### LISTADO | EXPORTAR - PDF

    const exportPdf = () => {
        import('jspdf').then((jsPDF) => {
            import('jspdf-autotable').then(() => {

                const doc = new jsPDF.default(0, 0);

                doc.autoTable(exportColumns, volantes);
                doc.save('Nomina.pdf');
            });
        });
    };

    //### LISTADO | EXPORTAR - EXCEL

    const exportExcel = () => {

        import('xlsx').then((xlsx) => {
            const worksheet = xlsx.utils.json_to_sheet(volantes);
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

                <div className='flex flex-wrap gap-2'>

                    <div className='col col-sm-3'>
                        <Form.Group controlId="idOperador">
                            <Form.Label>Operador:</Form.Label>
                            <Form.Control as="select" value={formik.values.idOperador} onChange={formik.handleChange} onBlur={formik.handleBlur} >
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
                        <Form.Group controlId="idTienda">
                            <Form.Label>Sucursal:</Form.Label>
                            <Form.Control as="select" value={formik.values.idTienda} onChange={formik.handleChange} onBlur={formik.handleBlur}>
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
                        <Form.Group controlId="fechaDesde">
                            <Form.Label>Fecha Desde:</Form.Label>
                            <DatePicker id="fechaDesde" name="fechaDesde" autoComplete="off" style={{ width: "63%" }}
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
                        <Form.Group controlId="fechaHasta">
                            <Form.Label>Fecha Hasta:</Form.Label>
                            <DatePicker id="fechaHasta" name="fechaHasta" autoComplete="off" style={{ width: "63%" }}
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
                            type="submit"
                            style={{ backgroundColor: "#2596BE", borderColor: "#2596BE", width: "193px", height: "43px", marginLeft: "0px" }}
                            label="Genera Cálculo"
                            icon="pi pi-plus right"
                            iconPos="right"
                        >
                        </Button>
                    </div>

                </div>

            </Form>

        )
    }

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
        )
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
                        value={volantes}
                        dataKey="idEmpleado"
                        filters={filters}
                        filterDisplay="row"
                        globalFilterFields={['idOperador', 'operador']}
                        header={header}
                        emptyMessage="No data found.">
                        <Column field="idOperador" header="ID Sec." filter filterPlaceholder="Buscar por id secuencia" style={{ minWidth: '12rem' }}></Column>
                        <Column field="operador" header="Operador" filter filterPlaceholder="Buscar por operador" style={{ minWidth: '12rem' }}></Column>
                        <Column field="spot" header="Spot" style={{ minWidth: '12rem' }}></Column>
                        <Column field="banco" header="Banco" style={{ minWidth: '12rem' }}></Column>
                        <Column field="tarjeta" header="Tarjeta" style={{ minWidth: '12rem' }}></Column>
                        <Column field="dias" header="Dias" style={{ minWidth: '12rem' }}></Column>
                        <Column field="salario" header="Sueldo" style={{ minWidth: '12rem' }}></Column>
                        <Column field="subTotal1" header="SubTotal" style={{ minWidth: '12rem' }}></Column>
                        <Column field="descuento" header="Desc." style={{ minWidth: '12rem' }}></Column>
                        <Column field="bono" header="Bono" style={{ minWidth: '12rem' }}></Column>
                        <Column field="gasolina" header="Gasolina" style={{ minWidth: '12rem' }}></Column>
                        <Column field="subTotal2" header="SubTotal" style={{ minWidth: '12rem' }}></Column>
                        <Column field="smg" header="SMG" style={{ minWidth: '12rem' }}></Column>
                        <Column field="total" header="Total" style={{ minWidth: '12rem' }}></Column>
                        <Column field="sted" header="STED" style={{ minWidth: '12rem' }}></Column>
                        <Column field="pago" header="Pago" style={{ minWidth: '12rem' }}></Column>
                    </DataTable>
                </div>
            </CustomCard>
        </div>
    );

}