import React from 'react';
import { Disclaimer } from './Disclaimer';
import {PublicEntityEnums} from "../../util/typification/publicEntityEnums";

interface DisclaimerNosisProps {
  opacity?: boolean;
}

function DisclaimerNosis(props: DisclaimerNosisProps) {
  return (
    <Disclaimer
      text={`Para facilitarte la carga de los datos, vamos a traer la información asociada a ese CUIT desde ${PublicEntityEnums.ARCA}`}
      opacity={props.opacity}
    />
  );
}


export { DisclaimerNosis };
