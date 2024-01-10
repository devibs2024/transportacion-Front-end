
import { Card } from 'primereact/card';



export const CustomCard = (props) => {

    return (

        <div className="card">
            <Card >
                    {props.children}
            </Card>
        </div>
    );
}


