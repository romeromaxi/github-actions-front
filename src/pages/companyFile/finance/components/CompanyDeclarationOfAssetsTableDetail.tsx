import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';

import { DefaultStylesButton } from 'components/buttons/Buttons';

import {
  CompanyDeclarationOfAssets,
  CompanyDeclarationOfAssetsFields,
} from 'types/company/companyFinanceInformationData';

import { HttpCompanyDeclarationOfAssets, HttpCompanyFile } from 'http/index';
import { dateFormatter } from 'util/formatters/dateFormatter';
import { numberFormatter } from 'util/formatters/numberFormatter';
import { PersonTypes } from 'types/person/personEnums';
import { EntityWithIdFields } from 'types/baseEntities';
import { CompanyFinancialHomeContext } from '../CompanyFinancialHome';
import { Alert } from '@mui/lab';
import { CompanyFileSourceType } from '../../../../types/company/companyEnums';

interface CompanyDeclarationOfAssetsTableDetailProps {
  dataId: number;
  dataSource?: CompanyFileSourceType;
  editAllowed?: boolean;
}

interface ITableColumn {
  label: string;
  value: CompanyDeclarationOfAssetsFields;
  subtotal?: boolean;
  total?: boolean;
}

function CompanyDeclarationOfAssetsTableDetail({
  dataId,
  dataSource = CompanyFileSourceType.Company,
  editAllowed = true,
}: CompanyDeclarationOfAssetsTableDetailProps) {
  const navigate = useNavigate();
  const { setDateDeclarationOfAssets } = useContext(
    CompanyFinancialHomeContext,
  );

  const [declarationOfAssets, setDeclarationOfAssets] =
    useState<CompanyDeclarationOfAssets>();

  const columns: ITableColumn[] = [
    { label: 'Efectivo', value: CompanyDeclarationOfAssetsFields.Cash },
    {
      label: 'Bancos (Ctas. Ctes. / Caja de Ahorro)',
      value: CompanyDeclarationOfAssetsFields.BankCheckingSavingsAccounts,
    },
    {
      label: 'Depósitos a Plazo',
      value: CompanyDeclarationOfAssetsFields.DepositTime,
    },
    { label: 'Rodados', value: CompanyDeclarationOfAssetsFields.Cars },
    {
      label: 'Inmuebles',
      value: CompanyDeclarationOfAssetsFields.LandApartments,
    },
    {
      label: 'Préstamos del Banco',
      value: CompanyDeclarationOfAssetsFields.BankLoans,
    },
    {
      label: 'Participaciones accionarias',
      value: CompanyDeclarationOfAssetsFields.SharesOfStock,
    },
    {
      label: 'Otros Bienes',
      value: CompanyDeclarationOfAssetsFields.OtherAssets,
    },
    {
      label: 'Otros Créditos',
      value: CompanyDeclarationOfAssetsFields.OtherReceivables,
    },
  ];

  const goToEdit = (declarationOfAssetsId: number) =>
    navigate(`?edit=${declarationOfAssetsId}&type=${PersonTypes.Physical}`);

  useEffect(() => {
    const promiseDeclarationOfAssets =
      dataSource === CompanyFileSourceType.Company
        ? () => HttpCompanyDeclarationOfAssets.getLastByCompany(dataId)
        : () => HttpCompanyFile.getCompanyDeclarationOfAssetsByFileId(dataId);

    promiseDeclarationOfAssets().then((lastDeclaration) => {
      setDeclarationOfAssets(lastDeclaration);
      if (lastDeclaration)
        setDateDeclarationOfAssets(
          lastDeclaration[CompanyDeclarationOfAssetsFields.Date],
        );
    });
  }, []);

  const sxSubTotal = {
    '& > .MuiTableCell-root': {
      fontStyle: 'italic',
      fontWeight: 500,
    },
  };

  const sxTotal = {
    '& > .MuiTableCell-root': {
      fontWeight: 800,
      textTransform: 'uppercase',
      fontSize: '15px',
    },
  };

  return (
    <Typography component="div">
      {declarationOfAssets ? (
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography
                  variant={'subtitle1'}
                  fontWeight={800}
                  color={'primary'}
                ></Typography>
              </TableCell>
              <TableCell variant={'head'}>
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Typography
                    variant={'subtitle1'}
                    fontWeight={800}
                    color={'primary'}
                  >
                    {dateFormatter.toShortDate(
                      declarationOfAssets[
                        CompanyDeclarationOfAssetsFields.Date
                      ],
                    )}
                  </Typography>
                  {editAllowed && (
                    <DefaultStylesButton
                      startIcon={
                        <EditOutlinedIcon
                          sx={{ fontSize: '15px !important' }}
                        />
                      }
                      size="small"
                      sx={{ height: '22px', fontSize: '15px' }}
                      onClick={() =>
                        goToEdit(declarationOfAssets[EntityWithIdFields.Id])
                      }
                    >
                      Editar
                    </DefaultStylesButton>
                  )}
                </Stack>
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
                <TableCell>{oneColumn.label}</TableCell>
                <TableCell>
                  {
                    //@ts-ignore
                    numberFormatter.toStringWithAmount(
                      declarationOfAssets[oneColumn.value],
                      '$',
                    )
                  }
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <Alert severity="info">
          Para ver esta sección debe completar la fecha de la última
          manifestación de bienes personales
        </Alert>
      )}
    </Typography>
  );
}

export default CompanyDeclarationOfAssetsTableDetail;
