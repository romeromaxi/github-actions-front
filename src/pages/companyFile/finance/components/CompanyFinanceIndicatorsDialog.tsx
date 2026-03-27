import BaseDialogTitle from '../../../../components/dialog/BaseDialogTitle';
import { Dialog, DialogContent, Grid } from '@mui/material';
import React from 'react';
import {
  CompanyViewDTO,
  CompanyViewDTOFields,
} from '../../../../types/company/companyData';
import { Alert } from '@mui/lab';
import { EntityWithIdFields } from '../../../../types/baseEntities';
import {BalancesSourceType} from "../../../../hooks/contexts/BalancesContext";
import FinancialIndicatorsTable from "./FinancialIndicatorsTable";

interface CompanyFinanceIndicatorsDialogProps {
  open: boolean;
  company: CompanyViewDTO | undefined;
  loading: boolean | undefined;
  onClose: () => void;
}

function CompanyFinanceIndicatorsDialog(
  props: CompanyFinanceIndicatorsDialogProps,
) {
  return (
    <Dialog open={props.open} onClose={props.onClose} maxWidth="md" fullWidth>
      <BaseDialogTitle title="Indicadores" onClose={props.onClose} />

      <DialogContent>
        <Grid container item xs={12}>
          {!props.loading &&
          props.company &&
          !!props.company[CompanyViewDTOFields.DayClosing] &&
          !!props.company[CompanyViewDTOFields.MonthClosing] ? (
            <FinancialIndicatorsTable error={false} dataId={props.company[EntityWithIdFields.Id]}  dataSource={BalancesSourceType.Company} />
          ) : (
            <Alert severity="info">
              Para ver esta sección debe completar primero la fecha de cierre
            </Alert>
          )}
        </Grid>
      </DialogContent>
    </Dialog>
  );
}

export default CompanyFinanceIndicatorsDialog;
