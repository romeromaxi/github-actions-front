import React, { useState } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { Divider, Grid, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';

import { DefaultStylesButton } from 'components/buttons/Buttons';

import { CompanyViewDTO } from 'types/company/companyData';
import { EntityWithIdFields } from 'types/baseEntities';
import {
  CompanyFlowFields,
  CompanyFlowInsertRequest,
  CompanyFlowInsertRequestFields,
  CompanyFlowSemesterData,
} from 'types/company/companyFlowData';

import { dateFormatter } from 'util/formatters/dateFormatter';
import CompanyFlowHistoryDrawer from './CompanyFlowHistoryDrawer';
import { ControlledTextFieldFilled } from '../../../components/forms';

interface CompanyFlowFormProps {
  company: CompanyViewDTO;
  flows?: CompanyFlowSemesterData[];
}

function CompanyFlowForm({ company, flows }: CompanyFlowFormProps) {
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const { control } = useFormContext<CompanyFlowInsertRequest>();

  const { fields } = useFieldArray({
    control,
    name: CompanyFlowInsertRequestFields.FlowList,
  });

  const handleFocus = (e: any) => e.target.select();

  return (
    <>
      <Grid container spacing={2}>
        <Grid item container xs={12}>
          <Grid item xs={4}>
            <Typography
              style={{ textAlign: 'center' }}
              color={grey[600]}
              fontSize={18}
            >
              Fecha
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography
              style={{ textAlign: 'center' }}
              color={grey[600]}
              fontSize={18}
            >
              Compras
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography
              style={{ textAlign: 'center' }}
              color={grey[600]}
              fontSize={18}
            >
              Ventas
            </Typography>
          </Grid>
        </Grid>

        {flows
          ? flows
              .map((field, idx) => (
                <Grid
                  key={`company-flow-row-${idx}`}
                  item
                  container
                  xs={12}
                  spacing={1}
                  alignItems={'center'}
                  sx={{ mb: -1 }}
                >
                  <Grid item xs={4}>
                    <Typography
                      color={grey[600]}
                      fontSize={14}
                      textAlign={'center'}
                    >{`${dateFormatter.toMonthNameWithYear(field[CompanyFlowFields.Date], true)}`}</Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <ControlledTextFieldFilled
                      label=""
                      control={control}
                      name={`${CompanyFlowInsertRequestFields.FlowList}.${idx}.${CompanyFlowFields.Income}`}
                      currency
                      textAlign={'right'}
                      onFocus={handleFocus}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <ControlledTextFieldFilled
                      label=""
                      control={control}
                      name={`${CompanyFlowInsertRequestFields.FlowList}.${idx}.${CompanyFlowFields.Sale}`}
                      currency
                      textAlign={'right'}
                      onFocus={handleFocus}
                    />
                  </Grid>
                </Grid>
              ))
              .reverse()
          : fields.map((field, idx) => (
              <Grid
                key={`company-flow-row-${idx}`}
                item
                container
                xs={12}
                spacing={1}
                alignItems={'center'}
                sx={{ mb: -1 }}
              >
                <Grid item xs={4}>
                  <Typography
                    color={grey[600]}
                    fontSize={14}
                    textAlign={'center'}
                  >{`${dateFormatter.toMonthNameWithYear(field[CompanyFlowFields.Date], true)}`}</Typography>
                </Grid>
                <Grid item xs={4}>
                  <ControlledTextFieldFilled
                    label=""
                    control={control}
                    name={`${CompanyFlowInsertRequestFields.FlowList}.${idx}.${CompanyFlowFields.Income}`}
                    currency
                    textAlign={'right'}
                    onFocus={handleFocus}
                  />
                </Grid>
                <Grid item xs={4}>
                  <ControlledTextFieldFilled
                    label=""
                    control={control}
                    name={`${CompanyFlowInsertRequestFields.FlowList}.${idx}.${CompanyFlowFields.Sale}`}
                    currency
                    textAlign={'right'}
                    onFocus={handleFocus}
                  />
                </Grid>
              </Grid>
            ))}
        <Grid item xs={4}>
          <DefaultStylesButton
            onClick={() => setDialogOpen(true)}
            variant={'text'}
          >
            Cargar histórico
          </DefaultStylesButton>
        </Grid>

        <Grid item xs={12}>
          <Divider />
        </Grid>
      </Grid>

      <CompanyFlowHistoryDrawer
        onClose={() => setDialogOpen(false)}
        open={dialogOpen}
        companyId={company[EntityWithIdFields.Id]}
      />
    </>
  );
}

export default CompanyFlowForm;
