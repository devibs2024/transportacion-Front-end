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

export const PantallaDetalleNomina = ({ setOperador, operador }) => {

    const [formState, setFormState] = useState(true);
    const [error, setError] = useState(null);

    const [idOperador, setIdOperador] = useState(0);
    const MySwal = withReactContent(Swal);
    const navigate = useNavigate();
    const location = useLocation();

    const [calculonomina, setCalculoNomina] = useState([]);

    const idCoordinador = decodeToken.tokenDecode();

    useEffect(() => {
        if (location.state?.operador) {
            formik.setValues(location.state.operador)
            setIdOperador(location.state.operador.idOperador);
        }
        else if (operador.idOperador != 0) {
            formik.setValues(operador)
        }
    }, []);

    const cols = [
        { field: 'IdPlanificacion', header: 'Id Secuencia' },
        { field: 'IdCoordinador', header: 'Id Secuencia' },
        { field: 'Coordinador', header: 'Coordinador' },        
        { field: 'IdOperador', header: 'Operador' },
        { field: 'Operador', header: 'Operador' },
        { field: 'Banco', header: 'Banco' },
        { field: 'IdTienda', header: 'Tienda' },
        { field: 'Tienda', header: 'Tienda' },
        { field: 'ZonaSted', header: 'ZonaSted' },
        { field: 'SubTotal', header: 'SubTotal' },
        { field: 'MinutosRetardo', header: 'MinutosRetardo' },
        { field: 'DescuentoRetardo', header: 'DescuentoRetardo' },
        { field: 'DescuentoSted', header: 'DescuentoSted' },
        { field: 'Gasolina', header: 'Gasolina' },
        { field: 'PagoSMG', header: 'PagoSMG' },
        { field: 'TotalPagar', header: 'TotalPagar' },
    ];

    const dt = useRef(null);

    const exportColumns = cols.map((col) => ({ title: col.header, datakey: col.field }));

    const operadoresOptions = useGetEmpleadoCoordinadores(idCoordinador).map((list) => ({ value: list.idOperador, label: list.nombres }));
    const tiendasOptions = useGetTiendaCoordinadores(idCoordinador).map((list) => ({ value: list.idTienda, label: list.nombreTienda }));

    const formatDateToYYYYMMDD = (date) => {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '');

        return `${year}-${month}-${day}`;
    }

    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        idPlanificacion: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        //nombreOperador: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        //nombreCoordinador: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        //nombreTienda: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        //banco: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        //zonasted: { value: null, matchMode: FilterMatchMode.STARTS_WITH }
    });

    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };
        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    const initFilters = () => {
        setFilters({
            global: { value: null, matchMode: FilterMatchMode.CONTAINS },
            idPlanificacion: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
            //nombreOperador: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
            //nombreCoordinador: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
            //nombreTienda: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
            //banco: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
            //zonasted: { value: null, matchMode: FilterMatchMode.STARTS_WITH }
        });
        setGlobalFilterValue('')
    };

    const clearFilter = () => {
        initFilters();
    }

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

    const customStyle = {
        backgroundColor: '#F2F2F2',
    };

    const exportCSV = () => {
        dt.current.exportCSV();
    };

    const exportPdf = () => {
        import('jspdf').then((jsPDF) => {
            import('jspdf-autotable').then(() => {

                const doc = new jsPDF.default(0, 0);

                doc.autoTable(exportColumns, calculonomina);
                doc.save('Nomina.pdf');
            });
        });
    };

    const exportExcel = () => {

        import('xlsx').then((xlsx) => {
            const worksheet = xlsx.utils.json_to_sheet(calculonomina);
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

    const getInitialValues = () => {

        return {
            idCoordinador: 0,
            idOperador: 0,
            nombreOperador: '',
            idTienda: 0,
            nombreTienda: '',
            fechaDesde: '',
            fechaHasta: ''
        }

    }

    const formik = useFormik({
        initialValues: getInitialValues(),
        validationSchema: Yup.object().shape({
            idOperador: Yup.string().required("El operador es obligatorio"),
            idTienda: Yup.string().required("La sucursal es obligatoria"),
        }),
        Form,
        onSubmit: values => {

            let operador = {
                idCoordinador: idCoordinador,
                idOperador: values.idOperador,
                nombreOperador: values.nombreOperador,
                idTienda: values.idTienda,
                nombreTienda: values.nombreTienda,
                fechaDesde: values.fechaDesde,
                fechaHasta: values.fechaHasta
            };

            getCalculoNomina(operador);

        },
    });

    const getCalculoNomina = async (datos) => {

        try {

            const response = await API.get(`CalculoNomina/${datos.fechaDesde},${datos.fechaHasta},${Number(datos.idOperador)},${Number(datos.idTienda)}`);

            console.log(response.data)

            if (response.status == 200 || response.status == 204)                
                setCalculoNomina(response.data);
            else 
                accionFallida({ titulo: 'E R R O R', mensaje: 'NO SE PUDO PROCESAR' });

        } catch (error) {

            setError(error.response.data);
            accionFallida({ titulo: 'E R R O R <br/> (INESPERADO)', mensaje: JSON.stringify(error.response.data) });
        
        }
    }

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
                        value={calculonomina}
                        dataKey="idEmpleado"
                        filters={filters}
                        filterDisplay="row"
                        globalFilterFields={['idSecuencia', 'coordinador', 'operador', 'inicio', 'final']}
                        header={header}
                        emptyMessage="No data found.">
                        <Column field="coordinador" header="Coordinador" filter filterPlaceholder="Buscar por coordinador" style={{ minWidth: '12rem' }}></Column>                        
                        <Column field="tienda" header="Tienda" filter filterPlaceholder="Buscar por coordinador" style={{ minWidth: '12rem' }}></Column>                        
                        <Column field="zonaSted" header="ZonaSted" filter filterPlaceholder="Buscar por coordinador" style={{ minWidth: '12rem' }}></Column>                        
                        <Column field="operador" header="Operador" filter filterPlaceholder="Buscar por coordinador" style={{ minWidth: '12rem' }}></Column>                        
                        <Column field="banco" header="Banco" filter filterPlaceholder="Buscar por coordinador" style={{ minWidth: '12rem' }}></Column>                        
                    </DataTable>
                </div>
            </CustomCard>
        </div>
    );

}