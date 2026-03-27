import {
    CompanyDetailFormFields,
    CompanyFields,
    CompanyForm, CompanyViewDTO,
    CompanyViewDTOFields
} from "../../../types/company/companyData";
import CompanyLabelWithValueComponent from "./components/CompanyLabelWithValueComponent";
import {Skeleton} from "@mui/lab";
import {Box, Stack, Theme, Typography, useMediaQuery} from "@mui/material";
import {PersonTypes} from "../../../types/person/personEnums";
import {stringFormatter} from "../../../util/formatters/stringFormatter";
import {CompanyPhoneInsertDTO, CompanyPhoneNumberFields} from "../../../types/company/companyReferentialData";
import {
    EntityAddress, EntityAddressFields,
    EntityPhoneNumberFields
} from "../../../types/general/generalReferentialData";
import {AddressTypes} from "../../../types/general/generalEnums";
import {AddressFormatter} from "../../../util/formatters/addressFormatter";
import {FormProvider, useFormContext} from "react-hook-form";
import {ControlledRadioYesNo, ControlledTextFieldFilled} from "../../../components/forms";
import {CompanyFileEditProfileFormFields} from "../homesEdit/CompanyFileHomeEditProfile";
import {ControlledDatePicker} from "../../../components/forms/ControlledDatePicker";
import {dateFormatter} from "../../../util/formatters/dateFormatter";
import {EditIconButton} from "../../../components/buttons/Buttons";
import {AddressFormBoxListDialog, PhoneFormBoxListDialog} from "./CompanyPersonalInformationEdit";
import {CompanyFileEditFormFields} from "../../../hooks/contexts/CompanyFileContext";
import {useEffect, useState} from "react";
import React from "react";


interface CompanyContactDataSectionProps {
    company: CompanyForm,
    canEdit?: boolean
}

const getActivityAddressStreetAndNumber = (activityAddress?: EntityAddress) => {
  if (activityAddress) {
      const completeAddress: string =
          AddressFormatter.toStreetWithNumber(activityAddress);
      if (completeAddress) {
          return completeAddress
      } else {
          return undefined;
      }
  } else {
      return undefined;
  }
};

const getActivityAddressSecondaryData = (activityAddress?: EntityAddress) => {
    if (activityAddress) {
        const completeAddress: string =
            AddressFormatter.toSecondaryData(activityAddress);
        if (completeAddress) {
            return completeAddress
        } else {
            return (
                ''
            );
        }
    } else {
        return ('');
    }
};

const CompanyContactDataSection = ({company, canEdit} : CompanyContactDataSectionProps) => {
    const isLegalPerson: boolean = company[CompanyViewDTOFields.PersonTypeCode] === PersonTypes.Legal;
    const activityAddress = company[CompanyViewDTOFields.Address].find(
        (x) => x[EntityAddressFields.AddressTypeCode] === AddressTypes.Activity,
    );
    const addressMainData = getActivityAddressStreetAndNumber(activityAddress)
    const addressSecondaryData = getActivityAddressSecondaryData(activityAddress)
    
    return (
        <Stack spacing={1}>
            <CompanyLabelWithValueComponent label={'Domicilio de actividad'}
                                            value={addressMainData}
                                            secondaryValue={addressSecondaryData}
            />
            <CompanyLabelWithValueComponent label={'Teléfono'} value={company[CompanyFields.Phone]} />
            <CompanyLabelWithValueComponent label={'Mail'} value={company[CompanyViewDTOFields.Mail]} />
            {!isLegalPerson && <CompanyLabelWithValueComponent label={'Fecha de nacimiento'}
                                                               value={company[CompanyFields.BirthdayDate] && dateFormatter.toShortDate(company[CompanyFields.BirthdayDate])} />}
            <CompanyLabelWithValueComponent label={'Sitio Web'} value={company[CompanyFields.Web] || '-'} />
            <CompanyLabelWithValueComponent label={'Red Social'} value={company[CompanyFields.SocialNetwork] || '-'} />
            <CompanyLabelWithValueComponent label={'¿Es liderada por mujeres?'} value={company[CompanyViewDTOFields.IsLeadByWoman] !== null ? company[CompanyViewDTOFields.IsLeadByWoman] ? 'Si' : 'No' : canEdit ? undefined : '-'} />
            {
                !isLegalPerson && 
                <CompanyLabelWithValueComponent label={'Persona Expuesta Políticamente (PEP)'}
                                                value={company[CompanyViewDTOFields.IsPoliticallyExposed] !== null ? company[CompanyViewDTOFields.IsPoliticallyExposed] ? 'Si' : 'No' : '-'}
                />
            }
            {
                isLegalPerson &&
                <CompanyLabelWithValueComponent label={'Tiene Impacto Social'}
                                                value={company[CompanyViewDTOFields.HasSocialImpact] !== null ? company[CompanyViewDTOFields.HasSocialImpact] ? 'Si' : 'No' : '-'}
                />
            }
        </Stack>
    )
}

