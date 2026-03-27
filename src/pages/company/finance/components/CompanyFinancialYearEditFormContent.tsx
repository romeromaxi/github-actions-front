import React, { useContext, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Grid } from '@mui/material';

import TitleCardContent from 'components/text/TitleCardContent';
import { NavsTabHorizontal } from 'components/navs/NavsTab';
import { CompanyFinancialYearComponentContext } from './CompanyFinancialYearComponent';
import {
  CompanyPatrimonialStatement,
  companyPatrimonialStatementInitial,
  CompanyIncomeStatement,
  CompanyIncomeStatementFields,
  companyIncomeStatementInitial,
  CompanyBasePatrimonialStatementFields,
} from 'types/company/companyFinanceInformationData';
import { SendButton } from 'components/buttons/Buttons';
import CompanyPatrimonialStatementEditFormContent from '../patrimonialStatement/CompanyPatrimonialStatementEditFormContent';
import CompanyIncomeStatementEditFormContent from '../incomeStatement/CompanyIncomeStatementEditFormContent';
import {
  HttpCompanyPatrimonialStatement,
  HttpCompanyIncomeStatement,
  HttpFilesCompanyFinancialYear,
} from 'http/index';
import { EntityWithIdFields } from 'types/baseEntities';
import { LoaderBlockUI } from 'components/loader';
import { FileDocumentListSectionFinancialYear } from 'components/files/FileDocumentListSection';
import { Document, FileBase } from 'types/files/filesData';
import {FinancialYearEditFormFields, FinancialYearEditFormType} from "./FinancialYearDetail";

interface CompanyFinancialYearEditFormContentProps {
  onSubmit: () => void;
}

function CompanyFinancialYearEditFormContent(
  props: CompanyFinancialYearEditFormContentProps,
) {
  const {
    companyId,
    financialYearId,
    patrimonialStatementId,
    incomeStatementId,
  } = useContext(CompanyFinancialYearComponentContext);
  const nameForm: string = `updateFinancialYear-${companyId}-${patrimonialStatementId}-${incomeStatementId}-form`;

  const [isLoading, setLoading] = useState<boolean>(false);
  const [files, setFiles] = useState<Document[]>();

  const methods = useForm<FinancialYearEditFormType>({
    defaultValues: {
      [FinancialYearEditFormFields.PatrimonialStatement]: {
        ...companyPatrimonialStatementInitial,
        [EntityWithIdFields.Id]: patrimonialStatementId,
        [CompanyBasePatrimonialStatementFields.CompanyId]: companyId,
      } as CompanyPatrimonialStatement,
      [FinancialYearEditFormFields.IncomeStatement]: {
        ...companyIncomeStatementInitial,
        [EntityWithIdFields.Id]: incomeStatementId,
        [CompanyIncomeStatementFields.CompanyId]: companyId,
      } as CompanyIncomeStatement,
    },
  });

  const onHandleSubmit = (data: FinancialYearEditFormType) => {
    setLoading(true);
    Promise.all([
      HttpCompanyPatrimonialStatement.update(
        companyId,
        patrimonialStatementId,
        data[FinancialYearEditFormFields.PatrimonialStatement],
      ),
      HttpCompanyIncomeStatement.update(
        companyId,
        incomeStatementId,
        data[FinancialYearEditFormFields.IncomeStatement],
      ),
    ])
      .then(() => {
        props.onSubmit();
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadFiles();

    Promise.all([
      HttpCompanyPatrimonialStatement.getById(
        companyId,
        patrimonialStatementId,
      ),
      HttpCompanyIncomeStatement.getById(companyId, incomeStatementId),
    ]).then((values) => {
      methods.reset({
        [FinancialYearEditFormFields.PatrimonialStatement]: values[0],
        [FinancialYearEditFormFields.IncomeStatement]: values[1],
      });
    });
  }, []);

  const onSaveFile = (fileCompany: FileBase, file: File): Promise<any> => {
    return HttpFilesCompanyFinancialYear.insert(
      companyId,
      financialYearId,
      fileCompany,
      file,
    );
  };

  const loadFiles = () => {
    setFiles(undefined);

    HttpFilesCompanyFinancialYear.getFilesByCompanyAndFinancialYear(
      companyId,
      financialYearId,
    ).then(setFiles);
  };

  return (
    <FormProvider {...methods}>
      <form id={nameForm} onSubmit={methods.handleSubmit(onHandleSubmit)}>
        <Grid container spacing={2} justifyContent="flex-end">
          <Grid item xs={12}>
            <TitleCardContent text="Edición" />
          </Grid>
          <Grid item xs={12}>
            <NavsTabHorizontal
              lstTabs={[
                {
                  tabList: [
                    {
                      label: 'Estado de Situación Patrimonial',
                      content: (
                        <CompanyPatrimonialStatementEditFormContent
                          nameBase={
                            FinancialYearEditFormFields.PatrimonialStatement
                          }
                        />
                      ),
                      default: true,
                    },
                    {
                      label: 'Estado de Resultado',
                      content: (
                        <CompanyIncomeStatementEditFormContent
                          nameBase={
                            FinancialYearEditFormFields.IncomeStatement
                          }
                        />
                      ),
                    },
                  ],
                },
              ]}
            />
          </Grid>

          <Grid item xs={12}>
            <FileDocumentListSectionFinancialYear
              title="Documentación Respaldatoria"
              filesDocument={files}
              onSaveFile={onSaveFile}
              onReload={loadFiles}
              delete
              preview
            />
          </Grid>

          <Grid item xs={2}>
            <SendButton type="submit" form={nameForm}>
              Guardar
            </SendButton>
          </Grid>
        </Grid>
      </form>

      {isLoading && <LoaderBlockUI />}
    </FormProvider>
  );
}

export default CompanyFinancialYearEditFormContent;
