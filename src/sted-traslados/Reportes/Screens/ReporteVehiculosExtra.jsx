import API from '../../../store/api';

import React, { useState, useEffect, useRef } from 'react';
import * as decodeToken from '../../../shared/Utils/decodeToken';

import { useFormik } from "formik";
import { Form } from "react-bootstrap";

import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import { Toolbar } from 'primereact/toolbar';
import { CustomCard } from '../../../shared/card-custom';
import { FilterMatchMode } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import { accionFallida } from '../../../shared/Utils/modals';

import { useGetTiendaCoordinadores } from "../../../hooks/useGetTiendaCoordinador";
import { useGetClienteCoordinadores } from "../../../hooks/useGetClienteCoordinador";
import { useGetTipoVehiculos } from "../../../hooks/useGetTipoVehiculos";

export const PantallaReporteVehiculosExtra = () => {

    //####################################################################################################################################################
    //### VARIABLES GLOBALES


    const [error, setError] = useState(null);

    const [registrosReporte, setRegistrosReporte] = useState([]);

    const idCoordinador = decodeToken.tokenDecode();


    //####################################################################################################################################################
    //### EVENTOS

    useEffect(() => {

    }, []);

    const formik = useFormik({
        initialValues: {
            idCoordinador: 0,
            idCliente: 0,
            idTienda: 0,
            IdTipoVehiculo: 0,
            fechaDesde: '',
            fechaHasta: ''
        },
        Form,
        onSubmit: values => {

            let filtros = {
                idCoordinador: idCoordinador,
                idCliente: isNaN(values.idCliente) ? 0 : values.idCliente,
                idTienda: isNaN(values.idTienda) ? 0 : values.idTienda,
                idTipoVehiculo: isNaN(values.idTipoVehiculo) ? 0 : values.idTipoVehiculo,
                fechaIni: strFecha(new Date(values.fechaDesde)),
                fechaEnd: strFecha(new Date(values.fechaHasta))
            }

            getReporte(filtros)
        }
    });

    const CustomInput = ({ value, onClick }) => (
        <Form.Control
            className="form-control"
            type="text"
            onClick={onClick}
            value={value}
            readOnly
        />
    );

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

    const getReporte = async (pFiltros) => {

        try {

            setRegistrosReporte([])

            const response = await API.get(`Reporte/VehiculosExtra/${pFiltros.fechaIni},${pFiltros.fechaEnd},${Number(pFiltros.idCoordinador)},${Number(pFiltros.idCliente)},${Number(pFiltros.idTienda)},${Number(pFiltros.idTipoVehiculo)}`);

            if (response.status == 200 || response.status == 204) {
                setRegistrosReporte(response.data);
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

    //####################################################################################################################################################
    //### COMBOS


    const tiendasOptions = useGetTiendaCoordinadores(idCoordinador).map((list) => ({ value: list.idTienda, label: list.nombreTienda }));
    const clientesOptions = useGetClienteCoordinadores(idCoordinador).map((list) => ({ value: list.idCliente, label: list.nombreCliente }));
    const tipoVehiculosOptions = useGetTipoVehiculos().map(s => ({ value: s.idTipoVehiculo, label: s.tipoVehiculo }));

    //####################################################################################################################################################
    //### LISTADO


    const customStyle = { backgroundColor: '#F2F2F2' };
    const dt = useRef(null);


    //####################################################################################################################################################
    //### LISTADO | FILTROS


    const [globalFilterValue, setGlobalFilterValue] = useState('');

    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        cliente: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        tienda: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        tipoVehiculo: { value: null, matchMode: FilterMatchMode.STARTS_WITH }
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
            cliente: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
            tienda: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
            tipoVehiculo: { value: null, matchMode: FilterMatchMode.STARTS_WITH }
        });
        setGlobalFilterValue('')
    };

    const clearFilter = () => { initFilters(); }


    //####################################################################################################################################################
    //### LISTADO | EXPORTAR


    //### LISTADO | EXPORTAR - CSV


    const exportCSV = () => { dt.current.exportCSV(); };

    //### LISTADO | EXPORTAR - PDF

    const cols = [
        { field: 'cliente', header: 'Sucursal' },
        { field: 'tienda', header: 'Sucursal' },
        { field: 'tipoVehiculo', header: 'TipoVehiculo' }
    ]

    const exportColumns = cols.map((col) => ({ title: col.header, datakey: col.field }));

    const exportPdf = () => {
        import('jspdf').then((jsPDF) => {
            import('jspdf-autotable').then(() => {
                const doc = new jsPDF.default(0, 0);
                doc.autoTable(exportColumns, registrosReporte);
                doc.save('Nomina.pdf');
            });
        });
    };

    //### LISTADO | EXPORTAR - EXCEL

    const exportExcel = () => {
        import('xlsx').then((xlsx) => {

            var dtDataVis = document.getElementById("dtData");
            var workbook = xlsx.utils.table_to_book(dtDataVis);
            var ws = workbook.Sheets["Vehiculos Extra"];
            const excelBuffer = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
            saveAsExcelFile(excelBuffer, 'VehiculosExtra');

            // const worksheet = xlsx.utils.json_to_sheet(registrosReporte);
            // const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
            // const excelBuffer = xlsx.write(workbook, {
            //     bookType: 'xlsx',
            //     type: 'array'
            // });
            // saveAsExcelFile(excelBuffer, 'Nómina');

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

                <Container>

                    <Row>

                        <Col>

                            <Form.Group controlId="fechaDesde">
                                <Form.Label> Fecha Desde: </Form.Label>
                                <br />
                                <DatePicker
                                    id="fechaDesde"
                                    name="fechaDesde"
                                    autoComplete="off"
                                    style={{ width: "63%" }}
                                    selected={formik.values.fechaDesde ? new Date(formik.values.fechaDesde) : null}
                                    onChange={(date) => formik.setFieldValue('fechaDesde', date)}
                                    onBlur={formik.handleBlur}
                                    showMonthDropdown
                                    showYearDropdown
                                    customInput={<CustomInput />}
                                />
                                {formik.touched.fechaDesde && formik.errors.fechaDesde ? (<Form.Text className="text-danger">{formik.errors.fechaDesde}</Form.Text>) : null}
                            </Form.Group>

                        </Col>

                        <Col>

                            <Form.Group controlId="fechaHasta">
                                <Form.Label> Fecha Hasta: </Form.Label>
                                <br />
                                <DatePicker
                                    id="fechaHasta"
                                    name="fechaHasta"
                                    selected={formik.values.fechaHasta ? new Date(formik.values.fechaHasta) : null}
                                    onChange={(date) => formik.setFieldValue('fechaHasta', date)}
                                    onBlur={formik.handleBlur}
                                    showMonthDropdown
                                    showYearDropdown
                                    customInput={<CustomInput />}
                                />
                                {formik.touched.fechaHasta && formik.errors.fechaHasta ? (<Form.Text className="text-danger">{formik.errors.fechaHasta}</Form.Text>) : null}
                            </Form.Group>

                        </Col>

                        <Col>
                            <Form.Group controlId="idCliente">
                                <Form.Label>Cliente:</Form.Label>
                                <Form.Control as="select"
                                    value={formik.values.idCliente}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                >
                                    <option value="">Seleccione el Cliente</option>
                                    {clientesOptions.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </Form.Control>
                                <Form.Text className="text-danger">
                                    {formik.touched.idCliente && formik.errors.idCliente ? (<div className="text-danger">{formik.errors.idCliente}</div>) : null}
                                </Form.Text>
                            </Form.Group>

                        </Col>

                        <Col>

                            <Form.Group controlId="idTienda">
                                <Form.Label>Sucursal:</Form.Label>
                                <Form.Control as="select"
                                    value={formik.values.idTienda}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                >
                                    <option value="">Seleccione la Sucursal</option>
                                    {tiendasOptions.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </Form.Control>
                                <Form.Text className="text-danger">
                                    {formik.touched.idTienda && formik.errors.idTienda ? (<div className="text-danger">{formik.errors.idTienda}</div>) : null}
                                </Form.Text>
                            </Form.Group>

                        </Col>

                        <Col>

                            <Form.Group controlId="idTipoVehiculo">
                                <Form.Label>Tipo de Vehículo:</Form.Label>
                                <Form.Control as="select"
                                    value={formik.values.idTipoVehiculo}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                >
                                    <option value="">Seleccione el Tipo de Vehículo</option>
                                    {tipoVehiculosOptions.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </Form.Control>
                                <Form.Text className="text-danger">
                                    {formik.touched.idTipoVehiculo && formik.errors.idTipoVehiculo ? (<div className="text-danger">{formik.errors.idTipoVehiculo}</div>) : null}
                                </Form.Text>
                            </Form.Group>

                        </Col>

                    </Row>

                    <Row>

                        <Col>

                            <Button
                                type="submit"
                                style={{ backgroundColor: "#2596BE", borderColor: "#2596BE", width: "250px", height: "43px", marginLeft: "0px" }}
                                label="Generar Reporte"
                                icon="pi pi-plus right"
                                iconPos="right"
                            >
                            </Button>

                        </Col>

                        <Col>
                        </Col>

                        <Col>
                        </Col>

                        <Col>
                        </Col>

                        <Col>
                        </Col>

                    </Row>

                </Container>


            </Form >

        );
    };

    const rightToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-3 justify-content-center justify-content-between">
                <Button type='button' tooltip='Descargar CSV' icon="pi pi-file" severity='secondary' rounded onClick={() => exportCSV(false)} data-pr-tooltip='CSV' style={{ marginRight: "5px" }}></Button>
                <Button type='button' tooltip='Descargar Excel' icon="pi pi-file-excel" severity='success' rounded onClick={exportExcel} data-pr-tooltip='XLS' style={{ marginRight: "5px" }}></Button>
                <Button type="button" tooltip='Descargar PDF' icon="pi pi-file-pdf" style={{ 'backgroundColor': 'red', borderColor: 'white', color: 'white' }} rounded onClick={exportPdf} data-pr-tooltip="PDF"></Button>
            </div>
        );
    };

    //### PANTALLA | LISTADO | HEADER

    const renderHeader = () => {
        return (
            <div className="d-flex justify-content-between">
                <Button type='button' icon="pi pi-filter-slash" severity='secondary' label="Quitar Filtros" style={{ marginRight: "5px" }} outlined onClick={clearFilter}></Button>
                <span className="p-input-icon-left">
                    <i className="pi pi-search"></i>
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder='Buscar...'></InputText>
                </span>
            </div>
        );
    };

    const header = renderHeader();

    //### PANTALLA | LISTADO | BODY

    return (
        <div className='mt-5'>
            <CustomCard title="Reporte de Vehículos Extra">
                <div className='card'>
                    <Toolbar className='mb-4' left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>
                    <DataTable
                        id="dtData"
                        paginator rows={5}
                        rowsPerPageOptions={[5, 10, 25]}
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} rows"
                        ref={dt}
                        style={customStyle}
                        value={registrosReporte}
                        datakey="idCliente"
                        filters={filters}
                        filterDisplay="row"
                        globalFilterFields={['cliente', 'tienda', 'tipoVehiculo']}
                        header={header}
                        emptyMessage="No data found."
                    >
                        <Column field='cliente' header='Cliente' filter filterPlaceholder="Buscar por cliente" style={{ minWidth: '12rem' }}></Column>
                        <Column field='tienda' header='Sucursal' filter filterPlaceholder="Buscar por Sucursal" style={{ minWidth: '12rem' }}></Column>
                        <Column field='tipoVehiculo' header='Tipo Vehículo' filter filterPlaceholder="Buscar por tipo de vehículo" style={{ minWidth: '12rem' }}></Column>
                        <Column field='unidadesSpot' header='Unidades Spot' style={{ minWidth: '12rem', textAlign: 'center' }}></Column>
                        <Column style={{ minWidth: '32rem' }}
                            header="Unidades Solicitadas"
                            body=
                            {
                                (rowData) => {
                                    return (
                                        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                                            {
                                                rowData.listDias.map
                                                    (
                                                        (option, index) => {
                                                            return (
                                                                <div
                                                                    key={index}
                                                                    style={{
                                                                        padding: '5px',
                                                                        fontWeight: 'regular',
                                                                        textAlign: 'center',
                                                                        width: '50px',
                                                                        border: '1px solid'
                                                                    }}
                                                                >
                                                                    {option.sol}
                                                                </div>
                                                            );
                                                        }
                                                    )
                                            }
                                        </div>
                                    );
                                }
                            }
                            autoWidth
                        />
                        <Column field='totalUnidadesSolicitadas' header='Total Utilizadas' style={{ minWidth: '12rem', textAlign: 'center' }}></Column>
                        <Column style={{ minWidth: '32rem' }}
                            header="Unidades Spot"
                            body=
                            {
                                (rowData) => {
                                    return (
                                        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                                            {
                                                rowData.listDias.map
                                                    (
                                                        (option, index) => {
                                                            return (
                                                                <div
                                                                    key={index}
                                                                    style={{
                                                                        padding: '5px',
                                                                        fontWeight: 'regular',
                                                                        textAlign: 'center',
                                                                        width: '50px',
                                                                        border: '1px solid'
                                                                    }}
                                                                >
                                                                    {option.spot}
                                                                </div>
                                                            );
                                                        }
                                                    )
                                            }
                                        </div>
                                    );
                                }}
                            autoWidth
                        />
                        <Column field='totalUnidadesSpot' header='Total Unidades Spot' style={{ minWidth: '12rem', textAlign: 'center' }}></Column>
                        <Column style={{ minWidth: '32rem' }}
                            header="Unidades Totales"
                            body=
                            {
                                (rowData) => {
                                    return (
                                        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                                            {
                                                rowData.listDias.map
                                                    (
                                                        (option, index) => {
                                                            return (
                                                                <div
                                                                    key={index}
                                                                    style={{
                                                                        padding: '5px',
                                                                        fontWeight: 'regular',
                                                                        textAlign: 'center',
                                                                        width: '50px',
                                                                        border: '1px solid'
                                                                    }}
                                                                >
                                                                    {option.tot}
                                                                </div>
                                                            );
                                                        }
                                                    )
                                            }
                                        </div>
                                    );
                                }}
                            autoWidth
                        />
                        <Column field='totalUnidades' header='Total Unidades Utilizadas' style={{ minWidth: '12rem', textAlign: 'center' }}></Column>
                        <Column field='totalUnidadesGeneral' header='Total General' style={{ minWidth: '12rem', textAlign: 'center' }}></Column>
                    </DataTable>
                </div>
            </CustomCard>
        </div>
    );
}