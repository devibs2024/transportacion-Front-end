import { CustomCard } from '../../../shared/card-custom';
import { DataTable } from 'primereact/datatable';
import { FilterMatchMode } from 'primereact/api';
import API from '../../../store/api';
import React, { useState, useEffect, useRef } from 'react';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { accionExitosa, accionFallida, confirmarAccion } from '../../../shared/Utils/modals';
import { useNavigate } from 'react-router-dom';
import { Toolbar } from 'primereact/toolbar';
import { Button } from 'primereact/button';
import { rutaServidor } from "../../../routes/rutaServidor";
import { procesarErrores } from '../../../shared/Utils/procesarErrores';

export const CatalogoClientes = () => {


  const [clientes, setClientes] = useState([]);

  const cols = [
    { field: 'clave', header: 'Clave del Cliente' },
    { field: 'nombreCliente', header: 'Nombre' },
    { field: 'municipio.estado.nombreEstado', header: 'Estado' },
    { field: 'municipio.nombreMunicipio', header: 'Municipio' },
  ];

  const dt = useRef(null);

  const exportColumns = cols.map((col) => ({ title: col.header, dataKey: col.field }));

  const navigate = useNavigate();

  useEffect(() => {
    getClientes();
  }, [])


  const getClientes = async () => {

    const response = await API.get(`Clientes`);

    if (response.status == 200 || response.status == 204) {
      setClientes(response.data)
    }
  }

  const onEdit = (cliente) => {
    
    console.log(cliente)
    navigate(rutaServidor + '/cliente/CrearCliente', { state: { cliente } })
  };

  const onDelete = (rowData) => {

    console.log(rowData)
    deleteCliente(rowData.idCliente);
  };

  const deleteCliente = async (idCliente) => {
    
    confirmarAccion({ titulo: 'Eliminar Cliente', mensaje: 'Estas seguro que deseas eliminar el Cliente?' }).then(async (result) => {

      try {
        if (result.isConfirmed) {
          const response = await API.delete(`Clientes/${idCliente}`);

          if (response.status == 200 || response.status == 204) {
            const updateCliente = clientes.filter(o => o.idCliente != idCliente);
            setClientes(updateCliente);
            accionExitosa({ titulo: 'Cliente Eliminado', mensaje: 'El Cliente ha sido eliminado satisfactoriamente' });
          } else {
            accionFallida({ titulo: 'Cliente no pudo ser Eliminado', mensaje: 'Ha ocurrido un error al intentar eliminar al cliente' });
          }
        }
      } catch (e) {
        let errores = e.response.data;
        accionFallida({ titulo: 'Cliente no pudo ser Eliminado', mensaje: procesarErrores(errores) });
      }

    });

  }

  
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    clave: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    nombreCliente: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
   

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
        nombreCliente: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        apellidoMaterno: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
      
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


const exportCSV = () => {
    dt.current.exportCSV();
};


const exportPdf = () => {
  import('jspdf').then((jsPDF) => {
      import('jspdf-autotable').then(() => {
          const doc = new jsPDF.default(0, 0);

          doc.autoTable(exportColumns, clientes);
          doc.save('Clientes.pdf');
      });
  });
};


const exportExcel = () => {
  import('xlsx').then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(clientes);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
      const excelBuffer = xlsx.write(workbook, {
          bookType: 'xlsx',
          type: 'array'
      });

      saveAsExcelFile(excelBuffer, 'Clientes');
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
          <Button style={{ backgroundColor: "#2596be", borderColor: "#2596be" }} label="Agregar Nuevo cliente" icon="pi pi-plus right" iconPos='right' onClick={() => navigate(rutaServidor + "/cliente/CrearCliente")} />
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


  return (
    
    <div className='mt-5'>
      <CustomCard title="Catálogo Clientes" >
      <div className='card'>
      <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>
        <DataTable  paginator rows={5} rowsPerPageOptions={[5, 10, 25]}
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products" ref={dt}  style={customStyle} value={clientes} dataKey="idCliente" filters={filters} filterDisplay="row"
            globalFilterFields={['nombreCliente', 'clave']} header={header} emptyMessage="No data found.">
            <Column field="clave" header="Clave del Cliente" filter filterPlaceholder="Search by clave" style={{ minWidth: '12rem' }} />
            <Column field="nombreCliente" header="Nombres" filter filterPlaceholder="Search by name" style={{ minWidth: '12rem' }} />
            <Column header="Acción" body={actionButtons} style={{ minWidth: '12rem' }} />
        </DataTable>
      </div>
      </CustomCard>
    </div>

  );
}







