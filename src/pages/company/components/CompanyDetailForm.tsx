import React, { useContext, useEffect } from 'react';
import { FormProvider, useFormContext } from 'react-hook-form';

import {Chip, Divider, Grid, Stack, Tooltip} from '@mui/material';
import {
  AsyncSelect,
  ControlledRadioYesNo,
  ControlledTextFieldFilled,
} from 'components/forms/index';

import { AddressTypes } from 'types/general/generalEnums';
import AddressFormBoxListManager from './addresses/AddressFormBoxListManager';
import {
  HttpCacheCompany,
  HttpCacheGeneral,
  HttpCachePerson,
} from '../../../http';
import {
  CompanyDetailFormFields,
  CompanyFields,
  CompanyViewDTOFields,
} from '../../../types/company/companyData';
import { ControlledDatePicker } from '../../../components/forms/ControlledDatePicker';
import { CompanyFileEditProfileFormFields } from '../../companyFile/homesEdit/CompanyFileHomeEditProfile';
import { PersonTypes } from '../../../types/person/personEnums';
import { stringFormatter } from '../../../util/formatters/stringFormatter';
import PhoneFormBoxList from './phones/PhoneFormBoxList';
import {PublicEntityEnums} from "../../../util/typification/publicEntityEnums";
import { CardEditingContext } from '../../../components/cards/CardEditingWithContext';
import {TypographyBase} from "../../../components/misc/TypographyBase";

