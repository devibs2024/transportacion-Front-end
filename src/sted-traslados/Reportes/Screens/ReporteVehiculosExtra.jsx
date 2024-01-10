import { CustomCard } from "../../../shared/card-custom";
import { DataTable } from "primereact/datatable";
import { FilterMatchMode } from "primereact/api";
import API from "../../../store/api";
import React, { useState, useEffect, useRef} from "react";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { accionExitosa, accionFallida, confirmarAccion } from "../../../shared/Utils/modals";
import { useNavigate } from "react-router-dom";
import { Toolbar } from "primereact/toolbar";
import { Button } from "primereact/button";
import { rutaServidor } from "../../../routes/rutaServidor";
import { procesarErrores } from "../../../shared/Utils/procesarErrores";
import { useFormik } from "formik";
import { Form } from "react-bootstrap";
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
import jsPDF from "jspdf";


export const PantallaReporteVehiculosExtra = () => {

    const [idCliente, serIdCliete] = useState(0);
    const [idTienda, setIdTiendas] = useState(0);
    const [idTipovehiculo, setIdTipoVehiculo] = useState(0);
    const [Tiendas, setTiendas] = useState([]);
    const [Clientes, setClientes] = useState([]);
    const [TipoVehiculos, setIdTipoVehiculos] = useState([]);

    const formatDateToYYYYMMDD = (date) => {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');

        return `${year}-${month}-${day}`;
    };

    const [showFechaFin, setShowFechaFin] = useState(false);
    const handleSwitchChange = (e) => {
        setShowFechaFin(e.target.checkes);
    };

    const cols = [
        {field: 'clave', header: 'Clave Cliente'},
        {field: 'nombreCliente', header: 'Nombre'},
        {field: 'claveTieda', header: 'ClaveTienda'},
        {field: 'nombreTienda', header: 'NombreTienda'},
        {field: 'nombreTipoVehiculo', header: 'TipoVehiculo'},
        {field: 'unidadesSpot', header: 'UnidadesSpot'},
        {field: 'totalUtilizades', header: 'TotalUtilizadas'},
        {field: 'totalUnidadesSpot', header: 'TotalUnidadesSpot'},
        {field: 'totalUnidadesUtilizadas', header: 'TotalUnidadesUtilizadas'},
        {field: 'totalGeneral', header: 'TotalGeneral'}
    ]

    const dt = useRef(null);

    const exportColumns = cols.map((col) => ({ title: col.header, datakey: col.field}));

    const navigate = useNavigate();

    useEffect(() => {
        
    })

    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS},
        clave: { value: null, matchMode: FilterMatchMode.STARTS_WITH},
        nombreCliente: { value: null, matchMode: FilterMatchMode.STARTS_WITH},
    });

    const [globalFilterValue, setGlobalFilterValue] = useState('');

    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters};

        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    const initFilters = () => {
        setFilters({
            global: { value: null, matchMode: FilterMatchMode.CONTAINS},
            clave: { value: null, matchMode: FilterMatchMode.STARTS_WITH},
            nombreCliente: { value: null, matchMode: FilterMatchMode.STARTS_WITH},
            nombreTienda: { value: null, matchMode: FilterMatchMode.STARTS_WITH},
        });

        setGlobalFilterValue('')
    }

    const clearFilter = () => {
        initFilters();
    }

    const renderHeader = () => {
        return(
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
        backgroundColor: '#F2F2F1',
    };

    const exportCSV = () => {
        dt.current.exportCSV();
    }

    const exportPdf = () => {
        import('jspdf').then((jsPDF) => {
            import('jspdf-autotable').then(() => {
                const doc = new jsPDF.default(0, 0);

                doc.autoTable(exportColumns, Clientes);
                doc.save('VehiculosUtilizados.pdf');
            });
        });
    };

    const exportExcel = () => {
        import('xlsx').then((xlsx) => {
            const worksheet = xlsx.utils.json_to_sheet(Clientes);
            const workbook = { Sheets: {data: worksheet }, SheetNames: ['data'] };
            const excelBuffer = xlsx.write(workbook, {
                bookType: 'xlsx',
                type: 'array'
            });

            saveAsExcelFile(excelBuffer, 'Clientes');
        });
    };

    const saveAsExcelFile = (buffer, fileName) => {
        import('file-saver').then((module) => {
            if(module && module.default){
                let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
                let EXCEL_EXTENSION = '.xlsx';
                const data = new Blob([buffer], {
                    type: EXCEL_TYPE
                });

                module.default.saveAs(data, fileName + '_export_' +  new Date().getTime() + EXCEL_EXTENSION);
            }
        });
    };

    const actionButtons = (rowData) => {
        return(
            <div className='row'>
                <Button icon="pi pi-pencil" severity='warning' rounded style={{ marginRight: "5px"}} tooltip='Editar'></Button>
                <Button icon="pi pi-trash" rounded severity='warning' tooltip='Eliminar'></Button>
            </div>
        );
    };

    const clientesOptions = Clientes.map(s => ({
        value: s.idCliente,
        label: s.nombreCliente
    }));

    const tiendasOptions = Tiendas.map(t => ({
        value: t.idTienda,
        label: t.nombreTienda
    }));

    const tipovehiculoOptions = TipoVehiculos.map(v => ({
        value: v.idTipovehiculo,
        label: v.nombreTipoVehiculo
    }));

    const formik = useFormik({
        initialValues: {
            idCliente: 0,
            idTienda: 0,
            idTipovehiculo: 0,
            fecha: '',
            fechaHasta: ''
        },

        onSubmit: values => {
            console.log(values);

            const detalleReporteVehiculosExtra = {
                idCliente: values.idCliente,
                idTienda: values.idTienda,
                idTipovehiculo: values.idTipovehiculo,
                fecha: formatDateToYYYYMMDD(values.fecha),
                fechaHasta: formatDateToYYYYMMDD(values.fechaHasta)
            }

            console.log(detalleReporteVehiculosExtra)
        }
    });

    const leftToolbarTemplate = () => {
        return(
            <div className='flex flex-wrap gap-2'>
                <Form.Group controlId="fecha">
                    <Form.Label>Fecha:</Form.Label>
                    <DatePicker id="fecha" name="fecha" autoComplete="off" style={{with: "66%"}} selected={formik.values.fecha ? new Date(formik.values.fecha) : null}
                        onChange={(date) => formik.setFieldValue('fecha', date)}
                        onBlur={formik.handleBlur}
                        showMonthDropdown
                        showYearDropdown
                        className='form-control'>                        
                    </DatePicker>
                {formik.touched.fecha && formik.errors.fecha ? (<Form.Text className="text-danger">{formik.errors.fecha}</Form.Text>) : null}
                </Form.Group>                
                <br></br>
                <Form.Group controlId="fechaHasta">
                    <Form.Label>Fecha Hasta:</Form.Label>
                    <DatePicker id="fechaHasta" name="fechaHasta" autoComplete="off" style={{with: "66%"}}
                        selected={formik.values.fechaHasta ? new Date(formik.values.fechaHasta) : null}
                        onChange={(date) => formik.setFieldValue('fechaHasta', date)}
                        onBlur={formik.handleBlur}
                        showMonthDropdown
                        showYearDropdown
                        className="form-control">                        
                    </DatePicker>
                {formik.touched.fechaHasta && formik.errors.fechaHasta ? (<Form.Text autoComplete="off" className="text-danger">{formik.errors.fechaHasta}</Form.Text>) : null}
                </Form.Group>
                <br></br>
                <Form.Group controlId="idCliente">
                    <Form.Label>Cliente</Form.Label>
                    <Form.Control as="select"
                        value={formik.values.idCliente}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}>
                            <option value="">Seleccione Cliente</option>
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
                <br></br>
                <Form.Group controlId="idTienda">
                    <Form.Label>Sucursal</Form.Label>
                    <Form.Control as = "select"
                        value={formik.values.idTienda}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}>
                            <option value="">Seleccione Sucursal</option>
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
                <br></br>
                <Form.Group controlId="idTipovehiculo">
                    <Form.Label>TipoVehiculo</Form.Label>
                    <Form.Control as = "select"
                        value={formik.values.idTipovehiculo}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}>
                            <option value="">Seleccione Tipo vehículo</option>
                            {tipovehiculoOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </Form.Control>
                        <Form.Text className="text-danger">
                            {formik.touched.idTipovehiculo && formik.errors.idTipovehiculo ? (<div className="text-danger">{formik.errors.idTipovehiculo}</div>) : null}
                        </Form.Text>
                </Form.Group>
                {/* <br></br>
                <Button style={{ backgroundColor: "#2596BE", borderColor: "#2596BE", width: "190px", height: "53px", marginLeft: "38px"}} label='Generar Reporte' icon="pi pi-plus right" iconPos="right" onClick={() => navigate()}></Button> */}
            </div>            
        );
    };

    const rightToolbarTemplate = () => {
        return(
            <div className="flex flex-wrap gap-3 justify-content-center justify-content-between">
                <Button style={{ backgroundColor: "#2596BE", borderColor: "#2596BE", width: "190px", height: "53px", marginLeft: "38px"}} label='Generar Reporte' icon="pi pi-plus right" iconPos="right" onClick={() => navigate()}></Button>
                <br></br>
                <Button type='button' tooltip='Descargar CSV' icon="pi pi-file" severity='secondary' rounded onClick={() => exportCSV(false)} data-pr-tooltip='CSV' style={{ marginRight: "5px"}}></Button>
                <Button type='button' tooltip='Descargar Excel' icon="pi pi-file-excel" severity='success' rounded onClick={exportExcel} data-pr-tooltip='XLS' style={{ marginRight: "5px"}}></Button>
                <Button type="button" tooltip='Descargar PDF' icon="pi pi-file-pdf" style={{ 'backgroundColor': 'red', borderColor: 'white', color: 'white'}} rounded onClick={exportPdf} data-pr-tooltip="PDF"></Button>                                
            </div>            
        );
    };

    return(
        <div className='mt-5'>
            <CustomCard title="Reporte de Vehículos Extra">
                <div className='card'>
                    <Toolbar className='mb-4' left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>
                    <DataTable paginator rows={5} rowsPerPageOptions={[5, 10, 25]}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
                    ref={dt}
                    style={customStyle}
                    value={Clientes}
                    datakey="idCliente"
                    filters={filters}
                    filterDisplay="row"
                    globalFilterFields={['nombreCliente','clave']} header={header} emptyMessage="No data found.">
                        <Column field='nombreCliente' header='Cliente' filter filterPlaceholder="Search by name" style={{ minWidth: '12rem'}}></Column>
                        <Column field='nombreTienda' header='Sucursal' filter filterPlaceholder="Search by name" style={{ minWidth: '12rem'}}></Column>
                        <Column field='nombreTipoVehiculo' header='Tipo Vehiculo' filter filterPlaceholder="Search by name" style={{ minWidth: '12rem'}}></Column>
                        <Column field='unidadesSpot' header='Unidades Spot' filter filterPlaceholder="Search by clave" style={{ minWidth: '12rem'}}></Column>
                        <Column style={{ minWidth: '50rem'}}
                            header="Unidades Solicitadas"
                            body={(rowData) => {
                                return(
                                    <div style={{ display: 'flex', flexWrap: 'wrap'}}>
                                        {rowData.dayOptions.map((option, index) => {
                                            let color, textColor;
                                            const action = option.action;
                                            if(action === 'R'){
                                                color = 'red';
                                                textColor = 'white';
                                            }else if (action == 'A'){
                                                color = 'yellow';
                                                textColor = 'black';
                                            }else{
                                                color = 'white';
                                                textColor = 'black';
                                            }
                                            return(
                                                <div key={index} style={{
                                                        backgroundColor: color,
                                                        color: textColor,
                                                        padding: '10px',
                                                        fontWeight: 'bold',
                                                        textAlign: 'center',
                                                        width: '80px',
                                                        border: '1px solid brown'
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
                            >
                        </Column>
                        <Column field="totalUtilizadas" header="Total Utilizadas" style={{ minWidth: '8rem'}}></Column>
                        <Column style={{ minWidth: '50rem'}}
                            header="Unidades Spot"
                            body={(rowData) => {
                                return(
                                    <div style={{ display: 'flex', flexWrap: 'wrap'}}>
                                        {rowData.dayOptions.map((option, index) => {
                                            let color, textColor;
                                            const action = option.action;
                                            if(action === 'R'){
                                                color = 'red';
                                                textColor = 'white';
                                            }else if(action === 'A'){
                                                color = 'yellow';
                                                textColor = 'black';
                                            }else{
                                                color = 'white';
                                                textColor = 'black';
                                            }
                                            return(
                                                <div 
                                                    key={index}
                                                    style={{
                                                        backgroundColor: color,
                                                        color: textColor,
                                                        padding: '10px',
                                                        fontWeight: 'bold',
                                                        textAlign: 'center',
                                                        width: '80px',
                                                        border: '1px solid brown'
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
                            >
                        </Column>
                        <Column field="totalUnidadesSpot" header="Total de Unidades Spot" style={{ minWidth: '10rem'}}></Column>
                        <Column style={{ minWidth: '50rem'}} 
                            header="Unidades Totales"
                            body={(rowData) => {
                                return(
                                    <div style={{ display: 'flex', flexWrap: 'wrap'}}>
                                        {rowData.dayOptions.map((option, index) => {
                                            let color, textColor;
                                            const action = option.action;
                                            if(action === 'R'){
                                                color = 'red';
                                                textColor = 'white';
                                            }else if(action === 'A'){
                                                color = 'yellow';
                                                textColor = 'black';
                                            }else{
                                                color = 'white';
                                                textColor = 'black';
                                            }
                                            return(
                                                <div 
                                                    key={index}
                                                    style={{
                                                        backgroundColor: color,
                                                        color: textColor,
                                                        padding: '10px',
                                                        fontWeight: 'bold',
                                                        textAlign: 'center',
                                                        width: '80px',
                                                        border: '1px solid brown'
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

                            >

                        </Column>
                        <Column field="unidadesTotalesUtilizadas" header="Totales Unidades Utilizadas" style={{ minWidth: '12rem'}}></Column>
                        <Column field="totalGeneral" header="Total General" style={{ minWidth: '12rem'}}></Column>
                    </DataTable>
                </div>
            </CustomCard>
        </div>
    );
}