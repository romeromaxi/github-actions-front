import { useFormContext } from 'react-hook-form';
import {
  Grid,
} from '@mui/material';

import CompanyPatrimonialStatementEditFormContent from '../../company/finance/patrimonialStatement/CompanyPatrimonialStatementEditFormContent';

import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FinancialYearEditFormFields,
  FinancialYearEditFormType
} from "../../company/finance/components/FinancialYearDetail";

interface CompanyFinancialYearEditProps {
  onSubmit: (data: FinancialYearEditFormType) => void;
  currentYear: number;
  lastYear: number;
}

function CompanyFinancialYearEdit(props: CompanyFinancialYearEditProps) {
  const navigate = useNavigate();
  const { handleSubmit } = useFormContext<FinancialYearEditFormType>();

  const patrimonial: boolean = window.location
    .toString()
    .includes('patrimonial');
  const onHandleBackPage = () => navigate(-1);

  return (
    <div style={{ width: '100%' }}>
      <Grid container spacing={1} pt={3}>
        <Grid item xs={6}>
          <CompanyPatrimonialStatementEditFormContent
            nameBase={FinancialYearEditFormFields.PatrimonialStatement}
            year={props.lastYear}
          />
        </Grid>
        <Grid item xs={6}>
          <CompanyPatrimonialStatementEditFormContent
            nameBase={FinancialYearEditFormFields.PatrimonialStatement}
            year={props.currentYear}
          />
        </Grid>
        {/*
                        <NavsTabHorizontal lstTabs={[
                            {
                                tabList:[
                                    {
                                        label: "Estado de Situación Patrimonial",
                                        content: <CompanyPatrimonialStatementEditFormContent nameBase={CompanyFinancialYearEditFormFields.Patrimonial} />,
                                        default: patrimonial
                                    },
                                    {
                                        label: "Estado de Resultado",
                                        content: <CompanyIncomeStatementEditFormContent nameBase={CompanyFinancialYearEditFormFields.Income} />,
                                        default: !patrimonial
                                    }
                                ]
                            }
                        ]}
                        />
                         */}
        <Grid item xs={12} textAlign="end">
          {/*
                            <CloseButton onClick={onHandleBackPage} sx={{ marginRight: 1 }}>
                                Cancelar
                            </CloseButton>
                            <SendButton onClick={handleSubmit(props.onSubmit)}>
                                Guardar
                            </SendButton>
                             */}
        </Grid>
      </Grid>
    </div>
  );
}

export default CompanyFinancialYearEdit;
