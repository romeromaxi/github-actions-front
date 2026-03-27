import React, {useMemo} from 'react';
import { Stack, Typography } from '@mui/material';
import DrawerBase from 'components/misc/DrawerBase';
import NewCompanyDrawerStyles from '../newCompany/NewCompanyDrawer.styles';
import CompanySendMailForm from './CompanySendMailForm';
import { stringFormatter } from 'util/formatters/stringFormatter';
import {SendButton} from "components/buttons/Buttons";
import {CompanyViewDTO, CompanyViewDTOFields} from "types/company/companyData";
import {PersonTypes} from "types/person/personEnums";

interface CompanyInviteThroughMailDrawerProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  company: CompanyViewDTO;
  inProcess: boolean;
}

const CompanyInviteThroughMailDrawer = ({
  open,
  onClose,
  onConfirm,
  company,
  inProcess
}: CompanyInviteThroughMailDrawerProps) => {
  const classes = NewCompanyDrawerStyles();
  const isPhysicalCompany = company[CompanyViewDTOFields.PersonTypeCode] === PersonTypes.Physical;
  
  const inviteText = useMemo(() => {
    if (company[CompanyViewDTOFields.MailInvitationResponsible]) 
      return `Invitación enviada a: ${company[CompanyViewDTOFields.MailInvitationResponsible]}`
    
    if (isPhysicalCompany)
      return 'Para obtener la cuenta verificada y disfrutar de todas las funcionalidades, ingresá la información del responsable de la empresa';
    
    return 'Para obtener la cuenta verificada y disfrutar de todas las funcionalidades, ingresá la información del responsable de la empresa y alguno de los documentos que acrediten su relación con la misma.';
  }, [company]);
  
  const renderDrawerDescription = () => {
    if (company[CompanyViewDTOFields.MailInvitationResponsible]) {
      return (
          <Stack>
            <Typography fontSize={16}>
              Si el responsable no recibió el correo
            </Typography>
            <ul>
              <li>
                {isPhysicalCompany ? 'Verificá que el mail sea correcto' : 'Verificá que el mail y el cuit sean los correctos'}
              </li>
              <li>
                Por las dudas, sugerile revisar la bandeja de spam
              </li>
              <li>
                Si querés reenviar el mail podés hacerlo aquí
              </li>
            </ul>
          </Stack>
      )
    }
    if (!inProcess) {
      return (
          <Stack>
            <Typography fontSize={16}>
              La cuenta verificada permite:
            </Typography>
            <ul>
              <li>
                Varios usuarios con perfiles diferenciados
              </li>
              <li>
                Visualizar tus indicadores crediticios a través de VER CÓMO TE VEN
              </li>
              <li>
                Almacenar y gestionar tu información y documentos para todas tus operaciones con una única carga
              </li>
            </ul>
          </Stack>
      )
    }
  }
  
  return (
    <DrawerBase
      show={open}
      onCloseDrawer={onClose}
      title={`Verificación de empresa ${inProcess ? 'en proceso' : ''}`}
      action={<SendButton form={"company-send-mail-form"} type={"submit"}>Enviar</SendButton>}
    >
      <Stack spacing={2}>
        <Stack>
          <Typography className={classes.companyName}>{company[CompanyViewDTOFields.BusinessName]}</Typography>
          
          <Typography className={classes.companyCuit}>
            {`CUIT: ${stringFormatter.formatCuit(company[CompanyViewDTOFields.CUIT])}`}
          </Typography>
        </Stack>
        <Typography fontSize={16}>
          {inviteText}
        </Typography>
        {renderDrawerDescription()}
        <CompanySendMailForm company={company} onConfirm={onConfirm} />
        {company[CompanyViewDTOFields.MailInvitationResponsible] && <Typography fontSize={16}>Ante cualquier duda, contactanos</Typography>}
      </Stack>
    </DrawerBase>
  );
};

export default CompanyInviteThroughMailDrawer;
