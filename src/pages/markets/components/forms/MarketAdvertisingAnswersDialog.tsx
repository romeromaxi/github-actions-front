import BaseDialogTitle from '../../../../components/dialog/BaseDialogTitle';
import {Dialog, DialogActions, DialogContent, Stack, Typography,} from '@mui/material';
import {SearchButton} from '../../../../components/buttons/Buttons';
import React, {useEffect, useState} from 'react';
import {CompanyTotalsShoppingCart, CompanyTotalsShoppingCartFields,} from '../../../../types/market/marketData';
import {HttpMarketShoppingCart} from '../../../../http/market/httpMarketShoppingCart';
import {Skeleton} from '@mui/lab';
import {EntityWithIdAndDescriptionFields, EntityWithIdFields} from '../../../../types/baseEntities';
import MarketCompanyToggleButton from '../misc/MarketCompanyToggleButton';
import {useForm} from 'react-hook-form';
import {ControlledTextFieldFilled} from '../../../../components/forms';
import {HttpMarketIntermediate} from '../../../../http/market';
import {
  IntermediateDataView,
  MarketIntermadiateAnswersFields,
  MarketIntermediateAnswers,
} from '../../../../types/market/marketIntermediateData';
import MarketDestinyToggleButton from '../misc/MarketDestinyToggleButton';
import {marketAnswersStorage} from '../../../../util/sessionStorage/marketAnswersStorage';
import {Disclaimer} from '../../../../components/text/Disclaimer';
import {HttpPersonNosis} from '../../../../http';
import {useAction} from '../../../../hooks/useAction';
import {PersonCompanyConsultantResponseDTOFields} from '../../../../types/person/personNosisData';
import {ModuleCodes} from "../../../../types/general/generalEnums";

interface MarketAdvertisingAnswersDialogProps {
  open: boolean;
  onClose: () => void;
  onSearch: () => void;
}

