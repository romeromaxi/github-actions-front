import React, { useContext } from "react";
import { Skeleton } from "@mui/lab";
import { Button, Stack, Theme, Typography, useMediaQuery } from "@mui/material";
import { CompanyFileContext } from "hooks/contexts/CompanyFileContext";
import {CompanyLogoById} from "pages/company/components/CompanyLogo";
import { PrequalificationStepperContext } from "../PrequalificationStepper";
import { EntityWithIdFields } from "types/baseEntities";
import { CompanyViewDTO, CompanyViewDTOFields } from "types/company/companyData";
import {PersonTypes} from "../../../../types/person/personEnums";

interface PrequalificationStepperManagerEditProps {
    company?: CompanyViewDTO;
}

function PrequalificationStepperManagerEdit({ company }: PrequalificationStepperManagerEditProps) {
    const { updateCompanyFile, cancelEditing } = useContext(CompanyFileContext);
    const { setEditing } = useContext(PrequalificationStepperContext);
    const isMobileScreenSize = useMediaQuery((theme : Theme) => theme.breakpoints.down('sm'));
    const isLargeOrBiggerScreenSize = useMediaQuery((theme : Theme) => theme.breakpoints.up('lg'));
    const onCancelEditing = () => {
        cancelEditing();
        setEditing(false);
    };

    const handleUpdateCompanyFile = async () => {
        await updateCompanyFile();
        setEditing(false);
    };

    return (
        <Stack spacing={isMobileScreenSize ? 2 : 4}> 
            <Stack direction={'row'} spacing={1} alignItems={'center'}>
                <CompanyLogoById companyId={company?.[EntityWithIdFields.Id]} 
                                 isPhysicalPerson={company?.[CompanyViewDTOFields.PersonTypeCode] === PersonTypes.Physical}
                />

                {company ? (
                    <Typography
                        className={'text-ellipsis-two-lines'}
                        variant={isMobileScreenSize ? 'h6' : 'h4'}
                    >
                        {`Edición del legajo de la empresa ${company?.[CompanyViewDTOFields.BusinessName]}`}
                    </Typography>
                ) : (
                    <Skeleton variant={'text'} width={'80%'} />
                )}
            </Stack>

            <Stack spacing={isMobileScreenSize ? 1 : 2}>
                <Stack direction='row' alignItems='center' spacing={2} justifyContent={'center'}>
                    <Button
                        variant={'text'}
                        size={isLargeOrBiggerScreenSize ? 'medium' : 'small'}
                        onClick={onCancelEditing}
                    >
                        Cancelar
                    </Button>

                    <Button
                        variant={'contained'}
                        size={isLargeOrBiggerScreenSize ? 'medium' : 'small'}
                        onClick={handleUpdateCompanyFile}
                        fullWidth
                    >
                        Guardar cambios
                    </Button>
                </Stack>
            </Stack>
        </Stack>
    );
}

export default PrequalificationStepperManagerEdit;