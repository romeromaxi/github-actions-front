import {
  Card,
  CardContent,
  CardHeader,
  Skeleton,
  Stack,
} from '@mui/material';
import React, { useEffect, useState, Dispatch, SetStateAction } from 'react';
import {
  CompanyDeclarationOfAssets,
  CompanyDeclarationOfAssetsFields,
  CompanyDeclarationOfAssetsInitialState,
  CompanyFinanceHeader,
  CompanyFinanceHeaderFields,
  CompanyLastYearDeclarationOfAssets,
} from 'types/company/companyFinanceInformationData';
import { HttpCompanyDeclarationOfAssets } from 'http/index';
import { EntityWithIdFields } from 'types/baseEntities';
import { FormProvider, useForm } from 'react-hook-form';
import { useLoaderActions } from 'hooks/useLoaderActions';
import CompanyDeclarationOfAssetsEditTabs from './CompanyDeclarationOfAssetsEditTabs';

interface CompanyDeclarationOfAssetsEditCardProps {
  declarationOfAssetsHeader: CompanyFinanceHeader;
  onShowList: () => void;
  onReloadTable: () => void;
  expanded?: boolean;
  expandable?: boolean;
  shouldSubmit?: boolean;
  setShouldSubmit?: Dispatch<SetStateAction<boolean>>;
  onDirtyChange?: (isDirty: boolean) => void;
  onResetReady?: (reset: () => void) => void;
  onSaveSuccess?: () => void;
}

export enum CompanyDeclarationOfAssetsFormFields {
  DeclarationOfAssets = 'manifestacionBienes',
}

export interface CompanyDeclarationOfAssetsFormType {
  [CompanyDeclarationOfAssetsFormFields.DeclarationOfAssets]: CompanyLastYearDeclarationOfAssets;
}

export const CompanyDeclarationOfAssetsEditContext = React.createContext({
  isLoading: false,
  declarationOfAssets: undefined as
    | CompanyLastYearDeclarationOfAssets
    | undefined,
});

const CompanyDeclarationOfAssetsEditCard = ({
  declarationOfAssetsHeader, onReloadTable, expanded, expandable, shouldSubmit, setShouldSubmit, onDirtyChange, onResetReady, onSaveSuccess
}: CompanyDeclarationOfAssetsEditCardProps) => {
  const { showLoader, hideLoader } = useLoaderActions();
  const [declarationOfAssets, setDeclarationOfAssets] =
    useState<CompanyLastYearDeclarationOfAssets>();
  const [isLoading, setLoading] = useState<boolean>(true);
  const [resetValues, setResetValues] = useState<CompanyDeclarationOfAssetsFormType>();
  const declarationId: number =
    declarationOfAssetsHeader[EntityWithIdFields.Id];
  const companyId: number =
    declarationOfAssetsHeader[CompanyFinanceHeaderFields.CompanyId];
  const declarationDate: Date =
    declarationOfAssetsHeader[CompanyFinanceHeaderFields.Date];


  const methods = useForm<CompanyDeclarationOfAssetsFormType>({
    defaultValues: {
      [CompanyDeclarationOfAssetsFormFields.DeclarationOfAssets]: {
        ...CompanyDeclarationOfAssetsInitialState,
        [EntityWithIdFields.Id]: declarationId,
        [CompanyDeclarationOfAssetsFields.CompanyId]: companyId,
        [CompanyDeclarationOfAssetsFields.Date]: declarationDate,
      } as CompanyDeclarationOfAssets,
    },
  });

  const handleSubmit = (data: CompanyDeclarationOfAssetsFormType) => {
    showLoader();

    HttpCompanyDeclarationOfAssets.update(
      companyId,
      declarationId,
      data[CompanyDeclarationOfAssetsFormFields.DeclarationOfAssets],
    )
      .then(() => {
        methods.reset(data);
        onReloadTable();
        onSaveSuccess?.();
      })
      .finally(() => {
        hideLoader();
      });
  };

  useEffect(() => {
    if (shouldSubmit) {
      methods.handleSubmit(handleSubmit)();
      setShouldSubmit?.(false);
    }
  }, [shouldSubmit]);

  useEffect(() => {
    onDirtyChange?.(methods.formState.isDirty);
  }, [methods.formState.isDirty, onDirtyChange]);

  useEffect(() => {
    if (!onResetReady) return;

    onResetReady(() => {
      if (resetValues) {
        methods.reset(resetValues, { keepDirty: false, keepValues: false });
      }
    });
  }, [methods, onResetReady, resetValues]);

  useEffect(() => {
    setLoading(true);
    HttpCompanyDeclarationOfAssets.getById(companyId, declarationId)
      .then((res) => {
        const values = {
          [CompanyDeclarationOfAssetsFormFields.DeclarationOfAssets]: res,
        };

        setDeclarationOfAssets(res);
        methods.reset(values, { keepDirty: false, keepValues: false });
        setResetValues(values);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <Stack spacing={3}>
      {isLoading ? (
        <Card>
          <CardHeader title={<Skeleton width={'20%'} />} />
          <CardContent>
            <Stack spacing={1}>
              {Array.from(Array(10).keys()).map((item) => (
                <Skeleton key={item} sx={{ width: '100%' }} />
              ))}
            </Stack>
          </CardContent>
        </Card>
      ) : (
        <CompanyDeclarationOfAssetsEditContext.Provider
          value={{
            isLoading: isLoading,
            declarationOfAssets: declarationOfAssets,
          }}
        >
          <FormProvider {...methods}>
            <Stack spacing={3}>
              <CompanyDeclarationOfAssetsEditTabs 
                nameBase={CompanyDeclarationOfAssetsFormFields.DeclarationOfAssets} 
                expanded={expanded} 
                expandable={expandable}
              />
            </Stack>
          </FormProvider>
        </CompanyDeclarationOfAssetsEditContext.Provider>
      )}
    </Stack>
  );
}

export default CompanyDeclarationOfAssetsEditCard;
