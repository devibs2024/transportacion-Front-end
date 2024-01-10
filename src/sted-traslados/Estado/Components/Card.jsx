import { Card } from "react-bootstrap";
import React, { useState } from 'react';


export const CustomCard = (props) => {

  return (

    <div className="card">
    <Card >
        <div className="p-3">
            {props.children}
        </div>
    </Card>
   
</div>);
}
    
