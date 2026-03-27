import {
  CompanyStateUpdate,
  CompanyStateUpdateFields,
  CompanyViewDTO,
  CompanyViewDTOFields,
} from '../../../types/company/companyData';
import {
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  Stack,
  Typography,
} from '@mui/material';
import BaseDialogTitle from '../../../components/dialog/BaseDialogTitle';
import { useForm } from 'react-hook-form';
import { ConfirmButton } from '../../../components/buttons/Buttons';
import { DataWithLabel } from '../../../components/misc/DataWithLabel';
import CompanyStateChip from '../../company/components/CompanyStateChip';
import { dateFormatter } from '../../../util/formatters/dateFormatter';
import { stringFormatter } from '../../../util/formatters/stringFormatter';
import { ControlledTextFieldFilled } from '../../../components/forms';
import { grey } from '@mui/material/colors';
import { useState } from 'react';
import useAxios from '../../../hooks/useAxios';
import { HttpCompany } from '../../../http';
import { EntityWithIdFields } from '../../../types/baseEntities';
import { ValidationStatesType } from '../../../types/person/personEnums';
import {UserCompany, UserCompanyFields} from "../../../types/user";

interface InternalCompanyDataDialogProps {
  open: boolean;
  onClose: () => void;
  company: UserCompany;
  onReload: () => void;
}

const InternalCompanyDataDialog = ({
  open,
  onClose,
  company,
  onReload,
}: InternalCompanyDataDialogProps) => {
  const [currentState, setCurrentState] = useState<ValidationStatesType>(
    company[CompanyViewDTOFields.CompanyStateCode],
  );

  const { control, handleSubmit, reset } = useForm<CompanyStateUpdate>();

  const { fetchData } = useAxios();

  const alreadyValidated =
    company[CompanyViewDTOFields.CompanyStateCode] ===
      ValidationStatesType.Validated ||
    company[CompanyViewDTOFields.CompanyStateCode] ===
      ValidationStatesType.Returned;
  const pendingValidation =
    company[CompanyViewDTOFields.CompanyStateCode] ===
    ValidationStatesType.PendingValidation;
  const handleClose = () => {
    reset(undefined);
    onClose();
  };

  const onSubmit = (data: CompanyStateUpdate) => {
    const submitData: CompanyStateUpdate = {
      ...data,
      [CompanyStateUpdateFields.CompanyStateCode]: currentState,
    };

    fetchData(
      () => HttpCompany.updateState(company[EntityWithIdFields.Id], submitData),
      true,
    ).then(() => {
      handleClose();
      onReload();
    });
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth={'xs'} fullWidth>
      <BaseDialogTitle
        onClose={handleClose}
        title={`Detalle de ${company[CompanyViewDTOFields.BusinessName]}`}
      />
      <DialogContent>
        <Stack spacing={2}>
          <DataWithLabel
            label={'CUIT'}
            data={
              <Chip
                color={'info'}
                label={stringFormatter.formatCuit(
                  company[CompanyViewDTOFields.CUIT],
                )}
              />
            }
            dataProps={{ textAlign: 'end' }}
            fullWidth
            rowDirection
          />
          <DataWithLabel
            label={'Estado'}
            data={
              <CompanyStateChip
                label={company[CompanyViewDTOFields.CompanyStateDesc]}
                code={company[CompanyViewDTOFields.CompanyStateCode]}
              />
            }
            dataProps={{ textAlign: 'end' }}
            rowDirection
            fullWidth
          />
          <DataWithLabel
            label={'Último acceso'}
            data={dateFormatter.toShortDate(
              company[UserCompanyFields.LastAccessDate],
            )}
            dataProps={{ textAlign: 'end' }}
            fullWidth
            rowDirection
          />
          {alreadyValidated && (
            <DataWithLabel
              label={'Observación'}
              data={
                company[CompanyViewDTOFields.CompanyStateObservation] ?? '-'
              }
              fullWidth
              rowDirection
              dataProps={{ textAlign: 'end' }}
            />
          )}

          {pendingValidation && (
            <>
              <Typography
                fontSize={16}
                color={grey[600]}
                fontWeight={500}
                textAlign={'center'}
                mt={2}
              >
                Actualizar estado a:
              </Typography>
              <Stack
                direction={'row'}
                alignItems={'center'}
                justifyContent={'space-around'}
              >
                <CompanyStateChip
                  label={'Devuelta'}
                  code={ValidationStatesType.Returned}
                  onClick={() => {
                    setCurrentState(ValidationStatesType.Returned);
                  }}
                  selected={currentState === ValidationStatesType.Returned}
                />
                <CompanyStateChip
                  label={'Validado'}
                  code={ValidationStatesType.Validated}
                  onClick={() => {
                    setCurrentState(ValidationStatesType.Validated);
                  }}
                  selected={currentState === ValidationStatesType.Validated}
                />
              </Stack>
            </>
          )}

          {pendingValidation && (
            <ControlledTextFieldFilled
              control={control}
              name={CompanyStateUpdateFields.StateObservation}
              multiline
              rows={4}
              fullWidth
              label={'Observación'}
            />
          )}
        </Stack>
      </DialogContent>
      {pendingValidation && (
        <DialogActions>
          <ConfirmButton onClick={handleSubmit(onSubmit)}>
            Actualizar
          </ConfirmButton>
        </DialogActions>
      )}
    </Dialog>
  );
};

export default InternalCompanyDataDialog;
