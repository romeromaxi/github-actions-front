import React, {useContext} from "react";
import {Skeleton} from "@mui/lab";
import {Button, Stack, Typography} from "@mui/material";

import {CompanyLogoById} from "pages/company/components/CompanyLogo";
import {PrequalificationStepperContext} from "../PrequalificationStepper";
import {EntityWithIdFields} from "types/baseEntities";
import {CompanyViewDTO, CompanyViewDTOFields} from "types/company/companyData";
import { SolicitationSurveyContext } from "hooks/contexts/SolicitationSurveyContext";

interface PrequalificationStepperManagerEditSurveyProps {
    company?: CompanyViewDTO
}

function PrequalificationStepperManagerEditSurvey({ company }: PrequalificationStepperManagerEditSurveyProps) {
    const { setEditing } = useContext(PrequalificationStepperContext);
    const { cancelEditing, updateAnswers } = useContext(SolicitationSurveyContext);
    
    const onCancelEditing = () => {
        cancelEditing();
        setEditing(false);
    }
    
    const handleUpdateAnswers = async () => {
        await updateAnswers();
        setEditing(false);
    }
    
    return (
        <Stack spacing={4}>
            <Stack direction={'row'} spacing={1} alignItems={'center'}>
                <CompanyLogoById companyId={company?.[EntityWithIdFields.Id]} />

                {
                    company ?
                        <Typography className={'text-ellipsis-two-lines'} variant={'h4'}>
                            {`Edición de preguntas de la empresa ${company?.[CompanyViewDTOFields.BusinessName]}`}
                        </Typography>
                        :
                        <Skeleton variant={'text'} width={'80%'} />
                }
            </Stack>
            
            <Stack spacing={2}>
                <Stack direction='row' alignItems='center' spacing={1} justifyContent={'center'}>
                    <Button variant={'text'}
                            size={'small'}
                            onClick={onCancelEditing}
                    >
                        Cancelar
                    </Button>
                    
                    <Button variant={'contained'}
                            onClick={handleUpdateAnswers}
                            fullWidth
                    >
                        Guardar cambios
                    </Button>
                </Stack>
            </Stack>
        </Stack>
    )
}

export default PrequalificationStepperManagerEditSurvey;