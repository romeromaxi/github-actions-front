import {Box, Button, Stack, TextField} from "@mui/material";
import LabelFormBase from "components/forms/LabelFormBase";
import React, {useMemo, useState} from "react";
import {EntityAddress, EntityAddressFields} from "types/general/generalReferentialData";
import {AddressFormatter} from "util/formatters/addressFormatter";
import {FormProvider, useFormContext} from "react-hook-form";
import {AddressFormBoxListDialog} from "../CompanyPersonalInformationEdit";
import {AddressTypes} from "types/general/generalEnums";
import {CompanyViewDTOFields} from "types/company/companyData";
import {PencilLineIcon} from "lucide-react";
import { WrapperIcons } from "components/icons/Icons";

interface CompanyPersonalInformationAddressManagerProps {
    baseNameCompany: string,
    editing?: boolean
}

function CompanyPersonalInformationAddressManager(props: CompanyPersonalInformationAddressManagerProps) {
    const methods = useFormContext();
    const addresses = methods.watch(`${props.baseNameCompany}.${CompanyViewDTOFields.Address}`);
    
    const activityAddress = useMemo(() => (
        addresses ?
            addresses.find(
                (x: EntityAddress) => x[EntityAddressFields.AddressTypeCode] === AddressTypes.Activity,
            )
            :
            undefined
    ), [addresses]);

    const [openAddresses, setOpenAddresses] = useState<boolean>(false);
    
    const addressValue = useMemo(() => (
        activityAddress ? AddressFormatter.toFullAddress(activityAddress) : '-'
    ), [activityAddress])
    
    const showAddressesDialog = () => setOpenAddresses(true);
    
    const closeAddressesDialog = () => setOpenAddresses(false);
        
    return (
        <Stack spacing={1.25}>
            <LabelFormBase label={'Domicilio de actividad'} 
                           loadPending={!activityAddress || !activityAddress?.[EntityAddressFields.Street]}
            />

            {
                !props.editing ?
                    <TextField variant={'filled'}
                               size={'small'} 
                               value={addressValue}
                               disabled
                    />
                    :
                    <TextField variant={'filled'}
                               size={'small'}
                               value={addressValue || ''}
                               onClick={showAddressesDialog}
                               fullWidth
                               readOnly
                               InputProps={{
                                   inputProps: { style: { cursor: 'pointer' } },
                                   endAdornment:
                                       <Box sx={{ minWidth: 'fit-content', display: 'flex', justifyContent: 'space-between' }}>
                                           <Button startIcon={<WrapperIcons Icon={PencilLineIcon} size={'md'}/>}
                                                   variant={'text'}
                                           >
                                               {
                                                   !!activityAddress && !!activityAddress[EntityAddressFields.Street] ?
                                                       'Editar'
                                                       :
                                                       'Agregar'
                                               }
                                           </Button>
                                       </Box>
                               }}
                    />
            }

            <FormProvider {...methods}>
                <AddressFormBoxListDialog open={openAddresses} 
                                          onClose={closeAddressesDialog} 
                                          baseNameCompany={props.baseNameCompany} 
                                          obligatoryTypes={[AddressTypes.ActivityMain]}
                />
            </FormProvider>  
        </Stack>
    )
}

export default CompanyPersonalInformationAddressManager;