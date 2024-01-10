import React, { useRef, useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import API from "../../../../store/api";
import { accionExitosa, accionFallida, confirmarAccion } from '../../../../shared/Utils/modals';
import { procesarErrores } from "../../../../shared/Utils/procesarErrores";
import { ModalContactoCliente } from "./ModalContactoCliente"
export const ContactoClienteTable = ({ cliente, contactoClientes, setContactoClientes, setShow}) => {

  const handleShow = () => setShow(true);

  const eliminarContactoCliente = async (contacto) => {

    confirmarAccion({ titulo: 'Eliminar Contacto Cliente', mensaje: 'Estas seguro que deseas eliminar el Contacto Cliente?' }).then(async (result) => {
      try {
        if (result.isConfirmed) {

          /*           if (contacto.idContacto != 0 && contacto.subGerentes.idContacto != 0) {
          
                      const response = await API.delete(`GerenteSubGerente`, {
                        headers: {},
                        data: {
                          idGerente: contacto.idContacto,
                          idSubGerente: contacto.subGerentes.idContacto
                        }
                      });
          
                    } */

          const response = await API.delete(`ContactoCliente/${contacto.idContacto}`);

          if (response.status == 200 || response.status == 204) {

            const filtersContactoClientes = contactoClientes.filter(x => x.idContacto != contacto.idContacto);
            setContactoClientes(filtersContactoClientes);

            accionExitosa({ titulo: 'Contacto Cliente Eliminada', mensaje: 'El Contacto Cliente ha sido eliminado Exitosamente' });

          } else {

            accionFallida({ titulo: 'Contacto Cliente no pudo ser Eliminada', mensaje: 'Ha ocurrido un error al intentar eliminar el Contacto Cliente' })
          }
        }
      } catch (e) {

        let errores = e.response.data;
        accionFallida({ titulo: 'Contacto Cliente no pudo ser Eliminada', mensaje: procesarErrores(errores) })
      }

    })
  }

  const onDelete = (rowData) => {

    eliminarContactoCliente(rowData)
  }
  const onEdit = (rowData) => {
    
    handleShow();

    return (
      <ModalContactoCliente></ModalContactoCliente>
    );
  }

  useEffect(() => {
    getContactoCliente();
  }, [])


  const getContactoCliente = async () => {

    const response = await API.get(`ContactoCliente/${cliente.idCliente}`)

    if (response.status === 200) {

      setContactoClientes(response.data);
      setExpandedRows(response.data)
    }
  }

  const [expandedRows, setExpandedRows] = useState(null);

  const onRowToggle = (event) => {
    setExpandedRows(event.data);
  };

  const allowExpansion = (rowData) => {
    return rowData.subGerentes.length > 0;
  };

  const actionButtonsGerentes = (rowData) => {
    return (
      <div className='row'>
        <Button icon="pi pi-trash" rounded severity="danger" tooltip="Eliminar" style={{ marginRight: "5px" }} onClick={() => onDelete(rowData)} />
        <Button icon="pi pi-pencil" rounded severity="warning" tooltip="Editar" onClick={() => onEdit(rowData)} />
      </div>
    );
  };

  const actionButtonsSubGerentes = (rowData) => {
    return (
      <div className='row'>
        <Button icon="pi pi-trash" rounded severity="danger" tooltip="Eliminar" style={{ marginRight: "5px" }} onClick={() => onDelete(rowData.subGerentes)} />
        <Button icon="pi pi-pencil" rounded severity="warning" tooltip="Editar" onClick={() => onEdit(rowData)} />
      </div>
    );
  };

  const rowExpansionTemplate = (rowData) => {



    if (rowData.subGerentes != null && rowData.subGerentes.length > 0) {
      return (
        <div>
          <h5>Sub Gerentes</h5>
          <DataTable value={rowData.subGerentes}>
            <Column field="nombre" header="Nombre Completo" />
            <Column field="email" header="Email" />
            <Column field="telefono" header="Teléfono" />
            <Column field="telefono2" header="Teléfono 2" />
            <Column field="tipoContacto" header="Teléfono 2" body={(rowData) => rowData.tipoContacto == 1 ? "Gerente" : "Sub Gerente"} />
            <Column field="activo" header="Activo" body={(rowData) => rowData.activo == true ? "Si" : "No"} />
            <Column header="Acción" body={actionButtonsSubGerentes} style={{ minWidth: '12rem' }} />
          </DataTable>
        </div>

      );
    }


  }

  return (
    <div>
      <DataTable
        value={contactoClientes}
        expandedRows={expandedRows}
        onRowToggle={onRowToggle}
        rowExpansionTemplate={rowExpansionTemplate}
        dataKey="idContacto"
        tableStyle={{ minWidth: '30rem' }}
      >
        <Column expander={allowExpansion} style={{ width: '5rem' }} />
        <Column field="nombre" header="Nombre Completo" />
        <Column field="email" header="Email" />
        <Column field="telefono" header="Teléfono" />
        <Column field="telefono2" header="Teléfono 2" />
        <Column field="tipoContacto" header="Cargo" body={(rowData) => rowData.tipoContacto == 1 ? "Gerente" : "Sub Gerente"} />
        <Column field="activo" header="Activo" body={(rowData) => rowData.activo == true ? "Si" : "No"} />
        <Column header="Acción" body={actionButtonsGerentes} style={{ minWidth: '12rem' }} />
      </DataTable>
    </div>
  );
}