import React, { useCallback, useEffect, useState } from 'react';
import * as yup from 'yup';
import {
  CompanyApprovalFormFields,
  CompanyKeyData,
  CompanyKeyDataFields,
  CompanyUnconfirmedRegisterData,
  CompanyUnconfirmedRegisterDataFields,
  CompanyViewDTOFields,
} from 'types/company/companyData';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import useAxios from 'hooks/useAxios';
import {
  HttpCacheCompany,
  HttpCompany
} from 'http/index';
import {Box, Checkbox, Grid, Link, Stack, Typography} from '@mui/material';
import NewCompanyDrawerStyles from '../../../company/newCompany/NewCompanyDrawer.styles';
import { Disclaimer } from 'components/text/Disclaimer';
import { AsyncSelect, ControlledTextFieldFilled } from 'components/forms';
import { stringFormatter } from 'util/formatters/stringFormatter';
import { PersonTypes, ValidationStatesType } from 'types/person/personEnums';
import { CompanyPersonBondTypes } from '../../../../types/company/companyPersonReferentialData';
import { Alert } from '@mui/lab';
import {CompanyUserBondTypes} from "types/company/companyEnums";
import NewCompanyValidationErrorForm from "../../../company/newCompany/NewCompanyValidationErrorForm";
import { WrapperIcons } from '../../../../components/icons/Icons';
import { UserRoundIcon } from 'lucide-react';
import {TypographyBase} from "../../../../components/misc/TypographyBase";
import {useSnackbarActions} from "../../../../hooks/useSnackbarActions";
import {useLoaderActions} from "../../../../hooks/useLoaderActions";

interface FromMarketNewCompanyFormProps {
  onSubmitted: (responsible: boolean, validated: boolean) => void;
  samePerson: boolean;
  companyKeyData: CompanyKeyData;
  handleWithoutForm: () => void
}

export interface NewCompanyBaseForm {
  [CompanyViewDTOFields.MonthClosing]: string;
  [CompanyUnconfirmedRegisterDataFields.CompanyUserBondCode]: number;
  [CompanyViewDTOFields.CUIT]: string;
  [CompanyUnconfirmedRegisterDataFields.ResponsibleGuestMail]: string;
  [CompanyApprovalFormFields.FileAble]: File;
}

