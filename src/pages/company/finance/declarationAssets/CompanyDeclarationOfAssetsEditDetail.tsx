
import {
  CompanyDeclarationOfAssetsFields, CompanyDeclarationOfAssetsTotals,
  CompanyLastYearDeclarationOfAssetsFields
} from '../../../../types/company/companyFinanceInformationData';
import React, {useContext, useEffect} from 'react';
import { useFormContext } from 'react-hook-form';
import {EconomicFinancialTableWrapper} from "../../../companyFile/company/CompanyEconomicFinancialDataSection";
import {CompanyDeclarationOfAssetsEditContext} from "./CompanyDeclarationOfAssetsEditCard";
import {CompanyFinancialDeclarationOfAssetsEditTotals} from "../components/CompanyFinancialDeclarationOfAssetsTotals";

interface CompanyDeclarationOfAssetsEditDetailProps {
  nameBase: string;
  expanded?: boolean;
  expandable?: boolean;
}

const CompanyDeclarationOfAssetsEditDetail = ({
  nameBase, expanded = false, expandable = true
}: CompanyDeclarationOfAssetsEditDetailProps) => {
  const { setValue, watch } = useFormContext();
  const {declarationOfAssets} = useContext(CompanyDeclarationOfAssetsEditContext)
  const watchActiveCurrentTotal = watch(
    `${nameBase}.${CompanyDeclarationOfAssetsFields.CurrentActiveTotal}`,
    0,
  );
  const watchActiveNotCurrentTotal = watch(
    `${nameBase}.${CompanyDeclarationOfAssetsFields.NonCurrentActiveTotal}`,
    0,
  );
  const watchPassiveCurrentTotal = watch(
    `${nameBase}.${CompanyDeclarationOfAssetsFields.CurrentPassiveTotal}`,
    0,
  );
  const watchPassiveNotCurrentTotal = watch(
    `${nameBase}.${CompanyDeclarationOfAssetsFields.NonCurrentPassiveTotal}`,
    0,
  );
  const watchLastActiveCurrentTotal = watch(
    `${nameBase}.${CompanyLastYearDeclarationOfAssetsFields.LastDeclarationOfAssets}.${CompanyDeclarationOfAssetsFields.CurrentActiveTotal}`,
    0,
  );
  const watchLastActiveNotCurrentTotal = watch(
    `${nameBase}.${CompanyLastYearDeclarationOfAssetsFields.LastDeclarationOfAssets}.${CompanyDeclarationOfAssetsFields.NonCurrentActiveTotal}`,
    0,
  );
  const watchLastPassiveCurrentTotal = watch(
    `${nameBase}.${CompanyLastYearDeclarationOfAssetsFields.LastDeclarationOfAssets}.${CompanyDeclarationOfAssetsFields.CurrentPassiveTotal}`,
    0,
  );
  const watchLastPassiveNotCurrentTotal = watch(
    `${nameBase}.${CompanyLastYearDeclarationOfAssetsFields.LastDeclarationOfAssets}.${CompanyDeclarationOfAssetsFields.NonCurrentPassiveTotal}`,
    0,
  );
  const watchPassiveTotal = watch(
    `${nameBase}.${CompanyDeclarationOfAssetsFields.PassiveTotal}`,
    0,
  );
  const watchActiveTotal = watch(
    `${nameBase}.${CompanyDeclarationOfAssetsFields.ActiveTotal}`,
    0,
  );
  const watchLastPassiveTotal = watch(
    `${nameBase}.${CompanyLastYearDeclarationOfAssetsFields.LastDeclarationOfAssets}.${CompanyDeclarationOfAssetsFields.PassiveTotal}`,
    0,
  );
  const watchLastActiveTotal = watch(
    `${nameBase}.${CompanyLastYearDeclarationOfAssetsFields.LastDeclarationOfAssets}.${CompanyDeclarationOfAssetsFields.ActiveTotal}`,
    0,
  );

  useEffect(() => {
    setValue(
      `${nameBase}.${CompanyDeclarationOfAssetsFields.ActiveTotal}`,
      parseFloat(watchActiveCurrentTotal || '0') +
        parseFloat(watchActiveNotCurrentTotal || '0'),
    );
  }, [watchActiveCurrentTotal, watchActiveNotCurrentTotal]);

  useEffect(() => {
    setValue(
      `${nameBase}.${CompanyLastYearDeclarationOfAssetsFields.LastDeclarationOfAssets}.${CompanyDeclarationOfAssetsFields.ActiveTotal}`,
      parseFloat(watchLastActiveCurrentTotal || '0') +
        parseFloat(watchLastActiveNotCurrentTotal || '0'),
    );
  }, [watchLastActiveCurrentTotal, watchLastActiveNotCurrentTotal]);

  useEffect(() => {
    setValue(
      `${nameBase}.${CompanyDeclarationOfAssetsFields.PassiveTotal}`,
      parseFloat(watchPassiveCurrentTotal || '0') +
        parseFloat(watchPassiveNotCurrentTotal || '0'),
    );
  }, [watchPassiveCurrentTotal, watchPassiveNotCurrentTotal]);

  useEffect(() => {
    setValue(
      `${nameBase}.${CompanyLastYearDeclarationOfAssetsFields.LastDeclarationOfAssets}.${CompanyDeclarationOfAssetsFields.PassiveTotal}`,
      parseFloat(watchLastPassiveCurrentTotal || '0') +
        parseFloat(watchLastPassiveNotCurrentTotal || '0'),
    );
  }, [watchLastPassiveCurrentTotal, watchLastPassiveNotCurrentTotal]);

  useEffect(() => {
    setValue(
      `${nameBase}.${CompanyDeclarationOfAssetsFields.NetPatrimonyTotal}`,
      parseFloat(watchActiveTotal || '0') -
        parseFloat(watchPassiveTotal || '0'),
    );
  }, [watchPassiveTotal, watchActiveTotal]);

  useEffect(() => {
    setValue(
      `${nameBase}.${CompanyLastYearDeclarationOfAssetsFields.LastDeclarationOfAssets}.${CompanyDeclarationOfAssetsFields.NetPatrimonyTotal}`,
      parseFloat(watchLastActiveTotal || '0') -
        parseFloat(watchLastPassiveTotal || '0'),
    );
  }, [watchLastActiveTotal, watchLastPassiveTotal]);

  // @ts-ignore
  const declarationOfAssetsTotals : CompanyDeclarationOfAssetsTotals[] = declarationOfAssets ? [
    { ...declarationOfAssets },
    { ...declarationOfAssets[CompanyLastYearDeclarationOfAssetsFields.LastDeclarationOfAssets] }
  ] : [];

  return (
      <EconomicFinancialTableWrapper title={''}
                                     expanded={expanded}
                                     expandable={expandable}
      >
        <CompanyFinancialDeclarationOfAssetsEditTotals totals={declarationOfAssetsTotals} nameBase={nameBase}/>
      </EconomicFinancialTableWrapper>
  );
};

export default CompanyDeclarationOfAssetsEditDetail;
