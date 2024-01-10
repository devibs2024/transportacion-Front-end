
import React, { useState, useRef, useEffect } from 'react';
import { FilterMatchMode } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { TriStateCheckbox } from 'primereact/tristatecheckbox';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { accionExitosa, accionFallida, confirmarAccion } from '../../../../shared/Utils/modals';
import API from '../../../../store/api';
import { procesarErrores } from '../../../../shared/Utils/procesarErrores';
import { ModalCrearZonaStedTienda } from './ModalCrearZonaStedTienda';


export const TiendasTable = ({ cliente, zonaStedTiendas, setZonaStedTiendas, setShow }) => {

    const dt = useRef(null);
    const handleShow = () => setShow(true);

    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        nombreTienda: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        subGerente: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        nombreZona: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        nombreEstado: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        activa: { value: null, matchMode: FilterMatchMode.EQUALS }
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
            nombreTienda: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
            subGerente: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
            nombreZona: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
            nombreEstado: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
            activa: { value: null, matchMode: FilterMatchMode.EQUALS }
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

    const eliminarTienda = async (tienda) => {


        confirmarAccion({ titulo: 'Eliminar Tienda', mensaje: 'Estas seguro que deseas eliminar la tienda?' }).then(async (result) => {
            try {
                if (result.isConfirmed) {

                    const response = await API.delete(`Tiendas/${tienda.idTienda}`);

                    if (response.status == 200 || response.status == 204) {

                        const filtersZonaStedTiendas = zonaStedTiendas.filter(x => x.idTienda != tienda.idZonaSted);
                        setZonaStedTiendas(filtersZonaStedTiendas);

                        accionExitosa({ titulo: 'Tienda Eliminada', mensaje: 'La Tienda ha sido eliminado Exitosamente' });

                    } else {

                        accionFallida({ titulo: 'Tienda no pudo ser Eliminada', mensaje: 'Ha ocurrido un error al intentar eliminar la tienda' })
                    }
                }
            } catch (e) {
                let errores = e.response.data;

                accionFallida({ titulo: 'Tienda no pudo ser Eliminada', mensaje: procesarErrores(errores) })
            }

        })
    }

    const onEdit = (rowData) => {

        handleShow();

        return (
            <ModalCrearZonaStedTienda tienda = {rowData}></ModalCrearZonaStedTienda>
        );
    }
    const actionBodyTemplate = (rowData) => {
        return (
            <div className="row">
                <Button icon="pi pi-trash" className="p-button-rounded p-button-danger" style={{ marginRight: "5px" }} onClick={() => eliminarTienda(rowData)} />

                <Button icon="pi pi-pencil" className="p-button-rounded p-button-warning " onClick={() => onEdit(rowData)} />
            </div>
        );
    };

    return (
        <div className="datatable-responsive-demo">
            <DataTable paginator rows={5} rowsPerPageOptions={[5, 10, 25]}
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
                ref={dt} style={customStyle}
                value={zonaStedTiendas}
                filters={filters}
                filterDisplay="row"
                globalFilterFields={['nombreTienda', 'nombreZona', 'nombreEstado', 'activa']}
                header={header} emptyMessage="No data found.">

                <Column field="nombreTienda" header="Nombre Tienda" filter />
                <Column field="nombreZona" header="Zona" filter />
                <Column field="nombreEstado" header="Estado" filter />
                <Column field="activa" header="Activa" filter body={(rowData) => (rowData.activa ? "Sí" : "No")} />
                <Column header="Acciones" body={actionBodyTemplate} />
            </DataTable>
        </div>
    );
};

