import DrawerBase from '../../../components/misc/DrawerBase';
import CompanyAfipForm from './CompanyAfipForm';
import {SendButton} from "../../../components/buttons/Buttons";

interface CompanyAfipFormDrawerProps {
  companyId: number;
  companyName: string;
  show: boolean;
  onClose: () => void;
  onConfirmed: () => void;
  viewFiles?: boolean;
  alreadySent?: boolean;
  inProcess: boolean;
}

const CompanyAfipFormDrawer = (props: CompanyAfipFormDrawerProps) => {
  return (
    <DrawerBase
      show={props.show}
      onCloseDrawer={props.onClose}
      title={`Verificación de empresa ${props.inProcess ? 'en proceso' : ''}`}
      action={!props.alreadySent ? <SendButton type={'submit'} form={'company-afip-form-file'}>Enviar</SendButton> : <></>}
    >
      <CompanyAfipForm
        companyId={props.companyId}
        companyName={props.companyName}
        onAfipConfirmed={props.onConfirmed}
        viewFiles={props.viewFiles}
      />
    </DrawerBase>
  );
};

export default CompanyAfipFormDrawer;
