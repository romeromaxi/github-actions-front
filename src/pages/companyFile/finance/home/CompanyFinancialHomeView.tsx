import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import {
  CompanyViewDTO,
  CompanyViewDTOFields,
} from 'types/company/companyData';
import { Button, Stack } from '@mui/material';
import { BackButton } from 'components/buttons/Buttons';
import {
  HttpCompany,
  HttpCompanyFinance,
  HttpExportCompanyFile,
} from 'http/index';
import CardHeaderWithBorder from 'components/cards/CardHeaderWithBorder';
import { EnumColors } from 'types/general/generalEnums';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import { getBaseColor } from 'util/typification/generalColors';
import { PersonTypes } from 'types/person/personEnums';
import CompanyFinancialLegalPersonHomeView from './CompanyFinancialLegalPersonHomeView';
import CompanyFinancialPhysicalPersonHomeView from './CompanyFinancialPhysicalPersonHomeView';
import { useAction } from '../../../../hooks/useAction';
import { EntityWithIdFields } from '../../../../types/baseEntities';
import CompanyFileButtonValidate from '../../components/CompanyFileButtonValidate';
import { CompanyFileSourceType } from '../../../../types/company/companyEnums';
import { downloadFileBlobHelper } from '../../../../util/helpers';
import useAxios from '../../../../hooks/useAxios';
import { ButtonExportDropdown } from '../../../../components/buttons/ButtonExportDropdown';

interface CompanyFinancialHomeProps {
  companyId: number;
}

export interface CompanyFinancialPersonHomeViewProps {
  company?: CompanyViewDTO;
  hideFlows?: boolean;
  onAllowEdit?: (arg: boolean) => void;
  allowEdit?: boolean
}

function CompanyFinancialHomeView({ companyId }: CompanyFinancialHomeProps) {
  const navigate = useNavigate();
  const { setTitle } = useAction();
  const { fetchAndDownloadFile } = useAxios();

  const [isLoading, setLoading] = useState<boolean>();
  const [company, setCompany] = useState<CompanyViewDTO>();

  const goToBack = () => navigate(-1);

  const downlaodFinancialInformation = () =>
    fetchAndDownloadFile(() =>
      HttpExportCompanyFile.exportFinancialInformationToExcelByCompany(
        companyId,
      ),
    );

  const mapActionTitle = () => (
    <>
      <ButtonExportDropdown
        size={'small'}
        onExportExcel={downlaodFinancialInformation}
      />

      <BackButton size={'small'} onClick={goToBack}>
        Legajo de Contacto
      </BackButton>
    </>
  );

  useEffect(() => {
    loadData();
  }, [companyId]);

  const loadData = () => {
    if (companyId) {
      setLoading(true);

      HttpCompany.getCompanyById(companyId).then((responses) => {
        setCompany(responses);
        setLoading(false);
      });
    }
  };
  setTitle('Legajo - Información económica financiera', mapActionTitle());

  return (
    <Stack mt={3} spacing={1}>
      {company &&
      company[CompanyViewDTOFields.PersonTypeCode] === PersonTypes.Physical ? (
        <CompanyFinancialPhysicalPersonHomeView company={company} />
      ) : (
        <CompanyFinancialLegalPersonHomeView company={company} />
      )}
    </Stack>
  );
}

export default CompanyFinancialHomeView;
