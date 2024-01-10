import React, { useState, useEffect, useRef } from 'react';
import { FilterMatchMode } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { TriStateCheckbox } from 'primereact/tristatecheckbox';
import API from '../../../store/api';
import { Button } from 'primereact/button';
import { accionExitosa, accionFallida, confirmarAccion } from '../../../shared/Utils/modals';
import { useNavigate } from 'react-router-dom';
import { Toolbar } from 'primereact/toolbar';
import { CustomCard } from '../../../shared/card-custom';
import { rutaServidor } from '../../../routes/rutaServidor';
import { TabPanel, TabView } from 'primereact/tabview';
import { CardTarifaTipoVehiculo } from '../Components/TarifasTipoVehiculo/CardTarifaTipoVehiculo';
import { CardMarcas } from '../Components/Marcas/CardMarcas';
import { CardModelo } from '../Components/Modelos/CardModelo';
import { Button as BoostrapButton, Card, Table, Modal, Form } from "react-bootstrap";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { procesarErrores } from '../../../shared/Utils/procesarErrores';

export const PantallaTipoVehiculo = () => {

    const [tipovehiculos, setTipoVehiculos] = useState([]);
    const [formState, setFormState] = useState(true);

    const formik = useFormik({

        initialValues: {
            idTipoVehiculo: 0,
            tipoVehiculo: "",
            activo: false

        },
        validationSchema: Yup.object({
            tipoVehiculo: Yup.string().required('Este campo es obligatorio')

        }),

        onSubmit: (values) => {

            console.log(values)

            const tipoVehiculo = {
                tipoVehiculo: values.tipoVehiculo,
                idTipoVehiculo: values.idTipoVehiculo,
                activo: values.activo
            }
            if (values.idTipoVehiculo == 0) {
                postTipoVehiculo(tipoVehiculo);
                return;
            }
            putTipoVehiculo(tipoVehiculo)


        }
    });

    const cols = [
        { field: 'tipoVehiculo', header: 'Tipo Vehiculo' },
        { field: 'activo', header: 'Activo' },
        { field: 'tarifaVehiculos.tarifa', header: 'Tarifas' },
        { field: 'marcaVehiculos', header: 'Marca' },
        { field: 'marcaVehiculos.modeloVehiculos', header: 'Modelo' },
    ];

    const dt = useRef(null);

    const exportColumns = cols.map((col) => ({ title: col.header, dataKey: col.field }));

    const navigate = useNavigate();

    useEffect(() => {
        getTipoVehiculos();
    }, [])

    const putTipoVehiculo = async (tipoVehiculo) => {

        try {
            const response = await API.put(`TipoVehiculos/${tipoVehiculo.idTipoVehiculo}`, tipoVehiculo);

            if (response.status == 200 || response.status == 204) {
                formik.resetForm();
                handleClose();

                formik.setValues({
                    idTipoVehiculo: 0,
                    tipoVehiculo: "",
                    activo: false

                });
                console.log(response.data)

                getTipoVehiculos()
                accionExitosa({ titulo: 'Vehiculo Agregado', mensaje: 'El Vehiculo ha sigo agregado satisfactoriamente' })
            }
        } catch (e) {


            accionFallida({ titulo: 'Ha ocurrido un error', mensaje: procesarErrores(e.response.data) })
        }
    }
    const postTipoVehiculo = async (tipoVehiculo) => {

        try {
            const response = await API.post("TipoVehiculos", tipoVehiculo);

            if (response.status == 200 || response.status == 204) {
                formik.resetForm();
                handleClose();

                console.log(response.data)

                getTipoVehiculos()
                accionExitosa({ titulo: 'Tipo Vehiculo Agregado', mensaje: 'El Tipo Vehiculo ha sigo agregado satisfactoriamente' })
            }
        } catch (e) {


            accionFallida({ titulo: 'Ha ocurrido un error', mensaje: procesarErrores(e.response.data) })
        }
    }

    const getTipoVehiculos = async () => {

        const response = await API.get(`TipoVehiculos`);

        if (response.status == 200 || response.status == 204) {

            //const filteredTipoVehiculos = response.data.filter(o => o.idTipoVehiculo == 1);
            //setTipoVehiculos(filteredTipoVehiculos);
            //console.log(response.data)
            setTipoVehiculos(response.data)
        }
    }

    const onEdit = (tipoVehiculo) => {

        handleShow();

        formik.setValues(
            {
                idTipoVehiculo: tipoVehiculo.idTipoVehiculo,
                tipoVehiculo: tipoVehiculo.tipoVehiculo,
                activo: false
            })

        //navigate(rutaServidor + '/tipovehiculo/crear', { state: { tipovehiculo } })
    };

    const onDelete = (rowData) => {

        eliminarTipoVehiculo(rowData.idTipoVehiculo);
    };

    const eliminarTipoVehiculo = async (idTipoVehiculo) => {
        confirmarAccion({ titulo: 'Eliminar Tipo Vehiculo', mensaje: 'Estas seguro que deseas eliminar el Tipo Vehiculo?' })
            .then(async (result) => {

                if (result.isConfirmed) {

                    try {
                        const response = await API.delete(`TipoVehiculos/${idTipoVehiculo}`);

                        if (response.status == 200 || response.status == 204) {
                            const updatedTipoVehiculo = tipovehiculos.filter(o => o.idTipoVehiculo != idTipoVehiculo);
                            setTipoVehiculos(updatedTipoVehiculo);

                            accionExitosa({ titulo: 'Tipo Vehiculo Eliminado', mensaje: 'El Tipo Vehiculo ha sido eliminado satisfactoriamente' });
                        } else {
                            accionExitosa({ titulo: 'Tipo Vehiculo Eliminado', mensaje: 'El Tipo Vehiculo ha sido eliminado satisfactoriamente' });
                        }
                    } catch (error) {
                        accionFallida({ titulo: 'Tipo vehiculo no pudo ser Eliminado', mensaje: 'Ha ocurrido un error al intentar eliminar al Tipo vehiculo' });
                    }

                    const response = await API.delete(`TipoVehiculos/${idTipoVehiculo}`);

                    if (response.status == 200 || response.status == 204) {
                        const updatedTipoVehiculo = tipovehiculos.filter(o => o.idTipoVehiculo != idTipoVehiculo);

                        setTipoVehiculos(updatedTipoVehiculo);

                        accionExitosa({ titulo: 'Tipo vehiculo Eliminado', mensaje: 'El Tipo vehiculo ha sido eliminado satisfactoriamente' });
                    } else {
                        accionFallida({ titulo: 'Tipo vehiculo no pudo ser Eliminado', mensaje: 'Ha ocurrido un error al intentar eliminar al Tipo vehiculo' });
                    }
                }


            });
    }
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        tipoVehiculo: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        activo: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        'marcaVehiculos.marca': { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        'marcaVehiculos.modeloVehiculos': { value: null, matchMode: FilterMatchMode.STARTS_WITH },
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
            tipoVehiculo: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
            activo: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
            'marcaVehiculos.marca': { value: null, matchMode: FilterMatchMode.STARTS_WITH },
            'marcaVehiculos.modeloVehiculos': { value: null, matchMode: FilterMatchMode.STARTS_WITH },
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

    /*     const empleadoInternoRowFilterTemplate = (options) => {
            return <TriStateCheckbox value={options.value} onChange={(e) => options.filterApplyCallback(e.value)} />;
        }; */

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

                doc.autoTable(exportColumns, tipovehiculos);
                doc.save('TipoVehiculos.pdf');
            });
        });
    };

    const exportExcel = () => {
        import('xlsx').then((xlsx) => {
            const worksheet = xlsx.utils.json_to_sheet(tipovehiculos);
            const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
            const excelBuffer = xlsx.write(workbook, {
                bookType: 'xlsx',
                type: 'array'
            });

            saveAsExcelFile(excelBuffer, 'TipoVehiculos');
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

    const actionButtons = (rowData) => {

        return (
            <div className='row'>
                <Button icon="pi pi-pencil" severity="warning" rounded style={{ marginRight: "5px" }} tooltip="Editar" onClick={() => onEdit(rowData)} />
                <Button icon="pi pi-trash" rounded severity="danger" tooltip="Eliminar" onClick={() => onDelete(rowData)} />
            </div>
        );
    };

    const leftToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-2">
                <Button style={{ backgroundColor: "#2596be", borderColor: "#2596be" }} label="Agregar Nuevo Tipo Vehiculo" icon="pi pi-plus right" iconPos='right' onClick={() => handleShow()} />
            </div>
        );
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
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <>
            <Modal show={show} onHide={handleClose}>
                <Form onSubmit={formik.handleSubmit}>
                    <Modal.Header closeButton>
                        <Modal.Title>Agregar Nuevo Tipo de Vehiculo</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="row">

                            <Form.Group controlId="tipoVehiculo">
                                <Form.Label>Tipo Vehiculo</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="tipoVehiculo"
                                    placeholder="Introduzca el tipo de vehiculo"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.tipoVehiculo}
                                />
                                <Form.Text className="text-danger">
                                    {formik.touched.tipoVehiculo && formik.errors.tipoVehiculo ? (<div className="text-danger">{formik.errors.tipoVehiculo}</div>) : null}
                                </Form.Text>
                            </Form.Group>
                        </div>

                    </Modal.Body>

                    <Modal.Footer>
                        <BoostrapButton variant="secondary" onClick={handleClose}>
                            Cerrar
                        </BoostrapButton>
                        <BoostrapButton type="submit" variant="custom" onClick={values => setFormState(values)}>
                            Guardar
                        </BoostrapButton>
                    </Modal.Footer>
                </Form>
            </Modal>
            <div className="mt-5">
                <CustomCard title="Catálogo Tipo Vehiculos" >
                    <TabView>
                        <TabPanel header="Tipo Vehiculo" >
                            <div className="p-3">
                                <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>
                                <DataTable paginator rows={5} rowsPerPageOptions={[5, 10, 25]}
                                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products" ref={dt} style={customStyle} value={tipovehiculos} dataKey="idTipoVehiculo" filters={filters} filterDisplay="row"
                                    globalFilterFields={['tipoVehiculo', 'activo', 'marcaVehiculos.marca', 'marcaVehiculos.modeloVehiculos']} header={header} emptyMessage="No data found.">
                                    <Column field="tipoVehiculo" header="Tipo" filter filterPlaceholder="Buscar por Tipo" style={{ minWidth: '12rem' }} />

                                    {/* <Column header="Tarifas"
                                    //filterField="tarifaVehiculos.marca" filter filterPlaceholder="Buscar por Marca" 
                                    style={{ minWidth: '12rem' }}
                                    body={(rowData) => rowData.tarifas.map((tp) => tp.tarifa).join(", ")} /> */}

                                    {/* <Column header="Marcas"
                                    //filterField="marcaVehiculos.marca" filter filterPlaceholder="Buscar por Marca" 
                                    style={{ minWidth: '12rem' }}
                                    body={(rowData) => rowData.marcaVehiculos.map((tp) => tp.marca).join(", ")} /> */}

                                    {/* <Column header="Modelos" */}
                                    {/* //field="marcaVehiculos.modeloVehiculos" filter filterPlaceholder="Buscar por Modelo" 
                                    style={{ minWidth: '12rem' }}
                                    body={(rowData) => rowData.marcaVehiculos.map((marca) => marca.modeloVehiculos.map((modelo) => modelo.modelo)).join(" ")} /> */}
                                    <Column header="Acción" body={actionButtons} style={{ minWidth: '5rem' }} />
                                </DataTable>
                            </div>

                        </TabPanel>

                        <TabPanel header="Tarifa">
                            <CardTarifaTipoVehiculo />
                        </TabPanel>

                        <TabPanel header="Marcas">
                            <CardMarcas />
                        </TabPanel>

                        <TabPanel header="Modelos">
                            <CardModelo />
                        </TabPanel>
                    </TabView>
                </CustomCard>
            </div>
        </>
    );
}