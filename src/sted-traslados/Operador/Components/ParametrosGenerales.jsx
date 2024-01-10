import { useState } from "react";
import { CustomCard } from "./Card"
import { Button, Card, Table, Modal, Form } from "react-bootstrap";
import { CardSucursal } from "./CardSucursal";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from "react-redux";
import { CardCuentaBancaria } from "./CardCuentaBancaria";

export const ParametrosGenerales = ({operador}) => {

    return (<>

        <div className="row mt-3">
           <CardSucursal operador = {operador}/>
           <CardCuentaBancaria operador={operador}/>
          
        </div>
        <div className="row">
            <div className="col col-sm-6">
                <CustomCard titulo="Sucursales" className="mt-2">

                </CustomCard>
            </div>
            <div className="col col-sm-6">
                <CustomCard titulo="Coordinadores" className="mt-2">

                </CustomCard>
            </div>
        </div>

    </>);
}