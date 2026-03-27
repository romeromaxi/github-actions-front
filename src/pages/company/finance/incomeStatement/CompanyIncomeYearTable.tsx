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
import CompanyIncomeFieldVariation from './CompanyIncomeFieldVariation';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { CompanyIncomeStatementFields } from '../../../../types/company/companyFinanceInformationData';

interface CompanyIncomeYearTableProps {
  year: number;
  nameBase: string;
}

interface ITableColumn {
  label: string;
  value: CompanyIncomeStatementFields;
  subtotal?: boolean;
  total?: boolean;
}

const CompanyIncomeYearTable = ({
  year,
  nameBase,
}: CompanyIncomeYearTableProps) => {
  const { control } = useFormContext();

  const resultColumns: ITableColumn[] = [
    {
      label: 'Resultado Neto',
      value: CompanyIncomeStatementFields.NetResult,
      subtotal: true,
    },
  ];

  const handleFocus = (e: any) => e.target.select();

  const sxSubTotal = {
    '& > .MuiTableCell-root': {
      fontWeight: 600,
      color: 'black !important',
    },
  };

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

  return (
    <>
      <Grid item xs={12}>
        <Typography variant={'h6'} fontWeight={600}>
          Estado de Resultado
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
                  {year}
                </Typography>
              </TableCell>
              <TableCell variant={'head'}>
                <Typography
                  variant={'subtitle1'}
                  fontWeight={800}
                  color={'primary'}
                  textAlign={'center'}
                >
                  {year - 1}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography
                  variant={'subtitle1'}
                  fontWeight={800}
                  color={'primary'}
                >
                  Variación
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {resultColumns.map((oneColumn, index) => (
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
                <TableCell>
                  <ControlledTextFieldFilled
                    label=""
                    control={control}
                    name={`${nameBase}.estadoResultadoAnterior.${oneColumn.value}`}
                    currency
                    onFocus={handleFocus}
                    textAlign={'right'}
                    disabled={oneColumn.total}
                  />
                </TableCell>
                <TableCell>
                  <CompanyIncomeFieldVariation
                    nameBase={nameBase}
                    field={oneColumn.value}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Grid>
    </>
  );
};

export default CompanyIncomeYearTable;
