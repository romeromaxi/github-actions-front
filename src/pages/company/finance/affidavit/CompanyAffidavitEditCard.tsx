import {
  CompanyAffidavit,
  CompanyAffidavitFields,
  CompanyAffidavitInitialState,
  CompanyFinanceHeader,
  CompanyFinanceHeaderFields,
} from '../../../../types/company/companyFinanceInformationData';
import { useAction } from '../../../../hooks/useAction';
import React, { useContext, useEffect, useState } from 'react';
import { EntityWithIdFields } from '../../../../types/baseEntities';
import { FormProvider, useForm } from 'react-hook-form';
import {
  Card,
  CardContent,
  CardHeader,
  Grid,
  Skeleton,
  Stack,
} from '@mui/material';
import { HttpCompanyAffidavit } from '../../../../http';
import { TitlePage } from '../../../../components/text/TitlePage';
import { BackButton, SaveButton } from '../../../../components/buttons/Buttons';
import CardEditingBaseWithoutDetail from '../../../../components/cards/CardEditingBaseWithoutDetail';
import { dateFormatter } from '../../../../util/formatters/dateFormatter';
import { CompanyAffidavitListContext } from './CompanyAffidavitList';
import CompanyAffidavitEditDetail from './CompanyAffidavitEditDetail';
import { ButtonExportDropdown } from '../../../../components/buttons/ButtonExportDropdown';
import { downloadFileBlobHelper } from '../../../../util/helpers';
import CompanyAffidavitDocumentList from './CompanyAffidavitDocumentList';

interface CompanyAffidavitEditCardProps {
  affidavitHeader: CompanyFinanceHeader;
  onShowList: () => void;
}

export enum CompanyAffidavitFormFields {
  Affidavit = 'declaracionJurada',
}

export interface CompanyAffidavitFormType {
  [CompanyAffidavitFormFields.Affidavit]: CompanyAffidavit;
}

export const CompanyAffidavitEditContext = React.createContext({
  isLoading: false,
  affidavit: undefined as CompanyAffidavit | undefined,
});

const CompanyAffidavitEditCard = ({
  affidavitHeader,
  onShowList,
}: CompanyAffidavitEditCardProps) => {
  const { showLoader, hideLoader } = useAction();
  const [affidavit, setAffidavit] = useState<CompanyAffidavit>();
  const [isLoading, setLoading] = useState<boolean>(true);
  const affidavitId: number = affidavitHeader[EntityWithIdFields.Id];
  const companyId: number =
    affidavitHeader[CompanyFinanceHeaderFields.CompanyId];
  const declarationDate: Date =
    affidavitHeader[CompanyFinanceHeaderFields.Date];

  const { reloadAffidavitHeader } = useContext(CompanyAffidavitListContext);

  const methods = useForm<CompanyAffidavitFormType>({
    defaultValues: {
      [CompanyAffidavitFormFields.Affidavit]: {
        ...CompanyAffidavitInitialState,
        [EntityWithIdFields.Id]: affidavitId,
        [CompanyAffidavitFields.CompanyId]: companyId,
        [CompanyAffidavitFields.Date]: declarationDate,
      } as CompanyAffidavit,
    },
  });

  const handleSubmit = (data: CompanyAffidavitFormType) => {
    showLoader();

    HttpCompanyAffidavit.update(
      companyId,
      affidavitId,
      data[CompanyAffidavitFormFields.Affidavit],
    )
      .then(() => {
        reloadAffidavitHeader();
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
    HttpCompanyAffidavit.exportToExcel(companyId, affidavitId).then(
      downloadFileBlobHelper,
    );

  useEffect(() => {
    setLoading(true);
    HttpCompanyAffidavit.getById(companyId, affidavitId)
      .then((res) => {
        setAffidavit(res);
        methods.reset({
          [CompanyAffidavitFormFields.Affidavit]: res,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <Stack gap={1}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <TitlePage text="Edición de la declaración" />
        <BackButton
          onClick={onShowList}
          tooltipTitle={'Ver todas las Declaraciones Juradas'}
        >
          Declaraciones
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
            <CompanyAffidavitEditContext.Provider
              value={{ isLoading: isLoading, affidavit: affidavit }}
            >
              <FormProvider {...methods}>
                <CardEditingBaseWithoutDetail
                  title={`Declaración ${dateFormatter.toShortDate(affidavitHeader[CompanyFinanceHeaderFields.Date])}`}
                  icon={<ButtonExportDropdown onExportExcel={onExportExcel} />}
                  actions={viewDocsButton()}
                  editContent={
                    <CompanyAffidavitEditDetail
                      nameBase={CompanyAffidavitFormFields.Affidavit}
                    />
                  }
                  onSubmitEdit={handleSubmit}
                />
              </FormProvider>
            </CompanyAffidavitEditContext.Provider>
          )}
        </Grid>
        <Grid item xs={12} md={6}>
          <CompanyAffidavitDocumentList
            affidavitId={affidavitHeader[EntityWithIdFields.Id]}
            companyId={affidavitHeader[CompanyFinanceHeaderFields.CompanyId]}
          />
        </Grid>
      </Grid>
    </Stack>
  );
};

export default CompanyAffidavitEditCard;
