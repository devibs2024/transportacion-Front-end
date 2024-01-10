
import { Card } from 'primereact/card';

export const CustomCard = (props) => {

    return (

        <div className="card">
            <Card title={props.title} >
                    {props.children}
            </Card>
        </div>
    );
}


