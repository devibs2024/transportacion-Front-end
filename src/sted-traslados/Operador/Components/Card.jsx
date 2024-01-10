
import { Card } from 'primereact/card';

export const CustomCard = (props) => {

    return (

        <div className="card">
            <Card>
                {/* <div className="p-3"> */}
                    {props.children}
                {/* </div> */}
            </Card>
            {/* <Card className={`text-white ${props.className} custom-blue-border`}>
                <Card.Header as="h5" className="custom-blue" ><span className={`text-white`}><b>{props.titulo}</b></span>

                </Card.Header>
                <Card.Body >
                    <div className="p-3">
                        {props.children}
                    </div>
                </Card.Body>
            </Card> */}
        </div>
    );
}


