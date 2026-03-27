import React, { useContext, useEffect, useState } from 'react';
import { useAction } from 'hooks/useAction';
import { FormProvider, useForm } from 'react-hook-form';
import {
  Card,
  CardContent,
  CardHeader,
  Grid,
  Skeleton,
  Stack,
} from '@mui/material';
import {
  CompanyCertifications,
  CompanyCertificationsFields,
  CompanyCertificationsInitialState,
  CompanyFinanceHeader,
  CompanyFinanceHeaderFields,
} from 'types/company/companyFinanceInformationData';
import { EntityWithIdFields } from 'types/baseEntities';
import { HttpCompanyCertifications } from 'http/index';
import { TitlePage } from 'components/text/TitlePage';
import { BackButton, SaveButton } from 'components/buttons/Buttons';
import CardEditingBaseWithoutDetail from 'components/cards/CardEditingBaseWithoutDetail';
import { dateFormatter } from 'util/formatters/dateFormatter';
import CompanyCertificationEditDetail from './CompanyCertificationEditDetail';
import { CompanyCertificationListContext } from './CompanyCertificationsList';
import { ButtonExportDropdown } from 'components/buttons/ButtonExportDropdown';
import { downloadFileBlobHelper } from 'util/helpers';
import CompanyCertificationDocumentList from './CompanyCertificationDocumentList';

interface CompanyCertificationEditCardProps {
  certificationHeader: CompanyFinanceHeader;
  onShowList: () => void;
}

export enum CompanyCertificationFormFields {
  Certification = 'certificacion',
}

export interface CompanyCertificationFormType {
  [CompanyCertificationFormFields.Certification]: CompanyCertifications;
}

export const CompanyCertificationEditContext = React.createContext({
  isLoading: false,
  certification: undefined as CompanyCertifications | undefined,
});

const CompanyCertificationEditCard = ({
  certificationHeader,
  onShowList,
}: CompanyCertificationEditCardProps) => {
  const { showLoader, hideLoader } = useAction();
  const [certification, setCertification] = useState<CompanyCertifications>();
  const [isLoading, setLoading] = useState<boolean>(true);
  const certificationId: number = certificationHeader[EntityWithIdFields.Id];
  const companyId: number =
    certificationHeader[CompanyFinanceHeaderFields.CompanyId];
  const certificationDate: Date =
    certificationHeader[CompanyFinanceHeaderFields.Date];

  const { reloadCertificationHeader } = useContext(
    CompanyCertificationListContext,
  );

  const methods = useForm<CompanyCertificationFormType>({
    defaultValues: {
      [CompanyCertificationFormFields.Certification]: {
        ...CompanyCertificationsInitialState,
        [EntityWithIdFields.Id]: certificationId,
        [CompanyCertificationsFields.CompanyId]: companyId,
        [CompanyCertificationsFields.Date]: certificationDate,
      } as CompanyCertifications,
    },
  });
  const handleSubmit = (data: CompanyCertificationFormType) => {
    showLoader();

    HttpCompanyCertifications.update(
      companyId,
      certificationId,
      data[CompanyCertificationFormFields.Certification],
    )
      .then(() => {
        reloadCertificationHeader();
      })
      .finally(() => {
        hideLoader();
      });
  };

  const viewDocsButton = () => {
    return (
      <SaveButton onClick={methods.handleSubmit(handleSubmit)}>
        Guardar
      </SaveButton>
    );
  };

  const onExportExcel = () =>
    HttpCompanyCertifications.exportToExcel(companyId, certificationId).then(
      downloadFileBlobHelper,
    );

  useEffect(() => {
    setLoading(true);
    HttpCompanyCertifications.getById(companyId, certificationId)
      .then((res) => {
        setCertification(res);
        methods.reset({
          [CompanyCertificationFormFields.Certification]: res,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <Stack gap={1}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <TitlePage text="Edición de la certificación" />
        <BackButton
          onClick={onShowList}
          tooltipTitle={'Ver todas las Certificaciones'}
        >
          Certificaciones
        </BackButton>
      </Stack>
      <Grid container spacing={1}>
        <Grid item xs={12} md={6}>
          {isLoading ? (
            <Card>
              <CardHeader title={<Skeleton width={'20%'} />} />
              <CardContent>
                <Grid container spacing={1}>
                  {Array.from(Array(10).keys()).map((item) => (
                    <Grid
                      item
                      xs={12}
                      key={`keyCardBaseLoading_${item}`}
                      alignItems={'center'}
                    >
                      <Skeleton sx={{ width: '100%' }} />
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          ) : (
            <CompanyCertificationEditContext.Provider
              value={{ isLoading: isLoading, certification: certification }}
            >
              <FormProvider {...methods}>
                <CardEditingBaseWithoutDetail
                  title={`Certificación ${dateFormatter.toShortDate(certificationHeader[CompanyFinanceHeaderFields.Date])}`}
                  icon={<ButtonExportDropdown onExportExcel={onExportExcel} />}
                  actions={viewDocsButton()}
                  editContent={
                    <CompanyCertificationEditDetail
                      nameBase={CompanyCertificationFormFields.Certification}
                    />
                  }
                  onSubmitEdit={handleSubmit}
                />
              </FormProvider>
            </CompanyCertificationEditContext.Provider>
          )}
        </Grid>
        <Grid item xs={12} md={6}>
          <CompanyCertificationDocumentList
            certificationId={certificationHeader[EntityWithIdFields.Id]}
            companyId={
              certificationHeader[CompanyFinanceHeaderFields.CompanyId]
            }
          />
        </Grid>
      </Grid>
    </Stack>
  );
};

export default CompanyCertificationEditCard;
