import { useFormContext } from 'react-hook-form';
import { CompanyAffidavitFields } from '../../../../types/company/companyFinanceInformationData';
import React, { useEffect } from 'react';
import { Divider, Grid, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';
import { ControlledTextFieldFilled } from '../../../../components/forms';

interface CompanyAffidavitEditExteriorAssetsProps {
  nameBase: string;
}

const CompanyAffidavitEditExteriorAssets = ({
  nameBase,
}: CompanyAffidavitEditExteriorAssetsProps) => {
  const { control, setValue, watch } = useFormContext();

  const watchBuildings = watch(
    `${nameBase}.${CompanyAffidavitFields.ExteriorAssets_Buildings}`,
  );
  const watchCars = watch(
    `${nameBase}.${CompanyAffidavitFields.ExteriorAssets_Cars}`,
  );
  const watchCredits = watch(
    `${nameBase}.${CompanyAffidavitFields.ExteriorAssets_Credits}`,
  );
  const watchDegree = watch(
    `${nameBase}.${CompanyAffidavitFields.ExteriorAssets_Degree}`,
  );
  const watchDeposits = watch(
    `${nameBase}.${CompanyAffidavitFields.ExteriorAssets_MoneyDeposits}`,
  );
  const watchRealRights = watch(
    `${nameBase}.${CompanyAffidavitFields.ExteriorAssets_RealRights}`,
  );
  const watchRoving = watch(
    `${nameBase}.${CompanyAffidavitFields.ExteriorAssets_MovableAssetsRoving}`,
  );
  const watchOthers = watch(
    `${nameBase}.${CompanyAffidavitFields.ExteriorAssets_OtherAssets}`,
  );

  const updateExteriorTotal = () => {
    const newTotal: number =
      parseFloat(watchBuildings || '0') +
      parseFloat(watchCars || '0') +
      parseFloat(watchRealRights || '0') +
      parseFloat(watchRoving || '0') +
      parseFloat(watchOthers || '0') +
      parseFloat(watchCredits || '0') +
      parseFloat(watchDegree || '0') +
      parseFloat(watchDeposits || '0');

    setValue(
      `${nameBase}.${CompanyAffidavitFields.ExteriorAssets_Total}`,
      newTotal,
    );
  };

  const handleFocus = (e: any) => e.target.select();

  useEffect(() => {
    updateExteriorTotal();
  }, [
    watchBuildings,
    watchCars,
    watchCredits,
    watchDegree,
    watchDeposits,
    watchRealRights,
    watchRoving,
    watchOthers,
  ]);

  return (
    <Grid container spacing={1} mt={2}>
      <Grid item xs={12} container alignItems={'center'} mb={1}>
        <Grid item xs={6}>
          <Typography color={grey[600]} fontSize={18}>
            Bienes
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography color={grey[600]} fontSize={18} textAlign={'center'}>
            Monto
          </Typography>
        </Grid>
        <Grid item xs={2}></Grid>
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>
      <Grid item xs={12} container alignItems={'center'} spacing={2}>
        <Grid item xs={6}>
          <Typography color={grey[600]} fontSize={14}>
            Inmuebles
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <ControlledTextFieldFilled
            label=""
            control={control}
            name={`${nameBase}.${CompanyAffidavitFields.ExteriorAssets_Buildings}`}
            currency
            onFocus={handleFocus}
            textAlign={'right'}
          />
        </Grid>
        <Grid item xs={2}></Grid>
      </Grid>
      <Grid item xs={12} container alignItems={'center'} spacing={2}>
        <Grid item xs={6}>
          <Typography color={grey[600]} fontSize={14}>
            Derechos Reales
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <ControlledTextFieldFilled
            label=""
            control={control}
            name={`${nameBase}.${CompanyAffidavitFields.ExteriorAssets_RealRights}`}
            currency
            onFocus={handleFocus}
            textAlign={'right'}
          />
        </Grid>
        <Grid item xs={2}></Grid>
      </Grid>
      <Grid item xs={12} container alignItems={'center'} spacing={2}>
        <Grid item xs={6}>
          <Typography color={grey[600]} fontSize={14}>
            Automotores
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <ControlledTextFieldFilled
            label=""
            control={control}
            name={`${nameBase}.${CompanyAffidavitFields.ExteriorAssets_Cars}`}
            currency
            onFocus={handleFocus}
            textAlign={'right'}
          />
        </Grid>
        <Grid item xs={2}></Grid>
      </Grid>
      <Grid item xs={12} container alignItems={'center'} spacing={2}>
        <Grid item xs={6}>
          <Typography color={grey[600]} fontSize={14}>
            Creditos
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <ControlledTextFieldFilled
            label=""
            control={control}
            name={`${nameBase}.${CompanyAffidavitFields.ExteriorAssets_Credits}`}
            currency
            onFocus={handleFocus}
            textAlign={'right'}
          />
        </Grid>
        <Grid item xs={2}></Grid>
      </Grid>
      <Grid item xs={12} container alignItems={'center'} spacing={2}>
        <Grid item xs={6}>
          <Typography color={grey[600]} fontSize={14}>
            Depositos en Dinero
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <ControlledTextFieldFilled
            label=""
            control={control}
            name={`${nameBase}.${CompanyAffidavitFields.ExteriorAssets_MoneyDeposits}`}
            currency
            onFocus={handleFocus}
            textAlign={'right'}
          />
        </Grid>
        <Grid item xs={2}></Grid>
      </Grid>
      <Grid item xs={12} container alignItems={'center'} spacing={2}>
        <Grid item xs={6}>
          <Typography color={grey[600]} fontSize={14}>
            Muebles Semovientes
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <ControlledTextFieldFilled
            label=""
            control={control}
            name={`${nameBase}.${CompanyAffidavitFields.ExteriorAssets_MovableAssetsRoving}`}
            currency
            onFocus={handleFocus}
            textAlign={'right'}
          />
        </Grid>
        <Grid item xs={2}></Grid>
      </Grid>
      <Grid item xs={12} container alignItems={'center'} spacing={2}>
        <Grid item xs={6}>
          <Typography color={grey[600]} fontSize={14}>
            Titulos
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <ControlledTextFieldFilled
            label=""
            control={control}
            name={`${nameBase}.${CompanyAffidavitFields.ExteriorAssets_Degree}`}
            currency
            onFocus={handleFocus}
            textAlign={'right'}
          />
        </Grid>
        <Grid item xs={2}></Grid>
      </Grid>
      <Grid item xs={12} container alignItems={'center'} spacing={2}>
        <Grid item xs={6}>
          <Typography color={grey[600]} fontSize={14}>
            Otros
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <ControlledTextFieldFilled
            label=""
            control={control}
            name={`${nameBase}.${CompanyAffidavitFields.ExteriorAssets_OtherAssets}`}
            currency
            onFocus={handleFocus}
            textAlign={'right'}
          />
        </Grid>
        <Grid item xs={2}></Grid>
      </Grid>
      <Grid container spacing={2} alignItems={'center'}>
        <Grid item xs={12}>
          <Divider sx={{ borderStyle: 'dashed', mt: 2 }} />
        </Grid>
        <Grid item xs={6}>
          <Typography color={grey[600]} fontSize={20} fontWeight={600}>
            Total
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <ControlledTextFieldFilled
            label=""
            control={control}
            name={`${nameBase}.${CompanyAffidavitFields.ExteriorAssets_Total}`}
            currency
            disabled={true}
            textAlign={'right'}
          />
        </Grid>
        <Grid item xs={2}></Grid>
      </Grid>
    </Grid>
  );
};

export default CompanyAffidavitEditExteriorAssets;
