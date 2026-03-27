import { useFormContext } from 'react-hook-form';
import { CompanyAffidavitFields } from '../../../../types/company/companyFinanceInformationData';
import React, { useEffect } from 'react';
import CompanyAffidavitEditCountryTable from './CompanyAffidavitEditCountryTable';
import { Stack } from '@mui/material';
import CompanyAffidavitEditExteriorTable from './CompanyAffidavitEditExteriorTable';

interface CompanyAffidavitEditCountryAssetsProps {
  nameBase: string;
}

const CompanyAffidavitEditTable = ({
  nameBase,
}: CompanyAffidavitEditCountryAssetsProps) => {
  const { setValue, watch } = useFormContext();

  const watchAircraft = watch(
    `${nameBase}.${CompanyAffidavitFields.CountryAssets_Aircraft}`,
  );
  const watchCars = watch(
    `${nameBase}.${CompanyAffidavitFields.CountryAssets_Cars}`,
  );
  const watchBuildings = watch(
    `${nameBase}.${CompanyAffidavitFields.CountryAssets_Buildings}`,
  );
  const watchCash = watch(
    `${nameBase}.${CompanyAffidavitFields.CountryAssets_Cash}`,
  );
  const watchCredits = watch(
    `${nameBase}.${CompanyAffidavitFields.CountryAssets_Credits}`,
  );
  const watchHousehold = watch(
    `${nameBase}.${CompanyAffidavitFields.CountryAssets_HouseholdAssets}`,
  );
  const watchDeposits = watch(
    `${nameBase}.${CompanyAffidavitFields.CountryAssets_MoneyDeposits}`,
  );
  const watchMovable = watch(
    `${nameBase}.${CompanyAffidavitFields.CountryAssets_MovableAssetsRegistered}`,
  );
  const watchPatrimonyUnipersonal = watch(
    `${nameBase}.${CompanyAffidavitFields.CountryAssets_PatrimonyCompanyUnipersonalExploitation}`,
  );
  const watchDegrees = watch(
    `${nameBase}.${CompanyAffidavitFields.CountryAssets_PublicPrivateDegrees}`,
  );
  const watchShares = watch(
    `${nameBase}.${CompanyAffidavitFields.CountryAssets_Shares}`,
  );
  const watchVessels = watch(
    `${nameBase}.${CompanyAffidavitFields.CountryAssets_Vessels}`,
  );
  const watchRealRights = watch(
    `${nameBase}.${CompanyAffidavitFields.CountryAssets_RealRights}`,
  );
  const watchOthers = watch(
    `${nameBase}.${CompanyAffidavitFields.CountryAssets_OtherAssets}`,
  );
  const watchExteriorBuildings = watch(
    `${nameBase}.${CompanyAffidavitFields.ExteriorAssets_Buildings}`,
  );
  const watchExteriorCars = watch(
    `${nameBase}.${CompanyAffidavitFields.ExteriorAssets_Cars}`,
  );
  const watchExteriorCredits = watch(
    `${nameBase}.${CompanyAffidavitFields.ExteriorAssets_Credits}`,
  );
  const watchExteriorDegree = watch(
    `${nameBase}.${CompanyAffidavitFields.ExteriorAssets_Degree}`,
  );
  const watchExteriorDeposits = watch(
    `${nameBase}.${CompanyAffidavitFields.ExteriorAssets_MoneyDeposits}`,
  );
  const watchExteriorRealRights = watch(
    `${nameBase}.${CompanyAffidavitFields.ExteriorAssets_RealRights}`,
  );
  const watchExteriorRoving = watch(
    `${nameBase}.${CompanyAffidavitFields.ExteriorAssets_MovableAssetsRoving}`,
  );
  const watchExteriorOthers = watch(
    `${nameBase}.${CompanyAffidavitFields.ExteriorAssets_OtherAssets}`,
  );

  const updateExteriorTotal = () => {
    const newTotal: number =
      parseFloat(watchExteriorBuildings || '0') +
      parseFloat(watchExteriorCars || '0') +
      parseFloat(watchExteriorCredits || '0') +
      parseFloat(watchExteriorRoving || '0') +
      parseFloat(watchExteriorOthers || '0') +
      parseFloat(watchExteriorRealRights || '0') +
      parseFloat(watchExteriorDegree || '0') +
      parseFloat(watchExteriorDeposits || '0');

    setValue(
      `${nameBase}.${CompanyAffidavitFields.ExteriorAssets_Total}`,
      newTotal,
    );
  };
  useEffect(() => {
    updateExteriorTotal();
  }, [
    watchExteriorBuildings,
    watchExteriorCars,
    watchExteriorCredits,
    watchExteriorDegree,
    watchExteriorDeposits,
    watchExteriorRealRights,
    watchExteriorRoving,
    watchExteriorOthers,
  ]);

  const updateCountryTotal = () => {
    const newTotal: number =
      parseFloat(watchBuildings || '0') +
      parseFloat(watchCars || '0') +
      parseFloat(watchAircraft || '0') +
      parseFloat(watchRealRights || '0') +
      parseFloat(watchCash || '0') +
      parseFloat(watchOthers || '0') +
      parseFloat(watchHousehold || '0') +
      parseFloat(watchCredits || '0') +
      parseFloat(watchDegrees || '0') +
      parseFloat(watchDeposits || '0') +
      parseFloat(watchMovable || '0') +
      parseFloat(watchPatrimonyUnipersonal || '0') +
      parseFloat(watchShares || '0') +
      parseFloat(watchVessels || '0');

    setValue(
      `${nameBase}.${CompanyAffidavitFields.CountryAssets_Total}`,
      newTotal,
    );
  };

  useEffect(() => {
    updateCountryTotal();
  }, [
    watchBuildings,
    watchCars,
    watchCredits,
    watchAircraft,
    watchDeposits,
    watchRealRights,
    watchCash,
    watchOthers,
    watchHousehold,
    watchDegrees,
    watchShares,
    watchPatrimonyUnipersonal,
    watchVessels,
    watchMovable,
  ]);

  return (
    <Stack spacing={4}>
      <CompanyAffidavitEditCountryTable nameBase={nameBase} />
      <CompanyAffidavitEditExteriorTable nameBase={nameBase} />
    </Stack>
  );
};

export default CompanyAffidavitEditTable;
