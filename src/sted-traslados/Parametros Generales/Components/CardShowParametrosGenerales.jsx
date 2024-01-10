import React, { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';

export const CardShowParametrosGenerales = () => {

    const [data, setData] = useState([]);

    const addRow = () => {
        setData([...data, {}]);
    };

    const updateRow = (rowData, field, value) => {
        const updatedData = [...data];
        const rowIndex = data.findIndex((row) => row === rowData);
        updatedData[rowIndex][field] = value;
        setData(updatedData);
    };

    const renderCell = (rowData, field) => {
        return (
            <input
                type="text"
                value={rowData[field]}
                onChange={(e) => updateRow(rowData, field, e.target.value)}
            />
        );
    };

    const renderButton = () => {
        return <Button icon="pi pi-plus" onClick={addRow} />;
    };

    const renderDataTable = () => {
        return (
            <DataTable value={data}>
                <Column
                    field="Descuento ZonaSted"
                    header="Descuento ZonaSted"
                    body={(rowData) => renderCell(rowData, 'Descuebto')}
                />
                <Column
                    field="ZonaSted"
                    header="ZonaSted"
                    body={(rowData) => renderCell(rowData, 'ZonaSted')}
                />
                <Column body={renderButton} style={{ width: '50px' }} />
            </DataTable>
        );
    };

    return (
        <div>
            {renderDataTable()}
        </div>
    );
};

