import { CardShowCoordinadores } from "../Components/CardShowCoordinadores";
import { CustomCard } from "../../../shared/card-custom";
import { useState } from "react";


export const CatalogoCoordinadores = () => {

    return (
        <div className="mt-5">
            <CustomCard title="Catálogo Coordinadores" >
                <div className="p-3">
                    <CardShowCoordinadores></CardShowCoordinadores>
                </div>
            </CustomCard>
        </div>
    );
}
