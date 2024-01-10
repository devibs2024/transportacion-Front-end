import { CardShowSubDirectores } from "../Components/CardShowSubDirectores";
import { CustomCard } from "../../../shared/card-custom";
import { useState } from "react";


export const CatalogoSubDirectores = () => {

    return (
        <div className="mt-5">
            <CustomCard title="Catálogo SubDirectores" >
                <div className="p-3">
                    <CardShowSubDirectores></CardShowSubDirectores>
                </div>
            </CustomCard>
        </div>
    );
}
