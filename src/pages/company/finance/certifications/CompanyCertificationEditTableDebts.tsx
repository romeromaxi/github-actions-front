import {
  CompanyAffidavitFields,
  CompanyCertificationsFields,
} from '../../../../types/company/companyFinanceInformationData';
import {
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { metronicTableSx } from '../../../../components/table';
import { ControlledTextFieldFilled } from '../../../../components/forms';
import React from 'react';
import { useFormContext } from 'react-hook-form';

interface CompanyCertificationEditTableDebtsProps {
  nameBase: string;
}

interface ITableColumn {
  label: string;
  value: CompanyCertificationsFields;
  subtotal?: boolean;
  total?: boolean;
}

const CompanyCertificationEditTableDebts = ({
  nameBase,
}: CompanyCertificationEditTableDebtsProps) => {
  const { control } = useFormContext();

  const columns: ITableColumn[] = [
    {
      label: 'Comerciales',
      value: CompanyCertificationsFields.Debts_Commercial,
    },
    { label: 'Personales', value: CompanyCertificationsFields.Debts_Personal },
    { label: 'Fiscales', value: CompanyCertificationsFields.Debts_Tax },
    {
      label: 'Total',
      value: CompanyCertificationsFields.Debts_Total,
      total: true,
    },
  ];

  const sxTotal = {
    '& > .MuiTableCell-root': {
      fontWeight: 800,
      textTransform: 'uppercase',
      fontSize: '15px',
      backgroundColor: 'rgba(245, 248, 250, 0.75) !important',
      color: '#181C32 !important',
      '& > p': {
        color: 'grey.900 !important',
      },
    },
  };

  const sxSubTotal = {
    '& > .MuiTableCell-root': {
      fontWeight: 600,
      color: 'black !important',
    },
  };

  const handleFocus = (e: any) => e.target.select();

  return (
    <Grid container>
      <Grid item xs={12}>
        <Typography variant={'h6'} fontWeight={600}>
          Deudas
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Table stickyHeader sx={metronicTableSx}>
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography
                  variant={'subtitle1'}
                  fontWeight={800}
                  color={'primary'}
                  textAlign={'left !important'}
                >
                  {''}
                </Typography>
              </TableCell>
              <TableCell variant={'head'}>
                <Typography
                  variant={'subtitle1'}
                  fontWeight={800}
                  color={'primary'}
                >
                  Monto
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {columns.map((oneColumn, index) => (
              <TableRow
                key={`column_${oneColumn.value}_${index}`}
                sx={
                  oneColumn.total
                    ? sxTotal
                    : oneColumn.subtotal
                      ? sxSubTotal
                      : {}
                }
              >
                <TableCell>
                  <Typography color={'#7E8299 !important'}>
                    {oneColumn.label}
                  </Typography>
                </TableCell>
                <TableCell>
                  <ControlledTextFieldFilled
                    label=""
                    control={control}
                    name={`${nameBase}.${oneColumn.value}`}
                    currency
                    onFocus={handleFocus}
                    textAlign={'right'}
                    disabled={oneColumn.total}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Grid>
    </Grid>
  );
};

export default CompanyCertificationEditTableDebts;
