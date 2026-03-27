import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, Grid, Stack } from '@mui/material';
import {
  CompanyCertifications,
  CompanyCertificationsFields,
  CompanyFinanceHeader,
  CompanyFinanceHeaderFields,
  CompanyFinancialYearFields,
} from 'types/company/companyFinanceInformationData';
import { useAction } from 'hooks/useAction';
import { HttpCompanyCertifications } from 'http/index';
import { EntityWithIdFields } from 'types/baseEntities';
import CardLoading from 'components/cards/CardLoading';
import TitleWithSubtitleCard from 'components/text/TitleWithSubtitleCard';
import { dateFormatter } from 'util/formatters/dateFormatter';
import TotalBoxComponent from 'components/misc/TotalBoxComponent';
import { downloadFileBlobHelper } from 'util/helpers';
import { ButtonIconExportDropdown } from 'components/buttons/ButtonExportDropdown';
import {
  DeleteButton,
  DeleteIconButton,
  SearchButton,
  SearchIconButton,
} from '../../../../components/buttons/Buttons';

interface CompanyCertificacionCardProps {
  certificationHeader: CompanyFinanceHeader;
  onReload: () => void;
  triggerEdit: (companyHeader: CompanyFinanceHeader) => void;
}

const CompanyCertificacionCard = ({
  certificationHeader,
  onReload,
  triggerEdit,
}: CompanyCertificacionCardProps) => {
  const { snackbarSuccess, snackbarError } = useAction();
  const [loading, setLoading] = useState<boolean>(false);
  const [certification, setCertification] = useState<CompanyCertifications>();

  const onHandleEdit = () => triggerEdit(certificationHeader);

  const onHandleDelete = () => {
    setLoading(true);

    HttpCompanyCertifications.delete(
      certificationHeader[CompanyFinanceHeaderFields.CompanyId],
      certificationHeader[EntityWithIdFields.Id],
    )
      .then(() => {
        snackbarSuccess('El certificado fue eliminado con éxito');
        onReload();
      })
      .catch(() => {
        snackbarError('El certificado no pudo ser eliminado');
      });
  };

  const onExportExcel = () =>
    HttpCompanyCertifications.exportToExcel(
      certificationHeader[CompanyFinancialYearFields.CompanyId],
      certificationHeader[EntityWithIdFields.Id],
    ).then(downloadFileBlobHelper);

  const mapLoading = () =>
    Array.from(Array(3).keys()).map((item) => (
      <Grid item xs={12} key={`keyCardBaseLoading_${item}`}>
        <CardLoading />
      </Grid>
    ));

  useEffect(() => {
    setLoading(true);
    HttpCompanyCertifications.getById(
      certificationHeader[CompanyFinanceHeaderFields.CompanyId],
      certificationHeader[EntityWithIdFields.Id],
    )
      .then((res) => setCertification(res))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      {loading ? (
        mapLoading()
      ) : (
        <Card>
          <CardContent>
            <Stack direction={'row'}>
              <Grid
                container
                justifyContent={'space-between'}
                alignItems={'center'}
                spacing={2}
              >
                <Grid item xs={2.25}>
                  <TitleWithSubtitleCard
                    title={`Certificación`}
                    subtitle={`${dateFormatter.toShortDate(certificationHeader[CompanyFinanceHeaderFields.Date])}`}
                  />
                </Grid>
                <Grid item xs={6.25}>
                  <Stack direction={'row'} spacing={1}>
                    <TotalBoxComponent
                      label={'Total Deudas'}
                      size={'small'}
                      total={
                        certification?.[CompanyCertificationsFields.Debts_Total]
                      }
                      currency={'$'}
                    />
                    <TotalBoxComponent
                      label={'Total Ingresos'}
                      size={'small'}
                      total={
                        certification?.[
                          CompanyCertificationsFields.IncomeAnnual_Total
                        ]
                      }
                      currency={'$'}
                    />
                  </Stack>
                </Grid>
                <Grid item xs={3.5}>
                  <Stack
                    direction={'row'}
                    justifyContent={'space-around'}
                    spacing={1}
                    alignItems={'center'}
                  >
                    <SearchIconButton
                      onClick={onHandleEdit}
                      tooltipTitle={'Ver detalle'}
                    />
                    <DeleteIconButton
                      onClick={onHandleDelete}
                      tooltipTitle={'Eliminar'}
                    />
                    <ButtonIconExportDropdown onExportExcel={onExportExcel} />
                  </Stack>
                </Grid>
              </Grid>
            </Stack>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default CompanyCertificacionCard;
