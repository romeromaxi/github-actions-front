import React, { useEffect, useRef, useState } from 'react';
import { FormProvider, useForm, useFormState } from 'react-hook-form';
import { useAction } from 'hooks/useAction';
import {
  CompanyDetailFormFields,
  CompanyViewDTO,
} from 'types/company/companyData';
import CompanyActivityForm, {
  CompanyActivityFormFields,
} from './CompanyActivityForm';
import { CompanyActivityInsert } from 'types/company/companyActivityData';
import { EntityWithId, EntityWithIdFields } from 'types/baseEntities';
import { HttpCompanyActivity } from 'http/company/httpCompanyActivity';
import { HttpCompany } from 'http/index';
import CardEditingWithContext from 'components/cards/CardEditingWithContext';
import {useApplicationCommon} from "hooks/contexts/ApplicationCommonContext";
import { Grid, Button } from '@mui/material';
import { Skeleton } from '@mui/lab';
import { PaperclipIcon } from 'lucide-react';

interface CompanyActiviyFormData
  extends CompanyActivityInsert,
    EntityWithId<number> {
  [CompanyActivityFormFields.HasLicense]: boolean;
  [CompanyActivityFormFields.Company]: CompanyViewDTO;
}

interface CompanyActivityCardProps {
  company: CompanyViewDTO;
  onReload?: () => void;
  onScrollToDocs?: () => void;
}

function CompanyActivityCard({ company, onReload, onScrollToDocs }: CompanyActivityCardProps) {
  const { shouldWarnBeforeSwitch, setShouldWarnBeforeSwitch } =
    useApplicationCommon();
  const [initialShouldWarn, _] = useState<boolean>(shouldWarnBeforeSwitch);

  const { showLoader, hideLoader, snackbarSuccess, snackbarError } =
    useAction();
  const [loading, setLoading] = useState<boolean>(false);
  const [loadedCompany, setLoadedCompany] = useState<CompanyViewDTO>(company);
  const domElementRef = useRef(null);

  const methods = useForm<CompanyActiviyFormData>({
    defaultValues: {
      [CompanyActivityFormFields.Company]: {
        ...company,
      },
    },
  });

  const { isDirty, isSubmitted } = useFormState({ control: methods.control });

  useEffect(() => {
    if (isDirty) {
      setShouldWarnBeforeSwitch(isDirty);
    }
  }, [isDirty]);

  useEffect(() => {
    if (isSubmitted && !initialShouldWarn) {
      setShouldWarnBeforeSwitch(false);
    }
  }, [isSubmitted]);

  const loadCompany = () => {
    HttpCompany.getCompanyById(company[EntityWithIdFields.Id]).then(
      setLoadedCompany,
    );
  };

  const onSubmit = (data: CompanyActiviyFormData) => {
    setLoading(true);
    showLoader();
    Promise.all([
      HttpCompanyActivity.updateActivity(
        company[EntityWithIdFields.Id],
        data[EntityWithIdFields.Id],
        data,
      ),
      HttpCompany.updateCompany(
        data[CompanyDetailFormFields.Company][EntityWithIdFields.Id],
        { ...data[CompanyDetailFormFields.Company] },
      ),
    ])
      .then(() => {
        setLoading(false);
        loadCompany();
        hideLoader();
        snackbarSuccess('Las actividades se guardaron correctamente');
        onReload && onReload();
      })
      .catch(() => {
        snackbarError('Error al guardar los datos');
        loadCompany();
        setLoading(false);
        hideLoader();
      });
  };

  const onCloseEdit = () => {
    loadCompany();
  };

  const handleSubmit = async () => {
    await methods.handleSubmit(onSubmit)();
  };

  const handleDiscard = () => {
    onCloseEdit();
  };

  const docsButton = onScrollToDocs ? (
    <Button
      variant={'outlined'}
      color={'secondary'}
      size={'small'}
      onClick={onScrollToDocs}
      startIcon={<PaperclipIcon size={18} />}
    >
      Documentos relacionados
    </Button>
  ) : null;

  return (
    <FormProvider {...methods}>
      {company && !loading ? (
        <CardEditingWithContext 
          title="Actividad Principal"
          onDiscard={handleDiscard}
          onSubmit={handleSubmit}
          useAppCommon
          additionalActions={docsButton}
        >
          <div ref={domElementRef}>
            <CompanyActivityForm company={loadedCompany} />
          </div>
        </CardEditingWithContext>
      ) : (
        <CardEditingWithContext 
          title="Actividad Principal"
          onDiscard={() => {}}
          onSubmit={async () => {}}
          additionalActions={docsButton}
        >
          <Grid container spacing={2}>
            {Array.from({ length: 10 }).map((d, k) => (
              <Grid item md={6} xs={12} key={k}>
                <Skeleton height={60} />
              </Grid>
            ))}
          </Grid>
        </CardEditingWithContext>
      )}
    </FormProvider>
  );
}

export default CompanyActivityCard;
