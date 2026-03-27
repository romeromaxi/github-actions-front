import {Box, Button, Stack, TextField} from "@mui/material";
import LabelFormBase from "components/forms/LabelFormBase";
import React, {useEffect, useState} from "react";
import {FormProvider, useFormContext} from "react-hook-form";
import {PhoneFormBoxListDialog} from "../CompanyPersonalInformationEdit";
import {CompanyDetailFormFields, CompanyViewDTOFields} from "types/company/companyData";
import {CompanyPhoneInsertDTO, CompanyPhoneNumberFields} from "types/company/companyReferentialData";
import {EntityPhoneNumberFields} from "types/general/generalReferentialData";
import {stringFormatter} from "util/formatters/stringFormatter";
import {PencilLineIcon} from "lucide-react";
import {WrapperIcons} from "components/icons/Icons";
import { TypographyBase } from "components/misc/TypographyBase";
import {themeColorDefinition} from "util/themes/definitions";

interface CompanyPersonalInformationPhoneManagerProps {
    baseNameCompany: string,
    editing?: boolean
}

function CompanyPersonalInformationPhoneManager(props: CompanyPersonalInformationPhoneManagerProps) {
    const methods = useFormContext();
    const mainPhoneNumber = methods.watch(`${props.baseNameCompany}.${CompanyViewDTOFields.Phone}`) ?? undefined;
    const phonesNumbers = methods.watch(`${props.baseNameCompany}.${CompanyDetailFormFields.PhonesList}`) ?? undefined;
    const [openPhones, setOpenPhones] = useState<boolean>(false);
        
    const showPhonesDialog = () => setOpenPhones(true);
    
    const closePhonesDialog = () => setOpenPhones(false);

    const setMainPhoneNumber = (newMainNumber: string) =>
        methods.setValue(`${props.baseNameCompany}.${CompanyViewDTOFields.Phone}`, newMainNumber);

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
                methods.setValue(`${props.baseNameCompany}.${CompanyViewDTOFields.Phone}`, newMainNumber)
        }
    }

    useEffect(() => {
        updateMainPhoneNumber();
    }, [phonesNumbers]);
    
    return (
        <Stack spacing={1.25}>
            <LabelFormBase label={'Teléfono'}
                           loadPending={!mainPhoneNumber}
            />

            {
                !props.editing ?
                    <TextField variant={'filled'}
                               size={'small'} 
                               value={
                                   `${mainPhoneNumber || ''}${
                                       phonesNumbers?.length > 1
                                           ? ` y ${phonesNumbers.length - 1} más`
                                           : ''
                                   }`
                               }
                               disabled
                    />
                    :
                    <TextField variant={'filled'}
                               size={'small'}
                               value={''}
                               onClick={showPhonesDialog}
                               fullWidth
                               readOnly
                               InputProps={{
                                   inputProps: { style: { cursor: 'pointer' } },
                                   startAdornment: (
                                       <Stack direction={'row'}
                                              spacing={0.5}
                                              width={'100%'}
                                              sx={{ cursor: 'pointer', textWrapMode: 'nowrap' }}
                                       >
                                           {
                                               !!mainPhoneNumber && 
                                                   <TypographyBase variant={'body2'}>
                                                       {mainPhoneNumber}
                                                   </TypographyBase>
                                           }

                                           {phonesNumbers?.length > 1 && (
                                               <TypographyBase variant={'body2'}
                                                               sx={{ WebkitTextFillColor: `${themeColorDefinition.UIElements.texts.lighter} !important`, }}
                                               >
                                                   {` y ${phonesNumbers.length - 1} más`}
                                               </TypographyBase>
                                           )}
                                       </Stack>
                                   ),
                                   endAdornment:
                                       <Box sx={{ minWidth: 'fit-content', display: 'flex', justifyContent: 'space-between' }}>
                                           <Button
                                               startIcon={<WrapperIcons Icon={PencilLineIcon} size={'md'}/>}
                                               variant={'text'}
                                               onClick={showPhonesDialog}
                                           >
                                               { !!mainPhoneNumber ? 'Editar o añadir' : 'Añadir' }
                                           </Button>
                                       </Box>
                               }}
                    />
            }

            <FormProvider {...methods}>
                <PhoneFormBoxListDialog open={openPhones} 
                                        onClose={closePhonesDialog} 
                                        baseNameCompany={props.baseNameCompany} 
                                        baseListName={CompanyDetailFormFields.PhonesList}
                />
            </FormProvider>  
        </Stack>
    )
}

/*
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
                
            <FormProvider {...methods}>
            </FormProvider>*/

export default CompanyPersonalInformationPhoneManager;