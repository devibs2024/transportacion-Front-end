import { Card } from 'primereact/card';

export default function CustomCard (props) {

    return (

        <div className="card">
            <Card title={props.title} >
                    {props.children}
            </Card>
        </div>
    );
}

