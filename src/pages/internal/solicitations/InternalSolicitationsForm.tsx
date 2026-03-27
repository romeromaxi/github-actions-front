
import {Button, Grid} from "@mui/material";
import {useForm} from "react-hook-form";
import React, {useCallback, useRef} from "react";
import {EntityWithIdAndDescription, EntityWithIdAndDescriptionFields} from "types/baseEntities";
import {
    InternalSolicitationFilterFields, InternalSolicitationFilter, SolicitationFilterFields
} from "types/solicitations/solicitationData";
import {ControlledTextFieldFilled} from "components/forms";
import {HttpOfferer} from "../../../http";
import {OffererFields} from "../../../types/offerer/offererData";
import {ControlledMultipleSelectAsync} from "../../../components/forms/ControlledMultipleSelectAsync";


interface InternalUserSolicitationsForm {
    [InternalSolicitationFilterFields.OffererIds]: number[],
    [InternalSolicitationFilterFields.CompanyCuit]: string,
    [InternalSolicitationFilterFields.CompanyBusinessName]: string,
    actualPage: number
}

interface InternalSolicitationsFormProps {
    onSearch: (filter: InternalSolicitationFilter) => void
}
const InternalSolicitationsForm = ({onSearch} : InternalSolicitationsFormProps) => {
    const methods = useForm<InternalUserSolicitationsForm>()
    const prevValues = useRef<InternalUserSolicitationsForm | null>(null)
    const watchValues = methods.watch()

    const getOfferers = useCallback(async (): Promise<EntityWithIdAndDescription[]> => {
        return HttpOfferer.getActiveOffererList().then((r) => {
            const mappedOfferers = r.map((of) => {
                return {
                    [EntityWithIdAndDescriptionFields.Id]: of[EntityWithIdAndDescriptionFields.Id],
                    [EntityWithIdAndDescriptionFields.Description]: of[OffererFields.BusinessName]
                }
            })
            
            return mappedOfferers
        })
    }, [])
    
    const onSubmit = (data: InternalUserSolicitationsForm) => {
        if (prevValues.current) {
            const { actualPage: actualPageCurrent, ...currentValues } = watchValues;
            const { actualPage: actualPagePrev, ...previousValues } = prevValues.current;
            if (JSON.stringify(currentValues) !== JSON.stringify(previousValues)) {
                onSearch({
                    ...currentValues,
                    [SolicitationFilterFields.CurrentPage]: 1
                });
            } else if (actualPageCurrent !== actualPagePrev) {
                onSearch({
                    ...currentValues,
                    [SolicitationFilterFields.CurrentPage]: actualPageCurrent
                });
            }
        } else {
            onSearch(watchValues);
        }

        prevValues.current = watchValues;
    }
    

    return (
        <Grid container alignItems='center'
              sx={{borderRadius: '24px', backgroundColor: 'white', padding: '16px'}}
              spacing={1}
        >
            <Grid item xs={12} md={6}>
                <ControlledMultipleSelectAsync loadOptions={getOfferers}
                                               name={InternalSolicitationFilterFields.OffererIds}
                                               sx={{ width: '100%', backgroundColor: 'white' }}
                                               control={methods.control}
                                               label={"Oferentes"}
                                               fullWidth
                                               filled
                                               id="selMulOfferersSearch"
                />
            </Grid>
            <Grid item md={3} xs={6}>
                <ControlledTextFieldFilled control={methods.control}
                                           name={InternalSolicitationFilterFields.CompanyBusinessName}
                                           fullWidth
                                           label='Razón social'
                />
            </Grid>
            <Grid item xs={6} md={1.5}>
                <ControlledTextFieldFilled control={methods.control}
                                           name={InternalSolicitationFilterFields.CompanyCuit}
                                           label={'CUIT'}
                                           fullWidth
                />
            </Grid>
            <Grid item xs={6} md={1.5}>
                <Button size='small' fullWidth variant='contained' onClick={methods.handleSubmit(onSubmit)}>
                    Buscar
                </Button>
            </Grid>
        </Grid>
    )
}


export default InternalSolicitationsForm