const MarketAdvertisingAnswersDialog = ({
  open,
  onClose,
  onSearch,
}: MarketAdvertisingAnswersDialogProps) => {
  const [companies, setCompanies] = useState<CompanyTotalsShoppingCart[]>();
  const [selectedCompany, setSelectedCompany] = useState<number>(0);
  const [selectedCompanyName, setSelectedCompanyName] = useState<string>();
  const [destinies, setDestinies] = useState<IntermediateDataView[]>();
  const [selectedDestiny, setSelectedDestiny] = useState<number>(0);
  const [selectedDestinyName, setSelectedDestinyName] = useState<string>();
  const [disabledValue, setDisabledValue] = useState<boolean>(true);
  const { showLoader, hideLoader, snackbarError } = useAction();

  const loadAll = () => {
    Promise.all([
      HttpMarketShoppingCart.getCompanyTotalsByUser(),
      HttpMarketIntermediate.getIntermediateDestinies(),
    ]).then((r) => {
      setCompanies(
        r[0].filter((c) => c[CompanyTotalsShoppingCartFields.HasPermissions]),
      );
      setDestinies(r[1]);
    });
  };

  useEffect(() => {
    if (open) {
      loadAll();
      methods.reset({
        [MarketIntermadiateAnswersFields.BillingAmount]: undefined,
        [MarketIntermadiateAnswersFields.CompanyCUIT]: undefined,
      });
      setSelectedDestiny(0);
      setSelectedCompanyName(undefined);
      setSelectedCompany(0);
      setSelectedDestinyName(undefined);
    }
  }, [open]);

  const onClickCompany = (company: CompanyTotalsShoppingCart) => {
    if (selectedCompany === company[EntityWithIdFields.Id]) {
      setSelectedCompany(0);
      setSelectedCompanyName(undefined);
    } else {
      setSelectedCompany(company[EntityWithIdFields.Id]);
      methods.setValue(MarketIntermadiateAnswersFields.CompanyCUIT, '');
      setSelectedCompanyName(
        company[CompanyTotalsShoppingCartFields.BusinessName],
      );
    }
  };

  const onClickDestiny = (destiny: IntermediateDataView, sel: boolean) => {
    if (
      selectedDestiny === destiny[EntityWithIdFields.Id]
    ) {
      setSelectedDestiny(0);
      setSelectedDestinyName(undefined);
    } else {
      setSelectedDestiny(destiny[EntityWithIdFields.Id]);
      setSelectedDestinyName(
        destiny[EntityWithIdAndDescriptionFields.Description],
      );
    }
  };

  const methods = useForm<MarketIntermediateAnswers>();

  const handleFocus = (e: any) => e.target.select();

  const onSubmit = (data: MarketIntermediateAnswers) => {
    let submitData = {
      ...data,
      [MarketIntermadiateAnswersFields.CompanyId]: selectedCompany,
      [MarketIntermadiateAnswersFields.ProductDestinyCode]: selectedDestiny,
      [MarketIntermadiateAnswersFields.ProductDestinyDesc]: selectedDestinyName,
      [MarketIntermadiateAnswersFields.CompanyBusinessName]:
        selectedCompanyName,
    };

    if (
      data[MarketIntermadiateAnswersFields.CompanyCUIT] &&
      data[MarketIntermadiateAnswersFields.CompanyCUIT] !== ''
    ) {
      showLoader();
      // @ts-ignore
      HttpPersonNosis.synchronizeCompany(
        data[MarketIntermadiateAnswersFields.CompanyCUIT],
        '',
          ModuleCodes.CompanyRegistration,
      )
        .then((r) => {
          submitData = {
            ...submitData,
            [MarketIntermadiateAnswersFields.CompanyId]:
              r[PersonCompanyConsultantResponseDTOFields.CompanyId],
            [MarketIntermadiateAnswersFields.CompanyBusinessName]:
              r[PersonCompanyConsultantResponseDTOFields.CompanyBusinessName],
          };

          marketAnswersStorage.saveMarketIntermediateAnswers(submitData);
          onClose();
          onSearch();
        })
        .catch((e) => snackbarError(e))
        .finally(() => hideLoader());
    } else {
      marketAnswersStorage.saveMarketIntermediateAnswers(submitData);
      onClose();
      onSearch();
    }
  };

  const watchAmount = methods.watch(
    MarketIntermadiateAnswersFields.BillingAmount,
  );
  const watchCuit = methods.watch(MarketIntermadiateAnswersFields.CompanyCUIT);

  useEffect(() => {
    if (
      (selectedCompany !== 0 || watchCuit) &&
      selectedDestiny !== 0 &&
      watchAmount
    )
      setDisabledValue(false);
    else setDisabledValue(true);
  }, [selectedCompany, selectedDestiny, watchAmount, watchCuit]);

  useEffect(() => {
    if (watchCuit) setSelectedCompany(0);
  }, [watchCuit]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth={'lg'} fullWidth>
      <BaseDialogTitle
        onClose={onClose}
        title={'¡Buscá por tus preferencias!'}
      />
      <DialogContent>
        <Stack spacing={4}>
          <Stack spacing={3}>
            <Typography fontSize={18} fontWeight={600} textAlign={'center'}>
              ¿Para qué empresa estás buscando?
            </Typography>
            <Stack spacing={1}>
              <Stack direction="row" flexWrap={'wrap'} gap={2}>
                {companies ? (
                  companies.map((comp) => (
                    <MarketCompanyToggleButton
                      key={`empresaListaFiltro_${comp[EntityWithIdFields.Id]}`}
                      onSelect={onClickCompany}
                      company={comp}
                      disabled={
                        selectedCompany !== 0 &&
                        selectedCompany !== comp[EntityWithIdFields.Id]
                      }
                      selected={selectedCompany === comp[EntityWithIdFields.Id]}
                    />
                  ))
                ) : (
                  <Stack width={1}>
                    {Array.from({ length: 3 }).map((d, k) => (
                      <Skeleton key={k} />
                    ))}
                  </Stack>
                )}
              </Stack>
              <Disclaimer text={'O puedes ingresar su CUIT'} />
              <ControlledTextFieldFilled
                control={methods.control}
                name={MarketIntermadiateAnswersFields.CompanyCUIT}
                sx={{ alignItems: 'center' }}
                inputSx={{ backgroundColor: '#F5F8FA' }}
              />
            </Stack>
          </Stack>
          <Stack spacing={3} alignItems={'center'} textAlign={'center'}>
            <Typography fontSize={18} fontWeight={600} textAlign={'center'}>
              ¿Cuál es el destino?
            </Typography>
            <Stack direction="row" flexWrap={'wrap'} gap={2}>
              {destinies ? (
                destinies.map((dest) => (
                  <MarketDestinyToggleButton
                    key={`empresaListaFiltro_${dest[EntityWithIdFields.Id]}`}
                    onSelect={onClickDestiny}
                    destiny={dest}
                    disabled={
                      selectedDestiny !== 0 &&
                      selectedDestiny !==
                        dest[EntityWithIdFields.Id]
                    }
                    selected={
                      selectedDestiny ===
                      dest[EntityWithIdFields.Id]
                    }
                  />
                ))
              ) : (
                <Stack width={'600px'} height={'70px'}>
                  <Skeleton />
                </Stack>
              )}
            </Stack>
          </Stack>
          <Stack spacing={3}>
            <Typography fontSize={18} fontWeight={600} textAlign={'center'}>
              ¿Cuál es el monto deseado?
            </Typography>
            <ControlledTextFieldFilled
              label=""
              control={methods.control}
              name={MarketIntermadiateAnswersFields.BillingAmount}
              currency
              currencyPrefix={'$'}
              textAlign={'right'}
              onFocus={handleFocus}
              sx={{ alignItems: 'center' }}
              inputSx={{ backgroundColor: '#F5F8FA' }}
            />
          </Stack>
        </Stack>
      </DialogContent>
      <DialogActions>
        <SearchButton
          onClick={methods.handleSubmit(onSubmit)}
          disabled={disabledValue}
        >
          Buscar líneas
        </SearchButton>
      </DialogActions>
    </Dialog>
  );
};

export default MarketAdvertisingAnswersDialog;