interface CompanyFileContactDataSectionProps {
    company: CompanyViewDTO,
    addresses: EntityAddress[]
}
export const CompanyFileContactDataSection = ({company, addresses} : CompanyFileContactDataSectionProps) => {
    const isLegalPerson: boolean = company[CompanyViewDTOFields.PersonTypeCode] === PersonTypes.Legal;
    const activityAddress = addresses.find(
        (x) => x[EntityAddressFields.AddressTypeCode] === AddressTypes.Activity,
    );
    const addressMainData = getActivityAddressStreetAndNumber(activityAddress)
    const addressSecondaryData = getActivityAddressSecondaryData(activityAddress)

    return (
        <Stack spacing={1}>
            <CompanyLabelWithValueComponent label={'Domicilio de actividad'}
                                            value={addressMainData}
                                            secondaryValue={addressSecondaryData}
            />
            <CompanyLabelWithValueComponent label={'Teléfono'} value={company[CompanyFields.Phone]} />
            <CompanyLabelWithValueComponent label={'Mail'} value={company[CompanyViewDTOFields.Mail]} />
            {!isLegalPerson && <CompanyLabelWithValueComponent label={'Fecha de nacimiento'} value={dateFormatter.toShortDate(company[CompanyFields.BirthdayDate])} />}
            <CompanyLabelWithValueComponent label={'Sitio Web'} value={company[CompanyFields.Web] || '-'} />
            <CompanyLabelWithValueComponent label={'Red Social'} value={company[CompanyFields.SocialNetwork] || '-'} />
            <CompanyLabelWithValueComponent label={'¿Es liderada por mujeres?'} value={company[CompanyViewDTOFields.IsLeadByWoman] !== null ? company[CompanyViewDTOFields.IsLeadByWoman] ? 'Si' : 'No' : '-'} />
            {
                !isLegalPerson &&
                <CompanyLabelWithValueComponent label={'Persona Expuesta Políticamente (PEP)'}
                                                value={company[CompanyViewDTOFields.IsPoliticallyExposed] !== null ? company[CompanyViewDTOFields.IsPoliticallyExposed] ? 'Si' : 'No' : '-'}
                />
            }
            {
                isLegalPerson &&
                <CompanyLabelWithValueComponent label={'Tiene Impacto Social'}
                                                value={company[CompanyViewDTOFields.HasSocialImpact] !== null ? company[CompanyViewDTOFields.HasSocialImpact] ? 'Si' : 'No' : '-'}
                />
            }
        </Stack>
    )
}