const FromMarketNewCompanyForm = ({
  onSubmitted,
  samePerson,
  companyKeyData,
  handleWithoutForm
}: FromMarketNewCompanyFormProps) => {
  const {
    [CompanyKeyDataFields.CompanyId]: companyId,
    [CompanyKeyDataFields.BusinessName]: companyName,
    [CompanyKeyDataFields.CUIT]: companyCuit,
    [CompanyKeyDataFields.PersonId]: companyPersonId,
    [CompanyKeyDataFields.PersonTypeCode]: personTypeCode,
    [CompanyKeyDataFields.ValidationStateCode]: validationStateCode,
    [CompanyKeyDataFields.IsOwnExistingCompany]: isOwnExistingCompany
  } = companyKeyData;
  const [checkedResponsible, setCheckedResponsible] = useState<boolean>(false);
  const [showContactForm, setShowContactForm] = useState<boolean>(false);
  const [errorDisclaimer, setErrorDisclaimer] = useState<boolean>(false);
  const alreadyCreated =
    validationStateCode === ValidationStatesType.CreatedWithoutConfirmation;
  const classes = NewCompanyDrawerStyles();
  const isPhysicalPerson = personTypeCode === PersonTypes.Physical
  
  const companySchema = yup
    .object()
      .test(
          CompanyUnconfirmedRegisterDataFields.CompanyUserBondCode, 'Campo Obligatorio', (obj) => {
            if (samePerson || obj[CompanyUnconfirmedRegisterDataFields.CompanyUserBondCode]) return true;

            return new yup.ValidationError(
                'Campo Obligatorio',
                null,
                CompanyUnconfirmedRegisterDataFields.CompanyUserBondCode,
            );
          }
      )
    .test(CompanyViewDTOFields.MonthClosing, 'Campo Obligatorio', (obj) => {
      if (!obj || isPhysicalPerson) return true;
      
      const monthParsed = parseInt(obj[CompanyViewDTOFields.MonthClosing]);

      if (monthParsed) {
          if (monthParsed >= 1 && monthParsed <= 12)
              return true;

          return new yup.ValidationError(
              'Dato inválido. Debe ser un número entre 1 y 12.',
              null,
              CompanyViewDTOFields.MonthClosing,
          );
      }

      return new yup.ValidationError(
        'Campo Obligatorio',
        null,
        CompanyViewDTOFields.MonthClosing,
      );
    })

  const { fetchData } = useAxios();
  const { showLoader, hideLoader } = useLoaderActions();
  const { addSnackbarWarning } = useSnackbarActions();

  const { control, handleSubmit, watch } =
    useForm<NewCompanyBaseForm>({
      resolver: yupResolver(companySchema),
      defaultValues: {
        [CompanyUnconfirmedRegisterDataFields.CompanyUserBondCode]: 0
      }
    });
  const watchBondCode = watch(
    CompanyUnconfirmedRegisterDataFields.CompanyUserBondCode,
  );
  
  const onSubmit = (data: NewCompanyBaseForm) => {
    if (checkedResponsible || samePerson) {
        let companyData: CompanyUnconfirmedRegisterData = {
          [CompanyUnconfirmedRegisterDataFields.CompanyUserBondCode]:
              samePerson ?
                  CompanyUserBondTypes.Responsible : data[CompanyUnconfirmedRegisterDataFields.CompanyUserBondCode] ?? undefined,
          [CompanyViewDTOFields.MonthClosing]:
            data[CompanyViewDTOFields.MonthClosing] || '12',
          [CompanyViewDTOFields.DayClosing]: '1'
        };
        const alreadyValidated = samePerson && isPhysicalPerson
        if (
          data[CompanyUnconfirmedRegisterDataFields.CompanyUserBondCode] !==
            CompanyPersonBondTypes.Responsible &&
          alreadyCreated
        ) {
            if (samePerson) {
              fetchData(
                  () => HttpCompany.changeResponsible(companyId),
                  true
              ).then(() => {
                  onSubmitted(true, alreadyValidated);
              })
            } else {
                setErrorDisclaimer(true);
                handleWithoutForm()
            }
        } else {
          if (
            data[CompanyUnconfirmedRegisterDataFields.CompanyUserBondCode] !== CompanyPersonBondTypes.Responsible
          ) {
            showLoader();
            if (isPhysicalPerson) {
              companyData = {
                ...companyData,
                [CompanyUnconfirmedRegisterDataFields.ResponsibleGuestPersonId]: companyPersonId,
              };
  
              fetchData(() => HttpCompany.partialInsertNewCompany(companyId, companyData), false).then(() => {
                hideLoader();
                onSubmitted(false, alreadyValidated);
              });
            } else {
                fetchData(() => HttpCompany.partialInsertNewCompany(companyId, companyData), false).then(() => {
                  hideLoader();
                  onSubmitted(false, alreadyValidated);
                });
            }
          } else {
            fetchData(
                () => HttpCompany.partialInsertNewCompany(companyId, companyData),
                true
            ).then(() => {
              onSubmitted(true, alreadyValidated);
            })
          }
        }
    } else {
        addSnackbarWarning("Para agregar la empresa primero debés indicar que podés actuar en su represantación");
    }
  };

  const loadBondOptions = useCallback(() => {
    if (!personTypeCode) return undefined;

    return personTypeCode === PersonTypes.Legal
      ? HttpCacheCompany.getBondsForLegalPerson(false)
      : HttpCacheCompany.getBondsForPhysicalPerson(false);
  }, [personTypeCode]);

  useEffect(() => {
    setCheckedResponsible(false);
  }, []);

  const onShowContactForm = () => {
    setShowContactForm(true)
    setErrorDisclaimer(false)
  }
  
  return errorDisclaimer ? (
    <Stack spacing={2}>
      <Stack flexWrap={'wrap'} gap={1} direction={'row'} alignItems={'center'} justifyContent={'center'}>
        <Disclaimer text={'La cuenta MiPyME'} />
        <Typography className={classes.companyName}>{companyName}</Typography>
        <Typography className={classes.companyCuit}>
          CUIT {stringFormatter.formatCuit(companyCuit)}
        </Typography>
        <Disclaimer text={'ya existe en LUC.'} />
      </Stack>
      <Disclaimer text={'Contactá al responsable para que te invite a ser parte.'} />
        
      <Typography variant={'subtitle2'} color={'text.disabled'} fontWeight={500} component="span">
          Si no conocés a quien dio de alta esta cuenta MiPyME o crees que puede haber algún error, <Link underline={'none'} onClick={onShowContactForm}> contactate con el equipo de LUC</Link>
      </Typography>
    </Stack>
  ) :
      showContactForm ?
          (
              <Stack spacing={1}>
                <Alert severity={'info'}>Completa el siguiente formulario para contactarnos con vos</Alert>
                <NewCompanyValidationErrorForm onBack={() => {
                  setShowContactForm(false)
                  setErrorDisclaimer(true)
                }}
                                               afterSubmit={() => {
                                                 setShowContactForm(false)
                                                 setErrorDisclaimer(true)
                                               }}
                />
              </Stack>
          )
          :
    (
    <form onSubmit={handleSubmit(onSubmit)} id={"new-company-data-form"}>
      {companyName && (
        <Grid item xs={12}>
            <Stack direction="row" alignItems="center" spacing={2}>
                {
                    isPhysicalPerson ?
                    <Box sx={{backgroundColor: '#E1F3D6', width: '56px', height: '56px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                        <WrapperIcons Icon={UserRoundIcon} size={'lg'} color={'#5A9437'}/>
                    </Box>
                        :
                        <Box component="img" src={'/images/homeCompanies/company-logo-default-legal.svg'} />
                }
                <Stack>
                  <Typography variant="h4" color="primary" fontWeight={600}>{companyName}</Typography>
                  <Typography variant="body2" color="text.tertiary" fontFamily={'Poppins'}>
                    {`CUIT N°: ${stringFormatter.formatCuit(companyCuit)}`}
                  </Typography>
                </Stack>
            </Stack>
        </Grid>
      )}
      {samePerson ? (
                  <Grid item xs={12} container spacing={2} alignItems={'center'} mt={1}>
                    <Grid item xs={12}>
                      {isOwnExistingCompany ? (
                          <Disclaimer
                              text={`Identificamos que sos el responsable del CUIT ${stringFormatter.formatCuit(companyCuit)} y que la cuenta MiPyME ya fue creada por otro usuario. ¿Deseás reclamar la empresa? Si elegís afirmativamente y querés que quien creó la cuenta siga utilizándola, deberás restituirle el permiso desde "Gestión de Usuario"`}
                          />
                      ) : (
                          <Disclaimer text="¿Son correctos los datos para crear la cuenta?" />
                      )}
                    </Grid>
                  </Grid>
              ) : (
                  <Grid item xs={12} container spacing={2} alignItems={'center'} mt={1}>
                    <Grid item xs={12}>
                      <AsyncSelect
                          loadOptions={loadBondOptions}
                          control={control}
                          name={CompanyUnconfirmedRegisterDataFields.CompanyUserBondCode}
                          select
                          fullWidth
                          label={'¿Qué vinculo tenés con esta PyME?'}
                      />
                    </Grid>

                    {personTypeCode === PersonTypes.Legal && (
                        <Grid item xs={12}>
                          <ControlledTextFieldFilled
                              control={control}
                              placeholder="mm"
                              label="Mes de cierre de balance"
                              name={CompanyViewDTOFields.MonthClosing}
                              type={'number'}
                          />
                        </Grid>
                    )}
                    <Grid item xs={12}>
                      {!!watchBondCode && (
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Checkbox
                                checked={checkedResponsible}
                                onChange={() => {
                                  setCheckedResponsible(!checkedResponsible)
                                }}
                            />
                            <TypographyBase variant={'body3'}>
                              Declaro que tengo autorización para actuar en representación de la MiPyME
                            </TypographyBase>
                          </Stack>
                      )}
                    </Grid>
                  </Grid>
      )
                  }
    </form>
  );
};

export default FromMarketNewCompanyForm;
