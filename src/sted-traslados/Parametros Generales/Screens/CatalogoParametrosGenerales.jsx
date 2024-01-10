import { CardShowParametrosGenerales } from "../Components/CardShowParametrosGenerales";
import { CustomCard } from "../../../shared/card-custom";
import { useState } from "react";


export const CatalogoCoordinadores = () => {

    return (
        <div className="mt-5">
            <CustomCard title="Catálogo Parametros Generales" >
                <div className="p-3">
                    <CardShowParametrosGenerales></CardShowParametrosGenerales>
                </div>
            </CustomCard>
        </div>
    );
}
