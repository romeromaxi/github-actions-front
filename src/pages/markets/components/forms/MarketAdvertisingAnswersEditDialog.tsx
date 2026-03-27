import {
  IntermediateDataView,
  MarketIntermadiateAnswersFields,
  MarketIntermediateAnswers,
} from '../../../../types/market/marketIntermediateData';
import BaseDialogTitle from '../../../../components/dialog/BaseDialogTitle';
import {Dialog, DialogActions, DialogContent, Stack, Typography,} from '@mui/material';
import MarketCompanyToggleButton from '../misc/MarketCompanyToggleButton';
import {EntityWithIdAndDescriptionFields, EntityWithIdFields} from '../../../../types/baseEntities';
import {Skeleton} from '@mui/lab';
import MarketDestinyToggleButton from '../misc/MarketDestinyToggleButton';
import {ControlledTextFieldFilled} from '../../../../components/forms';
import {SearchButton} from '../../../../components/buttons/Buttons';
import React, {useEffect, useState} from 'react';
import {CompanyTotalsShoppingCart, CompanyTotalsShoppingCartFields,} from '../../../../types/market/marketData';
import {HttpMarketShoppingCart} from '../../../../http/market/httpMarketShoppingCart';
import {HttpMarketIntermediate} from '../../../../http/market';
import {useForm} from 'react-hook-form';
import {marketAnswersStorage} from '../../../../util/sessionStorage/marketAnswersStorage';
import {useAction} from '../../../../hooks/useAction';
import {Disclaimer} from '../../../../components/text/Disclaimer';
import {HttpPersonNosis} from '../../../../http';
import {PersonCompanyConsultantResponseDTOFields} from '../../../../types/person/personNosisData';
import {ModuleCodes} from "../../../../types/general/generalEnums";

interface MarketAdvertisingAnswersEditDialogProps {
  open: boolean;
  onClose: () => void;
  answers: MarketIntermediateAnswers | null;
  onSearch: (data: MarketIntermediateAnswers) => void;
}

const MarketAdvertisingAnswersEditDialog = ({
  open,
  onClose,
  answers,
  onSearch,
}: MarketAdvertisingAnswersEditDialogProps) => {
  const [companies, setCompanies] = useState<CompanyTotalsShoppingCart[]>();
  const [selectedCompany, setSelectedCompany] = useState<number>(
    answers?.[MarketIntermadiateAnswersFields.CompanyId] ?? 0,
  );
  const [selectedCompanyName, setSelectedCompanyName] = useState<
    string | undefined
  >(
    answers?.[MarketIntermadiateAnswersFields.CompanyBusinessName] ?? undefined,
  );
  const [destinies, setDestinies] = useState<IntermediateDataView[]>();
  const [selectedDestiny, setSelectedDestiny] = useState<number>(
    answers?.[MarketIntermadiateAnswersFields.ProductDestinyCode] ?? 0,
  );
  const [selectedDestinyName, setSelectedDestinyName] = useState<
    string | undefined
  >(answers?.[MarketIntermadiateAnswersFields.ProductDestinyDesc] ?? undefined);
  const [disabledValue, setDisabledValue] = useState<boolean>(false);
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
        [MarketIntermadiateAnswersFields.BillingAmount]:
          answers?.[MarketIntermadiateAnswersFields.BillingAmount],
        [MarketIntermadiateAnswersFields.CompanyCUIT]:
          answers?.[MarketIntermadiateAnswersFields.CompanyCUIT],
      });
      setSelectedDestiny(
        answers?.[MarketIntermadiateAnswersFields.ProductDestinyCode] ?? 0,
      );
      setSelectedCompanyName(
        answers?.[MarketIntermadiateAnswersFields.CompanyBusinessName],
      );
      setSelectedCompany(
        answers?.[MarketIntermadiateAnswersFields.CompanyId] ?? 0,
      );
      setSelectedDestinyName(
        answers?.[MarketIntermadiateAnswersFields.ProductDestinyDesc],
      );
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
      if (answers?.[MarketIntermadiateAnswersFields.CompanyCUIT]) {
        if (
          data[MarketIntermadiateAnswersFields.CompanyCUIT] !==
          answers?.[MarketIntermadiateAnswersFields.CompanyCUIT]
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
                  r[
                    PersonCompanyConsultantResponseDTOFields.CompanyBusinessName
                  ],
              };

              marketAnswersStorage.saveMarketIntermediateAnswers(submitData);
              onSearch(submitData);
              onClose();
            })
            .catch((e) => snackbarError(e))
            .finally(() => hideLoader());
        } else {
          submitData = {
            ...submitData,
            [MarketIntermadiateAnswersFields.CompanyId]:
              answers?.[MarketIntermadiateAnswersFields.CompanyId] ?? 0,
            [MarketIntermadiateAnswersFields.CompanyBusinessName]:
              answers?.[MarketIntermadiateAnswersFields.CompanyBusinessName],
          };

          marketAnswersStorage.saveMarketIntermediateAnswers(submitData);
          onSearch(submitData);
          onClose();
        }
      } else {
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
            onSearch(submitData);
            onClose();
          })
          .catch((e) => snackbarError(e))
          .finally(() => hideLoader());
      }
    }

    marketAnswersStorage.saveMarketIntermediateAnswers(submitData);
    onSearch(submitData);
    onClose();
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

export default MarketAdvertisingAnswersEditDialog;
