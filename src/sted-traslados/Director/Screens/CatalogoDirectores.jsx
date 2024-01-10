import { CardShowDirectores } from "../Components/CardShowDirectores";
import { CustomCard } from "../../../shared/card-custom";
import { useState } from "react";


export const CatalogoDirectores = () => {

    return (
        <div className="mt-5">
            <CustomCard title="Catálogo Directores" >
                <div className="p-3">
                    <CardShowDirectores></CardShowDirectores>
                </div>
            </CustomCard>
        </div>
    );
}
