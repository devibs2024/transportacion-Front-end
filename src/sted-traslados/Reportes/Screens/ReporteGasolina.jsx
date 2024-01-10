import { CustomCard } from '../../../shared/card-custom';
import { DataTable } from 'primereact/datatable';
import { FilterMatchMode } from 'primereact/api';
import API from '../../../store/api';
import React, { useState, useEffect, useRef } from 'react';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { accionExitosa, accionFallida, confirmacionAccion } from '../../../shared/Utils/modals';
import { useLocation, useNavigate } from 'react-router-dom';
import { Toolbar } from 'primereact/toolbar';
import { Button } from 'primereact/button';
import { rutaServidor } from '../../../routes/rutaServidor';
import { procesaErrores } from '../../../shared/Utils/procesarErrores';
import { useFormik } from 'formik';
import { Form, Select } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useGetCoordinadores } from '../../../hooks/useGetCoordinadores';
import { useGetTiendas } from '../../../hooks/useGetTiendas';
import * as decodeToken from '../../../shared/Utils/decodeToken';
import { data, event } from 'jquery';

export const PantallaReporteGasolinaOperador = ( setCoordinador, coordinador) => {

    const [idOperador, setIdOperador] = useState(0);
    const [IdTiendas, setIdTiendas] = useState(0);
    const [IdCoordinador, setIdCoordinador] = useState(0);
    const [Tiendas, setTiendas] = useState([]);
    const [Coordinadores, setCoordinadores] = useState([]);
    const location = useLocation();
    const navigate = useNavigate();

    const [formState, setFormState] = useState(true);
    const [selectedValue, setSelectedValue] = useState("");
    const [coordinadoresOptions, setCoordinadoresOptions] = useState([]);
    const [tiendaCoordinadoresOptions, setTiendaCoordinadoresOptions] = useState([]);    

    useEffect(() => {
        if(location.state?.Coordinadores){

            formik.setValues(location.state.Coordinadores)

            setIdCoordinador(location.state.Coordinadores.IdCoordinador);
            setCoordinadores(location.state.Coordinadores);

            getTiendaCoordinador(location.state.Coordinadores.IdCoordinador);

        }else if (Coordinadores.IdCoordinador != 0) {
            formik.setValues(Coordinadores)
        }
    }, []);

    const optionsCoordinadores = useGetCoordinadores().map((coordinador) => ({
        value: coordinador.idCoordinador,
        value: coordinador.nombres
    }));

    const optionsTiendasCoodinadores = useGetTiendas().map((tiendas) => ({
        value: tiendas.IdTiendas,
        value: tiendas.nombreTienda
    }));

    const getTiendaCoordinador = async (IdCoordinador) => {
        const response = await API.get(`TiendasCoordinador/${IdCoordinador},${3}`);

        if(response.status == 200 || response.status == 204){
            
            let data = response.data.map((data) => ({
                value: data.IdTiendas,
                value: data.nombreTienda
            }));
                
        }
        
        setTiendaCoordinadoresOptions(data)
    }

    const getCoordinador = async () => {

        const response = await API.get(`Coordinador/${IdCoordinador}`);

        if(response.status == 200 || response.status == 204){

            let data = response.data.map((data) => ({
                value: data.idCoordinador,
                value: data.nombres
            }));

            setCoordinadoresOptions(data)
        }
    }

    const onChangeTiendaCoordinador = (event) => {

        formik.handleChange(event);

        const idCoordinador = document.getElementById('IdCoordinador').value;

        console.log(idCoordinador)

        getTiendaCoordinador(idCoordinador);
    }

    const onChageCoordinador = (event) => {

        formik.handleChange(event);

        const idCoordinador = document.getElementById('IdCoordinador').value;

        console.log(idCoordinador)

        getCoordinador(idCoordinador)
    }
    
    const formik = useFormik({
        initialValues: {
            IdCoordinador: 0,
            IdTiendas: 0,
            fecha: '',
            fechaHasta: ''
        },

        onSubmit: values => {
            console.log(values);

            const detallesReporteGasolina = {
                IdCoordinador: values.IdCoordinador,
                IdTiendas: values.IdTiendas,
                fecha: formatDateToYYYYMMDD(values.fecha),
                fechaHasta: formatDateToYYYYMMDD(values.fechaHasta)
            }

            console.log(detallesReporteGasolina)
        }
    });


    const formatDateToYYYYMMDD = (date) => {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');

        return `${year}-${month}-${day}`;
    };

    const [showFechaFin, setShowFechaFin] = useState(false);
    const handleSwitchChange = (e) => {
        setShowFechaFin(e.target.checked);
    };
    

    const cols = [
        { field: 'clave', header: 'Clave de la Tienda'},
        { field: 'nombreTienda', header: 'Nombre'},
        { field: 'nombreOperador', header: 'Nombre Operador'},
        { field: 'numTarjeta', header: 'Numero de Tarjeta'},
        { field: 'importe', header: 'Importe'},
        { field: 'fecha', header: 'Fecha Disperción'}
    ]

    const dt = useRef(null);

    const exportColumns = cols.map((col) => ({ title: col.header, datakey: col.field }));        

    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        clave: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        nombreTienda: { value: null, matchMode: FilterMatchMode.STARTS_WITH},
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
            clave: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
            nombreTienda: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
            nombreOperador: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        });

        setGlobalFilterValue('')
    }

    const clearFilter = () => {
        initFilters();
    }

    const renderHeader = () => {
        return(
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

                doc.autoTable(exportColumns, Tiendas);
                doc.save('Gasolina.pdf');
            });
        });
    };

    const exportExcel = () => {
        import('xlsx').then((xlsx) => {
            const worksheet = xlsx.utils.json_to_sheet(Tiendas);
            const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
            const excelBuffer = xlsx.write(workbook, {
                bookType: 'xlsx',
                type: 'array'
            });

            saveAsExcelFile(excelBuffer, 'Tiendas');
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

                module.default.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
            }
        });
    };

    const actionButtons = (rowData) => {
        return(
            <div className='row'>
                <Button icon="pi pi-pencil" severity='warning' rounded style={{ marginRight: "5px"}} tooltip='Editar' ></Button>
                <Button icon="pi pi-trash" rounded severity='warning' tooltip='Eliminar' ></Button>
            </div>
        );
    };   

    const tiendasOptions = Tiendas.map(t => ({
        value: t,IdTiendas,
        label: t.nombreTienda
    }));

   
    const leftToolbarTemplate = () => {
        return(            
            <div className='flex flex-wrap gap-2'>
                <Form.Group controlId="idCoordinador">
                    <Form.Label>Coordinador:</Form.Label>
                    <Form.Control as="select" 
                        value={formik.values.IdCoordinador} 
                        onChange={onChageCoordinador} 
                        onBlur={formik.handleBlur}>
                        <option value="">Seleccione el Coordinador</option>
                        {coordinadoresOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </Form.Control>
                    <Form.Text className="text-danger">
                        {formik.touched.IdCoordinador && formik.errors.IdCoordinador ? (<div className="text-danger">{formik.errors.IdCoordinador}</div>) : null}
                    </Form.Text>
                </Form.Group>
                <br></br>
                <Form.Group controlId='idTienda'>
                    <Form.Label>Tienda:</Form.Label>
                    <Form.Control as = "select" 
                        value={formik.values.IdTiendas} 
                        onChange={onChangeTiendaCoordinador} 
                        onBlur={formik.handleBlur}>
                            <option value="">Seleccione Tienda</option>
                            {tiendaCoordinadoresOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                    </Form.Control>
                    <Form.Text className='text-danger'>
                        {formik.touched.IdTiendas && formik.errors.IdTiendas ? (<div className="text-danger">{formik.errors.IdTiendas}</div>) : null}
                    </Form.Text>
                </Form.Group>
                <br></br>
                <Form.Group controlId="fecha">
                    <Form.Label>Fecha</Form.Label>
                    <DatePicker 
                        id="fecha" 
                        name="fecha" 
                        autoComplete="off" 
                        selected={formik.values.fecha ? new Date(formik.values.fecha) : null} 
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
                    <DatePicker
                        id="fechaHasta" 
                        name="fechaHasta" 
                        autoComplete="off"                         
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
                <Button style={{ backgroundColor: "#2596BE", borderColor: "#2596BE", width: "193px", height: "43px", marginLeft: "38px" }} label='Generar Reporte' icon="pi pi-plus right" iconPos='right' onClick={() => navigate()}></Button>
            </div>
        );
    };

    const rightToolbarTemplate = () => {
        return(
            <div className='flex flex-wrap gap-3 justify-content-center justify-content-between'>
                <Button type='button' tooltip='Descargar CSV' icon="pi pi-file" severity='secondary' rounded onClick={() => exportCSV(false)} data-pr-tooltip='CSV' style={{ marginRight: "5px"}}></Button>
                <Button type='button' tooltip='Descargar Excel' icon="pi pi-file-excel" severity='sucess' rounded onClick={exportExcel} data-pr-tooltip='XLS' style={{ marginRight: "5px"}}></Button>
                <Button type='button' tooltip='Descargar PDF' icon="pi pi-file-pdf" style={{ 'backgroundColor': 'red', borderColor: 'white', color: 'white'}} rounded onClick={exportPdf} data-pr-tooltip='PDF'></Button>
            </div>
        );
    };    

    return(
        <div className='mt-5'>
            <CustomCard title="Reporte de Consumo de Gasolina">
                <div className='card'>
                    <Toolbar className='mb-4' left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>
                    <DataTable paginator rows={5} rowsPerPageOptions={[5, 10, 25]}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products" ref={dt} style={customStyle} value={Tiendas} datakey="idTienda" filters={filters} filterDisplay="row"
                    globalFilterFields={['nombreTienda', 'clave']} header={header} emptyMessage="No data found.">
                        <Column field='clave' header="Clave de Tienda" filter filterPlaceholder="Search by clave" style={{ minWidth: '12rem '}}></Column>
                        <Column field='nombreTienda' header="Tienda" filter filterPlaceholder='Search by name' style={{ minWidth: '12rem' }}></Column>
                        <Column field='nombreOperador' header="Operador" filter filterPlaceholder='Search by name' style={{ minWidth: '12rem'}}></Column>
                        <Column field='numTarjeta' header="Numero de Tarjeta" filter filterPlaceholder='Search by clave' style={{ minWidth: '12rem'}}></Column>
                        <Column field='importe' header="Importe" filter filterPlaceholder='Search by clave' style={{ minWidth: '12rem'}}></Column>
                        <Column field='fecha' header="Fecha" filter filterPlaceholder='Search by clave' style={{ minWidth: '12rem'}}></Column>
                    </DataTable>
                </div>
            </CustomCard>
        </div>        
    );

}