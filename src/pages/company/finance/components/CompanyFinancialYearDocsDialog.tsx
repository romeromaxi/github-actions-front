import BaseDialogTitle from '../../../../components/dialog/BaseDialogTitle';
import { Dialog, DialogContent } from '@mui/material';
import CompanyFinancialYearDocumentList from './CompanyFinancialYearDocumentList';
import { EntityWithIdFields } from '../../../../types/baseEntities';
import React from 'react';
import {
  CompanyFinancialYear,
  CompanyFinancialYearFields,
} from '../../../../types/company/companyFinanceInformationData';

interface CompanyFinancialYearDocsDialogProps {
  open: boolean;
  financialYear: CompanyFinancialYear;
  companyId: number;
  onClose: () => void;
}

const CompanyFinancialYearDocsDialog = ({
  open,
  financialYear,
  companyId,
  onClose,
}: CompanyFinancialYearDocsDialogProps) => {
  return (
    <Dialog open={open} maxWidth={'sm'} fullWidth onClose={onClose}>
      <BaseDialogTitle
        onClose={onClose}
        title={`Ejercicio ${financialYear[CompanyFinancialYearFields.Year]}`}
      />
      <DialogContent>
        <CompanyFinancialYearDocumentList
          financialYearId={financialYear[EntityWithIdFields.Id]}
          companyId={companyId}
        />
      </DialogContent>
    </Dialog>
  );
};

export default CompanyFinancialYearDocsDialog;
