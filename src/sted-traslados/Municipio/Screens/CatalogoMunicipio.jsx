import { CustomCard } from '../../../shared/card-custom';
import { DataTable } from 'primereact/datatable';
import { FilterMatchMode } from 'primereact/api';
import API from '../../../store/api';
import Swal from 'sweetalert2';
import React, { useState, useEffect, useRef } from 'react';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { TriStateCheckbox } from 'primereact/tristatecheckbox';
import { accionExitosa, accionFallida, confirmarAccion } from '../../../shared/Utils/modals';
import { useNavigate } from 'react-router-dom';
import { Toolbar } from 'primereact/toolbar';
import { Button } from 'primereact/button';
import { rutaServidor } from '../../../routes/rutaServidor';

export const CatalogoMunicipio = () => {


  const [municipios, setMunicipios] = useState([]);

  const cols = [
    { field: 'nombreMunicipio', header: 'Municipio' },
    { field: 'estado.nombreEstado', header: 'Estado' },
    { field: 'activo', header: 'Status' }   
  ];

  const dt = useRef(null);

  const exportColumns = cols.map((col) => ({ title: col.header, dataKey: col.field }));

  const navigate = useNavigate();

  useEffect(() => {
    getMunicipios();
  }, [])


  const getMunicipios = async () => {

    const response = await API.get(`Municipio`);

    if (response.status == 200 || response.status == 204) {
      setMunicipios(response.data)
    }
  }

  const onEdit = (municipio) => {
    
    console.log(municipio)
    navigate(rutaServidor + '/municipio/CrearMunicipio', { state: { municipio } })
  };

  const onDelete = (rowData) => {

    console.log(rowData)
    deleteMunicipio(rowData.idMunicipio);
  };

  const deleteMunicipio = async (idMunicipio) => {
    confirmarAccion({ titulo: 'Eliminar Municipio', mensaje: 'Estas seguro que deseas eliminar este Municipio?' })
    .then(async (result) => {
      if (result.isConfirmed) {

      try {
        const response = await API.delete(`Municipio/${idMunicipio}`);

        if (response.status == 200 || response.status == 204) {
          const updateMunicipio = municipios.filter(o => o.idMunicipio != idMunicipio);
          setMunicipios(updateMunicipio);

          accionExitosa({ titulo: 'Municipio Eliminado', mensaje: 'El Municipio ha sido eliminado satisfactoriamente.' });
        } else {
          accionExitosa({ titulo: 'Municipio Eliminado', mensaje: 'El Municipio ha sido eliminado satisfactoriamente' });
        }
      } catch (error) {
        accionFallida({ titulo: 'Municipio no pudo ser Eliminado', mensaje: 'Ha ocurrido un error al intentar eliminar al municipio.' });
      }

      const response = await API.delete(`Municipio/${idMunicipio}`);

      if (response.status == 200 || response.status == 204) {
        const updatedMunicipio = municipios.filter(o => o.idMunicipio != idMunicipio);

        setMunicipios(updatedMunicipio);

        accionExitosa({ titulo: 'Municipio Eliminado', mensaje: 'El Municipio ha sido eliminado satisfactoriamente' });
      } else {

        accionFallida({ titulo: 'Municipio no pudo ser Eliminado', mensaje: 'Ha ocurrido un error al intentar eliminar al municipio.' });
      }
    }

    });

  }

  
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    //estado: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    'estado.nombreEstado': { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    nombreMunicipio: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    activo: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
   

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
        //estado: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        'estado.nombreEstado': { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        nombreMunicipio: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        activo: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
      
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

          doc.autoTable(exportColumns, municipios);
          doc.save('Municipios.pdf');
      });
  });
};


const exportExcel = () => {
  import('xlsx').then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(municipios);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
      const excelBuffer = xlsx.write(workbook, {
          bookType: 'xlsx',
          type: 'array'
      });

      saveAsExcelFile(excelBuffer, 'Municipios');
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
          <Button style={{ backgroundColor: "#2596be", borderColor: "#2596be" }} label="Agregar Nuevo Municipio" icon="pi pi-plus right" iconPos='right' onClick={() => navigate(rutaServidor + "/municipio/CrearMunicipio")} />
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
    <div className="mt-5">
        <CustomCard title="Catálogo Municipio" >
            <div className="p-3">
                <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>
                <DataTable  paginator rows={5} rowsPerPageOptions={[5, 10, 25]} 
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products" ref={dt}  style={customStyle} value={municipios} dataKey="idMunicipio" filters={filters} filterDisplay="row"
                    globalFilterFields={['nombreMunicipio', 'estado.nombreEstado', 'activo']} header={header} emptyMessage="No data found.">
                    <Column field="nombreMunicipio" header="Municipio" filter filterPlaceholder="Buscar por Nombre Municipio" style={{ minWidth: '12rem' }} />
                    <Column header="Estado" filterField="estado.nombreEstado" filter filterPlaceholder="Buscar por Estado" style={{ minWidth: '12rem' }}
                                        body={(rowData) => rowData.estado.nombreEstado} />
                   <Column field="activo" header="Estatus" filter filterPlaceholder="Buscar por estatus" style={{ minWidth: '12rem' }}
        body={(rowData) => rowData.activo ? 'Activo' : 'Inactivo'} />
                    <Column header="Acción" body={actionButtons} style={{ minWidth: '12rem' }} />
                </DataTable>
            </div>
        </CustomCard>
    </div>
);
}







