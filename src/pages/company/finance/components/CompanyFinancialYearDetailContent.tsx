import React, { useContext, useEffect, useState } from 'react';
import { Grid } from '@mui/material';

import TitleCardContent from 'components/text/TitleCardContent';
import { NavsTabHorizontal } from 'components/navs/NavsTab';
import { CompanyFinancialYearComponentContext } from './CompanyFinancialYearComponent';
import CompanyPatrimonialStatementDetailContent from '../patrimonialStatement/CompanyPatrimonialStatementDetailContent';
import CompanyIncomeStatementDetailContent from '../incomeStatement/CompanyIncomeStatementDetailContent';
import { FileDocumentListSectionFinancialYear } from 'components/files/FileDocumentListSection';
import { Document } from 'types/files/filesData';
import { HttpFilesCompanyFinancialYear } from 'http/index';

function CompanyFinancialYearDetailContent() {
  const {
    companyId,
    financialYearId,
    patrimonialStatementId,
    incomeStatementId,
  } = useContext(CompanyFinancialYearComponentContext);

  const [files, setFiles] = useState<Document[]>();

  const loadFiles = () => {
    setFiles(undefined);

    HttpFilesCompanyFinancialYear.getFilesByCompanyAndFinancialYear(
      companyId,
      financialYearId,
    ).then(setFiles);
  };

  useEffect(() => {
    loadFiles();
  }, []);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <TitleCardContent text="Vista Detalle" />
      </Grid>

      <Grid item xs={12}>
        <NavsTabHorizontal
          lstTabs={[
            {
              tabList: [
                {
                  label: 'Estado de Situación Patrimonial',
                  content: (
                    <CompanyPatrimonialStatementDetailContent
                      companyId={companyId}
                      patrimonialStatementId={patrimonialStatementId}
                    />
                  ),
                  default: true,
                },
                {
                  label: 'Estado de Resultado',
                  content: (
                    <CompanyIncomeStatementDetailContent
                      companyId={companyId}
                      incomeStatementId={incomeStatementId}
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
          share
          download
          preview
        />
      </Grid>
    </Grid>
  );
}

export default CompanyFinancialYearDetailContent;
