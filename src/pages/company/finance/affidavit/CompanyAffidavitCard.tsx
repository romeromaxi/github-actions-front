import {
  CompanyAffidavit,
  CompanyAffidavitFields,
  CompanyFinanceHeader,
  CompanyFinanceHeaderFields,
  CompanyFinancialYearFields,
} from '../../../../types/company/companyFinanceInformationData';
import { useAction } from '../../../../hooks/useAction';
import React, { useEffect, useState } from 'react';
import { HttpCompanyAffidavit } from '../../../../http';
import { EntityWithIdFields } from '../../../../types/baseEntities';
import { Box, Card, CardContent, Grid, Stack } from '@mui/material';
import TitleWithSubtitleCard from '../../../../components/text/TitleWithSubtitleCard';
import { dateFormatter } from '../../../../util/formatters/dateFormatter';
import TotalBoxComponent from '../../../../components/misc/TotalBoxComponent';
import CardLoading from '../../../../components/cards/CardLoading';
import { downloadFileBlobHelper } from '../../../../util/helpers';
import { ButtonIconExportDropdown } from '../../../../components/buttons/ButtonExportDropdown';
import {
  DeleteButton,
  DeleteIconButton,
  SearchButton,
  SearchIconButton,
} from '../../../../components/buttons/Buttons';

interface CompanyAffidavitCardProps {
  affidavitHeader: CompanyFinanceHeader;
  onReload: () => void;
  triggerEdit: (newAffidavitHeader: CompanyFinanceHeader) => void;
}

const CompanyAffidavitCard = ({
  affidavitHeader,
  onReload,
  triggerEdit,
}: CompanyAffidavitCardProps) => {
  const { snackbarSuccess, snackbarError } = useAction();
  const [loading, setLoading] = useState<boolean>(false);
  const [affidavit, setAffidavit] = useState<CompanyAffidavit>();

  const onHandleEdit = () => triggerEdit(affidavitHeader);

  const onHandleDelete = () => {
    setLoading(true);

    HttpCompanyAffidavit.delete(
      affidavitHeader[CompanyFinanceHeaderFields.CompanyId],
      affidavitHeader[EntityWithIdFields.Id],
    )
      .then(() => {
        snackbarSuccess('La declaración fue eliminada con éxito');
        onReload();
      })
      .catch(() => {
        snackbarError('La declaración no pudo ser eliminada');
      });
  };

  const onExportExcel = () =>
    HttpCompanyAffidavit.exportToExcel(
      affidavitHeader[CompanyFinancialYearFields.CompanyId],
      affidavitHeader[EntityWithIdFields.Id],
    ).then(downloadFileBlobHelper);

  const mapLoading = () =>
    Array.from(Array(3).keys()).map((item) => (
      <Grid item xs={12} key={`keyCardBaseLoading_${item}`}>
        <CardLoading />
      </Grid>
    ));

  useEffect(() => {
    setLoading(true);
    HttpCompanyAffidavit.getById(
      affidavitHeader[CompanyFinanceHeaderFields.CompanyId],
      affidavitHeader[EntityWithIdFields.Id],
    )
      .then((res) => setAffidavit(res))
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
                    title={`Declaración`}
                    subtitle={`${dateFormatter.toShortDate(affidavitHeader[CompanyFinanceHeaderFields.Date])}`}
                  />
                </Grid>
                <Grid item xs={6.25}>
                  <Stack direction={'row'} spacing={1}>
                    <TotalBoxComponent
                      label={'Total País'}
                      size={'small'}
                      total={
                        affidavit?.[CompanyAffidavitFields.CountryAssets_Total]
                      }
                      currency={'$'}
                    />
                    <TotalBoxComponent
                      label={'Total Exterior'}
                      size={'small'}
                      total={
                        affidavit?.[CompanyAffidavitFields.ExteriorAssets_Total]
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

export default CompanyAffidavitCard;
