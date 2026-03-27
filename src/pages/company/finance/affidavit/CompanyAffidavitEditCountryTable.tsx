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

interface CompanyAffidavitEditCountryTableProps {
  nameBase: string;
}

interface ITableColumn {
  label: string;
  value: CompanyAffidavitFields;
  subtotal?: boolean;
  total?: boolean;
}

const CompanyAffidavitEditCountryTable = ({
  nameBase,
}: CompanyAffidavitEditCountryTableProps) => {
  const { control } = useFormContext();

  const columns: ITableColumn[] = [
    {
      label: 'Aeronaves',
      value: CompanyAffidavitFields.CountryAssets_Aircraft,
    },
    { label: 'Automotores', value: CompanyAffidavitFields.CountryAssets_Cars },
    {
      label: 'Inmuebles',
      value: CompanyAffidavitFields.CountryAssets_Buildings,
    },
    {
      label: 'Dinero en efectivo',
      value: CompanyAffidavitFields.CountryAssets_Cash,
    },
    { label: 'Creditos', value: CompanyAffidavitFields.CountryAssets_Credits },
    {
      label: 'Bienes en hogar',
      value: CompanyAffidavitFields.CountryAssets_HouseholdAssets,
    },
    {
      label: 'Depósitos en dinero',
      value: CompanyAffidavitFields.CountryAssets_MoneyDeposits,
    },
    {
      label: 'Bienes muebles registrados',
      value: CompanyAffidavitFields.CountryAssets_MovableAssetsRegistered,
    },
    {
      label: 'Patrimonio emplotacion unipersonal',
      value:
        CompanyAffidavitFields.CountryAssets_PatrimonyCompanyUnipersonalExploitation,
    },
    {
      label: 'Titulos públicos y privados',
      value: CompanyAffidavitFields.CountryAssets_PublicPrivateDegrees,
    },
    { label: 'Acciones', value: CompanyAffidavitFields.CountryAssets_Shares },
    { label: 'Naves', value: CompanyAffidavitFields.CountryAssets_Vessels },
    {
      label: 'Derechos reales',
      value: CompanyAffidavitFields.CountryAssets_RealRights,
    },
    {
      label: 'Otros bienes',
      value: CompanyAffidavitFields.CountryAssets_OtherAssets,
    },
    {
      label: 'Total bienes Pais',
      value: CompanyAffidavitFields.CountryAssets_Total,
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
          Bienes nacionales
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

export default CompanyAffidavitEditCountryTable;
