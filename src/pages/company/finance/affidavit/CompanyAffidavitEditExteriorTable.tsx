import { CompanyAffidavitFields } from '../../../../types/company/companyFinanceInformationData';
import { useFormContext } from 'react-hook-form';
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

interface CompanyAffidavitEditExteriorTableProps {
  nameBase: string;
}

interface ITableColumn {
  label: string;
  value: CompanyAffidavitFields;
  subtotal?: boolean;
  total?: boolean;
}

const CompanyAffidavitEditExteriorTable = ({
  nameBase,
}: CompanyAffidavitEditExteriorTableProps) => {
  const { control } = useFormContext();

  const columns: ITableColumn[] = [
    {
      label: 'Inmuebles',
      value: CompanyAffidavitFields.ExteriorAssets_Buildings,
    },
    { label: 'Automotores', value: CompanyAffidavitFields.ExteriorAssets_Cars },
    { label: 'Creditos', value: CompanyAffidavitFields.ExteriorAssets_Credits },
    { label: 'Titulos', value: CompanyAffidavitFields.ExteriorAssets_Degree },
    {
      label: 'Depositos en dinero',
      value: CompanyAffidavitFields.ExteriorAssets_MoneyDeposits,
    },
    {
      label: 'Derechos reales',
      value: CompanyAffidavitFields.ExteriorAssets_RealRights,
    },
    {
      label: 'Bienes muebles semovientes',
      value: CompanyAffidavitFields.ExteriorAssets_MovableAssetsRoving,
    },
    {
      label: 'Otros bienes',
      value: CompanyAffidavitFields.ExteriorAssets_OtherAssets,
    },
    {
      label: 'Total bienes exterior',
      value: CompanyAffidavitFields.ExteriorAssets_Total,
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
          Bienes del exterior
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

export default CompanyAffidavitEditExteriorTable;