export const CompanyContactDataSectionEdit = ({company} : CompanyContactDataSectionProps) => {
    const methods = useFormContext();
    const baseNameCompany: string = CompanyFileEditProfileFormFields.Company;
    const [openPhones, setOpenPhones] = useState<boolean>(false);
    const [openAddresses, setOpenAddresses] = useState<boolean>(false);
    const activityAddress = company[CompanyViewDTOFields.Address].find(
        (x) => x[EntityAddressFields.AddressTypeCode] === AddressTypes.Activity,
    );
    const addressMainData = getActivityAddressStreetAndNumber(activityAddress)
    const addressSecondaryData = getActivityAddressSecondaryData(activityAddress)
    
    const isLoading: boolean =
        methods.watch(`${baseNameCompany}.${CompanyViewDTOFields.CUIT}`) ==
        undefined;
    
    const mainPhoneNumber = methods.watch(`${baseNameCompany}.${CompanyViewDTOFields.Phone}`) ?? undefined;
    const phonesNumbers = methods.watch(`${baseNameCompany}.${CompanyDetailFormFields.PhonesList}`) ?? undefined;
    const isLegalPerson: boolean = !methods.watch(`${CompanyFileEditFormFields.IsPhyisicalPerson}`);
    const isMobileScreenSize = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

    const setMainPhoneNumber = (newMainNumber: string) => 
        methods.setValue(`${baseNameCompany}.${CompanyViewDTOFields.Phone}`, newMainNumber);
    
    const updateMainPhoneNumber = () => {
        if (!phonesNumbers && !mainPhoneNumber)
            return;

        if (!phonesNumbers.length) {
            setMainPhoneNumber('');
            return;
        }

        const mainPhoneEntity: any = phonesNumbers ?
            phonesNumbers.find((ph: CompanyPhoneInsertDTO) => ph[EntityPhoneNumberFields.MainPhone]) : undefined;

        if (!!mainPhoneEntity) {
            const newMainNumber : string =
                stringFormatter.phoneNumberWithAreaCode(
                    mainPhoneEntity[CompanyPhoneNumberFields.AreaCode] || '',
                    mainPhoneEntity[CompanyPhoneNumberFields.PhoneNumber] || '',
                );

            if (newMainNumber && newMainNumber !== mainPhoneNumber)
                methods.setValue(`${baseNameCompany}.${CompanyViewDTOFields.Phone}`, newMainNumber)
        }
    }
    
    useEffect(() => {
        updateMainPhoneNumber();
    }, [phonesNumbers]);
    
    return (
        <Stack spacing={2}>
            <CompanyLabelWithValueComponent label={'Domicilio de actividad'} value={
                <Stack direction={'row'} spacing={2} alignItems={'center'}>
                    <Stack>
                        {
                            !!addressMainData ?
                                <Typography fontSize={isMobileScreenSize ? 14 : 16} fontWeight={500}>
                                    {stringFormatter.cutIfHaveMoreThan(addressMainData, 56)}
                                </Typography>
                                :
                                <Typography variant={'caption'} color={'warning.main'}>Pendiente de carga</Typography>
                        }
                        <Typography textAlign={'end'} variant={'caption'} color={'#818992'}>
                            {addressSecondaryData}
                        </Typography>
                    </Stack>
                    <EditIconButton
                        color={'secondary'}
                        tooltipTitle={!!addressMainData ? 'Cambiar domicilio de actividad' : 'Agregar domicilio de actividad'}
                        onClick={() => {
                            setOpenAddresses(true);
                        }}
                        size={'small'}
                    />
                </Stack>
            } />
            
            <CompanyLabelWithValueComponent label={'Teléfono'} value={
                <Stack direction={'row'} spacing={2} alignItems={'center'}>
                    {mainPhoneNumber ? <Typography fontSize={isMobileScreenSize ? 14 : 16} fontWeight={500}>{mainPhoneNumber}</Typography>
                        :
                        <Typography variant={'caption'} color={'warning.main'}>Pendiente de carga</Typography>
                    }
                    <EditIconButton
                      color={'secondary'}
                        tooltipTitle={mainPhoneNumber ? 'Cambiar teléfono principal' : 'Agregar teléfono principal'}
                        onClick={() => {
                            setOpenPhones(true);
                        }}
                        size={'small'}
                    />
                </Stack>
                } />
            <Stack direction={isMobileScreenSize ? 'column' : 'row'} spacing={2}>
                <Box sx={{ flex: { xs: 1, sm: 1, md: 1, lg: 2 } }}>
                    <ControlledTextFieldFilled
                    control={methods.control}
                    label={'Mail'}
                    name={`${baseNameCompany}.${CompanyFields.Mail}`}
                    fullWidth
                    loadPending
                    />
                </Box>
                {!isLegalPerson && (
                    <Box sx={{ flex: { xs: 1, sm: 1, md: 1, lg: 1 } }}>
                    <ControlledDatePicker
                        control={methods.control}
                        label={'Fecha de nacimiento'}
                        name={`${baseNameCompany}.${CompanyFields.BirthdayDate}`}
                        loadPending
                        filled
                    />
                    </Box>
                )}
            </Stack>


            <Stack direction={isMobileScreenSize ? 'column' : 'row'} spacing={2}>
                <ControlledTextFieldFilled
                    control={methods.control}
                    label={'Sitio Web'}
                    name={`${baseNameCompany}.${CompanyFields.Web}`}
                    fullWidth
                />
                <ControlledTextFieldFilled
                    control={methods.control}
                    label={'Red Social'}
                    name={`${baseNameCompany}.${CompanyFields.SocialNetwork}`}
                    fullWidth
                />
            </Stack>
            <Stack direction={isMobileScreenSize ? 'column' : 'row'}  spacing={2} alignItems={isMobileScreenSize ? 'flex-start' : 'center'} 
                justifyContent={isMobileScreenSize ? 'flex-start' : 'space-between'} sx={{paddingX: '8px'}}>
                {!isLoading ? (
                    <ControlledRadioYesNo
                        label="¿Es liderada por mujeres?"
                        control={methods.control}
                        setValue={methods.setValue}
                        name={`${baseNameCompany}.${CompanyFields.IsLeadByWoman}`}
                        loadPending
                        row
                    />
                ) : (
                    <Skeleton />
                )}
                {!isLoading && !isLegalPerson && (
                    <ControlledRadioYesNo name={`${baseNameCompany}.${CompanyViewDTOFields.IsPoliticallyExposed}`}
                                        control={methods.control}
                                        setValue={methods.setValue}
                                        label={'Persona políticamente expuesta (PEP)'}
                                        row
                    />
                )
                }
                {!isLoading && isLegalPerson && (
                    <ControlledRadioYesNo name={`${baseNameCompany}.${CompanyViewDTOFields.HasSocialImpact}`}
                                          control={methods.control}
                                          setValue={methods.setValue}
                                          label={'Tiene Impacto Social'}
                                          row
                    />
                )
                }
                {
                    isLoading && isLegalPerson &&
                    (
                        <Skeleton />
                    )
                }
            </Stack>

            <FormProvider {...methods}>
                <PhoneFormBoxListDialog
                    open={openPhones}
                    onClose={() => {
                        setOpenPhones(false);
                    }}
                    baseNameCompany={baseNameCompany}
                    baseListName={CompanyDetailFormFields.PhonesList}
                />
            </FormProvider>

            <FormProvider {...methods}>
                <AddressFormBoxListDialog
                    open={openAddresses}
                    onClose={() => {
                        setOpenAddresses(false);
                    }}
                    baseNameCompany={baseNameCompany}
                    obligatoryTypes={[AddressTypes.ActivityMain]}
                />
            </FormProvider>
        </Stack>
    )
}


export default CompanyContactDataSection