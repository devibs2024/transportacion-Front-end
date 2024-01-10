import { CardShowVehiculos } from "../Components/CardShowVehiculos";
import { CustomCard } from "../../../shared/card-custom";
import { useState } from "react";


export const CatalogoVehiculos= () => {

    return (
        <div className="mt-5">
            <CustomCard title="Catálogo Vehículos" >
                <div className="p-3">
                    <CardShowVehiculos></CardShowVehiculos>
                </div>
            </CustomCard>
        </div>
    );
}