function CompanyDetailForm() {
  const methods = useFormContext();
  const { editing } = useContext(CardEditingContext);
  const obligatoryTypes: AddressTypes[] = [
    AddressTypes.Legal,
    AddressTypes.Activity,
  ];
  const baseNameCompany: string = CompanyFileEditProfileFormFields.Company;
  const isLegalPerson: boolean =
    methods.watch(
      `${CompanyDetailFormFields.Company}.${CompanyViewDTOFields.PersonTypeCode}`,
    ) === PersonTypes.Legal;
  const hasCertificatePyme: boolean =
    methods.watch(
      `${baseNameCompany}.${CompanyViewDTOFields.HasCertificatePyme}`,
    ) || false;

  useEffect(() => {
    if (!hasCertificatePyme) {
      methods.setValue(
        `${baseNameCompany}.${CompanyViewDTOFields.CertificatePymeDate}`,
        null,
      );
      methods.setValue(
        `${baseNameCompany}.${CompanyFields.AfipSectionCode}`,
        null,
      );
    }
  }, [hasCertificatePyme]);

  const handleFocus = (e: any) => e.target.select();

  return (
      <Stack spacing={3}>
        <TypographyBase variant={'h6'}>Información de Contacto</TypographyBase>
        <ControlledTextFieldFilled
          label="Mail"
          control={methods.control}
          name={CompanyDetailFormFields.Mail}
          disabled={!editing}
        />
        <Grid item container alignItems={'center'}>
          <Grid item xs={12} md={6}>
            <ControlledTextFieldFilled
              label="Web"
              control={methods.control}
              name={CompanyDetailFormFields.Web}
              disabled={!editing}
            />
          </Grid>
          <Grid item xs={12} md={6} sx={{pl: {md: 4, xs: 0}, pt: {xs: 3, md: 0}}}>
            <ControlledTextFieldFilled
              label="Red Social"
              control={methods.control}
              name={`${CompanyDetailFormFields.Company}.${CompanyViewDTOFields.SocialNetwork}`}
              disabled={!editing}
            />
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Divider />
        </Grid>
        <FormProvider {...methods}>
          <Stack spacing={-1}>
            <TypographyBase variant={'h6'}>Teléfonos</TypographyBase>
            <PhoneFormBoxList
              phoneListName={CompanyDetailFormFields.PhonesList}
              disabled={!editing}
            />
          </Stack>
        </FormProvider>
        <Grid item xs={12}>
          <Divider />
        </Grid>
      <FormProvider {...methods}>
        <AddressFormBoxListManager
          addressFieldName={CompanyDetailFormFields.Address}
          obligatoryTypes={obligatoryTypes}
          addressPerRow={1}
          disabled={!editing}
        />
      </FormProvider>
        <Grid item xs={12}>
          <Divider />
        </Grid>
      <Stack
        direction={'row'}
        justifyContent={'space-between'}
        sx={{ width: 1 }}
      >
        <Stack
          direction={'row'}
          alignItems={'center'}
          spacing={2}
          sx={{ width: 1 }}
        >
          <TypographyBase variant={'h6'}>
            Información Constitutiva e Impositiva
          </TypographyBase>
          <Tooltip arrow title="CUIT" placement="top">
            <Chip
              color="info"
              size="small"
              label={stringFormatter.formatCuit(
                methods.watch(
                  `${baseNameCompany}.${CompanyViewDTOFields.CUIT}`,
                ) ?? '',
              )}
            />
          </Tooltip>
        </Stack>
      </Stack>

      <Grid
        container
        alignItems={'center'}
        sx={{ '& > div': { alignSelf: 'flex-start' } }}
        spacing={1}
        mt={2}
      >
        <Grid item xs={12} sm={6}>
          <ControlledTextFieldFilled
            label="Tipo Persona"
            control={methods.control}
            name={CompanyDetailFormFields.PersonTypeDesc}
            disabled
          />
        </Grid>
        {isLegalPerson ? (
          <>
            <Grid item xs={12} sm={6} sx={{pl: {md: 4, xs: 0}, pt: {xs: 3, md: 0}}}>
              <AsyncSelect
                label="Tipo Sociedad"
                control={methods.control}
                name={`${CompanyDetailFormFields.Company}.${CompanyViewDTOFields.PersonClassificationTypeCode}`}
                loadOptions={HttpCachePerson.getPersonCompanyClassification}
                disabled={!editing}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <ControlledDatePicker
                label="Fecha Contrato Social"
                control={methods.control}
                name={`${baseNameCompany}.${CompanyViewDTOFields.SocialContractDate}`}
                disabled
                filled
              />
            </Grid>
          </>
        ) : (
          <>
            <Grid item xs={12} sm={6} sx={{pl: {md: 4, xs: 0}, pt: {xs: 3, md: 0}}}>
              <AsyncSelect
                label={'Tipo Documento'}
                control={methods.control}
                name={`${baseNameCompany}.${CompanyViewDTOFields.DocumentTypeCode}`}
                loadOptions={HttpCachePerson.getDocumentTypes}
                disabled
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <ControlledTextFieldFilled
                label={'Nro. Documento'}
                control={methods.control}
                name={`${baseNameCompany}.${CompanyViewDTOFields.DocumentNumber}`}
                disabled
              />
            </Grid>
            <Grid item xs={12} sm={6} sx={{pl: {md: 4, xs: 0}, pt: {xs: 3, md: 0}}}>
              <ControlledDatePicker
                label={'Fecha de Nacimiento'}
                control={methods.control}
                name={`${baseNameCompany}.${CompanyViewDTOFields.BirthdayDate}`}
                filled
                disabled={!editing}
              />
            </Grid>
          </>
        )}

        <Grid item xs={12} sm={6} sx={{pl: {md: 4, xs: 0}, pt: {xs: 3, md: 0}}}>
          <ControlledTextFieldFilled
            label="Cierre de Ejercicio Económico"
            control={methods.control}
            placeholder="dd/mm"
            name={CompanyDetailFormFields.DateClosing}
            helperText="Formato: dd/mm. Por ejemplo 31/12"
            disabled={!editing}
          />
        </Grid>

        {isLegalPerson && (
          <Grid item xs={12} sm={6}>
            <ControlledRadioYesNo
              label="Pertenece a Grupo Económico"
              control={methods.control}
              setValue={methods.setValue}
              name={`${baseNameCompany}.${CompanyViewDTOFields.BelongsEconomicGroup}`}
              row
              disabled={!editing}
            />
          </Grid>
        )}

        <Grid item xs={12} sm={6} sx={{pl: {md: 4, xs: 0}, pt: {xs: 3, md: 0}}}>
          <ControlledDatePicker
            label={`Fecha Inscripción ${PublicEntityEnums.ARCA}`}
            control={methods.control}
            name={`${baseNameCompany}.${CompanyViewDTOFields.AfipRegistrationDate}`}
            filled
            disabled
            inputFormat={'MM/yyyy'}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <AsyncSelect
            label="Condición Frente al IVA"
            control={methods.control}
            name={`${baseNameCompany}.${CompanyDetailFormFields.AfipResponsibilityTypeCode}`}
            loadOptions={HttpCachePerson.getAfipResponsiblityTypes}
            disabled={!editing}
          />
        </Grid>
        <Grid item xs={12} sm={6} sx={{pl: {md: 4, xs: 0}, pt: {xs: 3, md: 0}}}>
          <ControlledRadioYesNo
            label="Condición IIBB"
            control={methods.control}
            setValue={methods.setValue}
            name={`${baseNameCompany}.${CompanyViewDTOFields.RegisteredAtIIBB}`}
            row
            disabled={!editing}
          />
        </Grid>

        {/*<Grid item xs={12} sm={6}>
                        <ControlledTextFieldFilled label='Nro. IIBB'
                                               control={methods.control}
                                               name={`${baseNameCompany}.${CompanyViewDTOFields.CUIT}`}
                                               disabled
                        />
                    </Grid>*/}

        {!isLegalPerson && (
          <>
            <Grid item xs={12} sm={6}>
              <AsyncSelect
                label="Monotributista"
                control={methods.control}
                name={`${baseNameCompany}.${CompanyViewDTOFields.MonotaxTypeCode}`}
                loadOptions={HttpCacheCompany.getMonotaxTypes}
                disabled={!editing}
              />
            </Grid>

            <Grid item xs={12} sm={6} sx={{pl: {md: 4, xs: 0}, pt: {xs: 3, md: 0}}}>
              <AsyncSelect
                label="Autónomo"
                control={methods.control}
                name={`${baseNameCompany}.${CompanyViewDTOFields.SelfEmployedTypeCode}`}
                loadOptions={HttpCacheCompany.getSelfEmployedTypes}
                disabled={!editing}
              />
            </Grid>
          </>
        )}
        <Grid item xs={12} sm={6}>
          <ControlledRadioYesNo
            label="Posee Convenio Multilateral"
            control={methods.control}
            setValue={methods.setValue}
            name={`${baseNameCompany}.${CompanyViewDTOFields.HasMultilateralAgreement}`}
            row
            disabled={!editing}
          />
        </Grid>
        <Grid item xs={12} sm={6} sx={{pl: {md: 4, xs: 0}, pt: {xs: 3, md: 0}}}>
          <ControlledRadioYesNo
            label="Tiene Certificado Pyme"
            control={methods.control}
            setValue={methods.setValue}
            name={`${baseNameCompany}.${CompanyViewDTOFields.HasCertificatePyme}`}
            row
            disabled={!editing}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <ControlledDatePicker
            label="Vigencia Certificado Pyme"
            control={methods.control}
            name={`${baseNameCompany}.${CompanyViewDTOFields.CertificatePymeDate}`}
            disabled={!hasCertificatePyme || !editing}
            filled
          />
        </Grid>
        <Grid item xs={12} sm={6} sx={{pl: {md: 4, xs: 0}, pt: {xs: 3, md: 0}}}>
          <AsyncSelect
            loadOptions={HttpCacheGeneral.getAfipSection}
            control={methods.control}
            name={`${baseNameCompany}.${CompanyFields.AfipSectionCode}`}
            label={'Categoria MiPyMEs'}
            disabled={!hasCertificatePyme || !editing}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <ControlledRadioYesNo
            label="Empresa liderada por Mujeres"
            control={methods.control}
            setValue={methods.setValue}
            name={`${baseNameCompany}.${CompanyViewDTOFields.IsLeadByWoman}`}
            row
            disabled={!editing}
          />
        </Grid>
        <Grid item xs={12} sm={6} sx={{pl: {md: 4, xs: 0}, pt: {xs: 3, md: 0}}}>
          <ControlledTextFieldFilled
            control={methods.control}
            label="Facturación último año"
            name={`${baseNameCompany}.${CompanyViewDTOFields.BillingAmount}`}
            fullWidth
            currency
            textAlign={'right'}
            onFocus={handleFocus}
            disabled={!editing}
          />
        </Grid>
        {
            !isLegalPerson &&
            <Grid item xs={12} md={6}>
              <ControlledRadioYesNo name={`${CompanyDetailFormFields.Company}.${CompanyViewDTOFields.IsPoliticallyExposed}`}
                                    control={methods.control}
                                    setValue={methods.setValue}
                                    label={'Persona políticamente expuesta (PEP)'}
                                    row
                                    disabled={!editing}
              />
            </Grid>
        }
        {
            isLegalPerson &&
            <Grid item xs={12} md={6}>
              <ControlledRadioYesNo name={`${CompanyDetailFormFields.Company}.${CompanyViewDTOFields.HasSocialImpact}`}
                                    control={methods.control}
                                    setValue={methods.setValue}
                                    label={'Tiene Impacto Social'}
                                    row
                                    disabled={!editing}
              />
            </Grid>
        }
        {/*<Grid item xs={12} sm={6}>
                        <AsyncSelect label={'Moneda'} 
                                     loadOptions={HttpCacheGeneral.getCurrencies}
                                     control={methods.control}
                                     name={`${baseNameCompany}.${CompanyViewDTOFields.CurrencyCode}`}
                                     filled
                        />
                    </Grid>*/}

        {/*<Grid item>
                        <ControlledDatePicker label="Inicio Actividad"
                                              control={methods.control}
                                              name={`${baseNameCompany}.${CompanyViewDTOFields.ActivityStartDate}`}
                                              disabled={methods.watch(CompanyViewDTOFields.HasActivityStartDateFromAfip)}
                        />
                    </Grid>*/}
      </Grid>
    </Stack>
  );
}

export default CompanyDetailForm;
