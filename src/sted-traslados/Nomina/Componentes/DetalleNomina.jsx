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
import { useFormik } from "formik";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import * as Yup from "yup";
import { accionFallida } from "../../../shared/Utils/modals";
import { procesarErrores } from "../../../shared/Utils/procesarErrores";
import { useGetEmpleadoCoordinador } from "../../../hooks/useGetEmpleadoCoordinador";


export const PantallaDetalleNomina = ({ setOperador, operador}) => {

    const [productividades, setProductividades] = useState([]);
    const [idOperador, setIdOperador] = useState(0);    
    //const [operador, setOperador] = useState();
    const MySwal = withReactContent(Swal);
    const navigate = useNavigate();
    const location = useLocation();
    
    const [operadoresOptions, setOperadoresOptions] = useState([]);    
    const [tiendaOptions, setTiendasOptions] = useState([]);
    const [calculonomina, setCalculoNomina] = useState([]);        

    const idCoordinador = decodeToken.tokenDecode();

    useEffect(() => {
        if (location.state?.operador){

            formik.setValues(location.state.operador)

            setIdOperador(location.state.operador.idOperador);
            // setOperador(location.state.operador);
        } else if (operador.idOperador != 0){
            formik.setValues(operador)
        }
    }, []);
        

    const cols = [
        { field: 'idPlanificacion', header: 'Id Secuencia'},
        { field: 'nombreCoordinador', header: 'Coordinador'},        
        { field: 'nombreTienda', header: 'Tienda'},
        { field: 'nombreOperador', header: 'Operador'},
        { field: 'banco', header: 'Banco'},
        { field: 'zonaSted', header: 'zonaSted'},
        { field: 'Dias', header: 'Dias'},
        { field: 'subtotal', header: 'subtotal'},
        { field: 'minutosretardo', header: 'minutosretardo'},
        { field: 'descuentominutos', header: 'descuentominutos'},
        { field: 'descuentosted', header: 'descuentosted'},
        { field: 'dias', header: 'dias'},
        { field: 'gasolina', header: 'gasolina'},
        { field: 'bonos', header: 'bonos'},
        { field: 'totalpagar', header: 'totalpagar'},
        { field: 'pagosmg', header: 'pagosmg'},
        { field: 'totalfinal', header: 'totalfinal'},
    ];

    const dt = useRef(null);

    const exportColumns = cols.map((col) => ({ title: col.header, datakey: col.field }));

    
    const formatDateToYYYYMMDD = (date) => {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '');

        return `${year}-${month}-${day}`;
    }
    
    // const optionsOperadores = useGetEmpleadoCoordinador().map((operador) => ({
    //     value: operador.idOperador,
    //     label: operador.nombreOperador,
    // }));
                
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS},
        idPlanificacion: { value: null, matchMode: FilterMatchMode.STARTS_WITH},
        nombreOperador: { value: null,  matchMode: FilterMatchMode.STARTS_WITH},
        nombreCoordinador: { value: null, matchMode: FilterMatchMode.STARTS_WITH},
        nombreTienda: { value: null, matchMode: FilterMatchMode.STARTS_WITH},
        banco: { value: null, matchMode: FilterMatchMode.STARTS_WITH},
        zonasted: { value: null, matchMode: FilterMatchMode.STARTS_WITH}
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
            global: { value: null, matchMode: FilterMatchMode.CONTAINS},
            idPlanificacion: { value: null, matchMode: FilterMatchMode.STARTS_WITH},
            nombreOperador: { value: null, matchMode: FilterMatchMode.STARTS_WITH},
            nombreCoordinador: { value: null, matchMode: FilterMatchMode.STARTS_WITH},
            nombreTienda: { value: null, matchMode: FilterMatchMode.STARTS_WITH},
            banco: { value: null, matchMode: FilterMatchMode.STARTS_WITH},
            zonasted: { value: null, matchMode: FilterMatchMode.STARTS_WITH}
        });

        setGlobalFilterValue('')
    };
        
    const onChangeOperador = (event) => {

        formik.handleChange(event);

        const idOperador = document.getElementById('IdOperador').value;

        console.log(idOperador)        
    }

    const onChangeTienda = (event) => {

        formik.handleChange(event);

        const idTienda = document.getElementById('IdTienda').value;

        console.log(idTienda)
    }    

    const clearFilter = () => {
        initFilters();
    }

    const renderHeader = () => {
        return(
            <div className="d-flex justify-content-between">
                <Button type="button" icon="pi pi-filter-slash" severity="secondary" label="Quitar Filtros" style={{ marginRight: "5px"}} outlined onClick={clearFilter}></Button>
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
            const workbook = {Sheets: { data: worksheet }, SheetNames: ['data'] };
            const excelBuffer = xlsx.write(workbook, {
                bookType: 'xlsx',
                type: 'array'
            });

            saveAsExcelFile(excelBuffer, 'Nómina');
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
    
    const getInitialValues = () => {
        return{
            idOperador: 0,
            nombreOperador: '',
            idTienda: 0,
            nombreTienda: '',
            idCoordinador: 0,
            fecha: '',
            fechaHasta: ''
        }
    }
    const formik = useFormik({
        initialValues: getInitialValues(),
        validationSchema: Yup.object().shape({
            nombreOperador: Yup.string().required("Este campo es obligatorio"),
            nombreTienda: Yup.string().required("Este campo es obligatorio"),
        }),
        Form,
        onSubmit: values => {
            let operador = {
                idOperador: idOperador,
                nombreOperador: values.nombreOperador,
                idTienda: values.idTienda,
                nombreTienda: values.nombreTienda,
                idCoordinador: idCoordinador,
                fecha: values.fecha,
                fechaHasta: values.fechaHasta,
            };
            
            console.log(operador);
        },
    });
    
    const leftToolbarTemplate = () => {
        return(
            <div className='flex flex-wrap gap-2'>
                <Form.Group controlId="idOperador">
                    <Form.Label>Operador:</Form.Label>
                    <Form.Control as="select" 
                        value={formik.values.idOperador}
                        onChange={onChangeOperador}
                        onBlur={formik.handleBlur} >
                            <option value="">Seleccione un Operador</option>
                            {operadoresOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}                            
                    </Form.Control>
                    <Form.Text className="text-danger">
                        {formik.touched.idOperador && formik.errors.idOperador ? (<div className="text-danger">{formik.errors.idOperador}</div>) : null}
                    </Form.Text>
                </Form.Group>
                <br></br>                
                <Form.Group controlId="idTienda">
                    <Form.Label>Sucursal:</Form.Label>
                    <Form.Control as = "select" value={formik.values.idTienda} onChange={formik.handleChange} onBlur={formik.handleBlur}>
                        <option value="">Seleccione Sucursal</option>
                        {tiendaOptions.map((option) =>(
                            <option key={option.value} value={option.value}>
                                {option.value}
                            </option>
                        ))}
                    </Form.Control>
                    <Form.Text className="text-danger">
                        {formik.touched.idTienda && formik.errors.idTienda ? (<div className="text-danger">{formik.errors.idTienda}</div>) : null}
                    </Form.Text>
                </Form.Group>
                <br></br>                
                <Form.Group controlId="fecha">
                    <Form.Label>Fecha:</Form.Label>
                    <DatePicker id="fecha" name="fecha" autoComplete="off" style={{width: "63%"}}
                        selected={formik.values.fecha ? new Date(formik.values.fecha) : null}
                        onChange={(date) => formik.setFieldValue('fecha',date)}
                        onBlur={formik.handleBlur}
                        showMonthDropdown
                        showYearDropdown
                        className='form-control'                            
                    >                        
                    </DatePicker>
                    {formik.touched.fecha && formik.errors.fecha ? (<Form.Text className="text-danger">{formik.errors.fecha}</Form.Text>) : null}
                </Form.Group>                              
                <Form.Group controlId="fechaHasta">
                    <Form.Label>Fecha Hasta:</Form.Label>
                    <DatePicker id="fechaHasta" name="fechaHasta" autoComplete="off" style={{width: "63%"}}
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
                <br></br>                
                <Button style={{ backgroundColor: "#2596BE", borderColor: "#2596BE", width: "193px", height: "43px", marginLeft: "38px"}} label='Genera Cálculo' icon="pi pi-plus right" iconPos="right" onClick={() => navigate()}></Button>
            </div>
        )
    }

    const rightToolbarTemplate = () => {
        return(
            <div className="flex flex-wrap gap-3 justify-content-center justify-content-between">
                <Button type="button" tooltip="Descargar CSV" icon="pi pi-file" severity="secondary" rounded onClick={() => exportCSV(false)} data-pr-tooltip="CSV" style={{ marginRight: "5px"}}></Button>
                <Button type="button" icon="pi pi-file-excel" tooltip="Descargar Excel" severity="success" rounded onClick={exportExcel} data-pr-tooltip="XLS" style={{ marginRight: "5px"}}></Button>
                <Button type="button" icon="pi pi-file-pdf" tooltip="Descargar PDF" style={{ 'backgroundColor': 'red', borderColor: 'white', color: 'white'}} rounded onClick={exportPdf} data-pr-tooltip="PDF"></Button>
            </div>
        );
    };    
    
    return(
        <div className="mt-5">
            <CustomCard title="Calculo de Nomina">
                <div className="p-3">
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>
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
                        globalFilterFields={['idSecuencia', 'coordinador', 'operador', 'inicio', 'final']} 
                        header={header} 
                        emptyMessage="No data found.">                            
                            <Column field="idPlanificacion" header="Id Secuencia" filter filterPlaceholder="Buscar por id de secuencia" style={{ minWidth: '12rem'}}></Column>
                            <Column field="nombreCoordinador" header="Coordinador" filter filterPlaceholder="Buscar por nombre de Coordinador" style={{ minWidth: '12rem'}}></Column>
                            <Column field="nombreTienda" header="Tienda" filter filterPlaceholder="Buscar por nombre de Tienda" style={{ minWidth: '12rem'}}></Column>
                            <Column field="nombreOperador" header="Operador" filter filterPlaceholder="Buscar por nombre de Operador" style={{ minWidth: '12rem'}}></Column>                            
                            <Column field="banco" header="Banco" filter filterPlaceholder="Buscar por nombre de Banco." style={{ minWidth: '12rem'}}></Column>
                            <Column field="zonasted" header="Zona Sted" filter filterPlaceholder="Buscar por nombre de Zona Sted" style={{ minWidth: '12rem'}}></Column>                            
                            <Column style={{ minWidth: '50rem'}}
                                header="Días"
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
                                                    <div key={index} 
                                                    style={{backgroundColor: color, color: textColor, padding: '10px', fontWeight: 'bold', textAlign: 'center', width: '80px', border: '1px solid brown' }}>

                                                    </div>
                                                )
                                            })}
                                        </div>
                                    )
                                }}
                            >
                            </Column>
                            <Column field="subtotal" header="SubTotal" style={{ minWidth: '12rem'}}></Column>
                            <Column field="minutosretardo" header="Minutos de Retardo" style={{ minWidth: '12rem'}}></Column>
                            <Column field="descuentominutos" header="Descuento minutos" style={{ minWidth: '12rem'}}></Column>
                            <Column field="descuentosted" header="Descuento Sted" style={{ minWidth: '12rem'}}></Column>
                            <Column field="dias" header="Dias" style={{ minWidth: '12rem'}}></Column>
                            <Column field="gasolina" header="Tarjeta Gasolina" style={{ minWidth: '12rem'}}></Column>
                            <Column field="bonos" header="Bonos Extra" style={{ minWidth: '12rem'}}></Column>
                            <Column field="totalpagar" header="Total a Pagar" style={{ minWidth: '12rem'}}></Column>
                            <Column field="pagosmg" header="Pago SMG" style={{ minWidth: '12rem'}}></Column>
                            <Column field="totalfinal" header="Total Final" style={{ minWidth: '12rem'}}></Column>
                    </DataTable>
                </div>
            </CustomCard>
        </div>
    );
    
}
