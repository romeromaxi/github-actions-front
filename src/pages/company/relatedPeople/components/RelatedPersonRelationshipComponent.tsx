import {Grid, Stack} from '@mui/material';
import {
    ControlledCheckBox,
    ControlledTextFieldFilled,
} from 'components/forms';
import React, {useEffect} from 'react';
import {useFormContext} from 'react-hook-form';
import {
    PersonRelationshipFields,
    PersonRelationshipFormFields,
    PersonRelationshipInsertFields
} from 'types/person/personData';

interface RelatedPersonRelationshipComponentProps {
    name?: string;
    disabledInputs?: boolean;
    legalPerson?: boolean;
    alreadyRendered?: boolean;
}

function RelatedPersonRelationshipComponent({
                                                name,
                                                disabledInputs,
                                                legalPerson,
                                                alreadyRendered
                                            }: RelatedPersonRelationshipComponentProps) {
    const nameBase = name ? `${name}.` : '';
    const {control, watch, setValue, clearErrors} = useFormContext();
    const watchIsMember = watch(
        `${nameBase}${PersonRelationshipFormFields.IsMember}`,
    );
    const watchIsSpouse = watch(
        `${nameBase}${PersonRelationshipFormFields.IsSpouse}`,
    );
    const watchIsAuthority = watch(
        `${nameBase}${PersonRelationshipFormFields.IsAuthority}`,
    );
    const watchIsEmployee = watch(
        `${nameBase}${PersonRelationshipFormFields.IsEmployee}`,
    );
    const watchIsOther = watch(
        `${nameBase}${PersonRelationshipFormFields.IsOther}`,
    );

    useEffect(() => {
        clearErrors(
            `${nameBase}${PersonRelationshipFields.ParticipationPercent}`,
        );
        setValue(
            `${nameBase}${PersonRelationshipFields.ParticipationPercent}`,
            parseInt(''),
        );
    }, [watchIsMember]);

    useEffect(() => {
        clearErrors(
            `${nameBase}${PersonRelationshipFields.PositionSpouseDesc}`,
        );
        setValue(
            `${nameBase}${PersonRelationshipFields.PositionSpouseDesc}`,
            '',
        );
    }, [watchIsSpouse]);

    useEffect(() => {
        clearErrors(
            `${nameBase}${PersonRelationshipFields.PositionAuthorityDesc}`,
        );
        setValue(
            `${nameBase}${PersonRelationshipFields.PositionAuthorityDesc}`,
            '',
        );
    }, [watchIsAuthority]);

    useEffect(() => {
        clearErrors(
            `${nameBase}${PersonRelationshipFields.PositionEmployeeDesc}`,
        );
        setValue(
            `${nameBase}${PersonRelationshipFields.PositionEmployeeDesc}`,
            '',
        );
    }, [watchIsEmployee]);

    useEffect(() => {
        clearErrors(
            `${nameBase}${PersonRelationshipFields.PositionOthersDesc}`,
        );
        setValue(
            `${nameBase}${PersonRelationshipFields.PositionOthersDesc}`,
            '',
        );
    }, [watchIsOther]);

    return (
        <Grid item xs={12} container spacing={3}>
            {legalPerson ? (
                <Grid item xs={12} sm={6} alignItems={'center'}>
                    <Stack spacing={3}>
                        <ControlledCheckBox
                            label={'Socio'}
                            name={`${nameBase}${PersonRelationshipFormFields.IsMember}`}
                            control={control}
                            disabled={disabledInputs}
                        />

                        <ControlledTextFieldFilled
                            label={'% Participación'}
                            control={control}
                            name={`${nameBase}${PersonRelationshipFields.ParticipationPercent}`}
                            fullWidth
                            disabled={disabledInputs || !watchIsMember}
                            currency
                            currencyPrefix={''}
                            currencySuffix={'%'}
                        />
                    </Stack>
                </Grid>
            ) : (
                <Grid item xs={12} sm={6} alignItems={'center'}>
                    <Stack spacing={3}>
                        <ControlledCheckBox
                            label={'Cónyuge'}
                            name={`${nameBase}${PersonRelationshipFormFields.IsSpouse}`}
                            control={control}
                            disabled={disabledInputs}
                        />

                        <ControlledTextFieldFilled
                            label={'Relación'}
                            name={`${nameBase}${PersonRelationshipFields.PositionSpouseDesc}`}
                            control={control}
                            disabled={disabledInputs || !watchIsSpouse}
                        />
                    </Stack>
                </Grid>
            )}

            <Grid item xs={12} sm={6} alignItems={'center'}>
                <Stack spacing={3}>
                    <ControlledCheckBox
                        label={'Autoridad'}
                        name={`${nameBase}${PersonRelationshipFormFields.IsAuthority}`}
                        control={control}
                        disabled={disabledInputs}
                    />
                    <ControlledTextFieldFilled
                        label={'Cargo'}
                        name={`${nameBase}${PersonRelationshipFields.PositionAuthorityDesc}`}
                        control={control}
                        disabled={disabledInputs || !watchIsAuthority}
                    />
                </Stack>
            </Grid>

            <Grid item xs={12} sm={6}>
                <Stack spacing={3}>
                    <ControlledCheckBox
                        label={'Empleado'}
                        name={`${nameBase}${PersonRelationshipFormFields.IsEmployee}`}
                        control={control}
                        disabled={disabledInputs}
                    />
                    <ControlledTextFieldFilled
                        label={'Cargo'}
                        name={`${nameBase}${PersonRelationshipFields.PositionEmployeeDesc}`}
                        control={control}
                        disabled={disabledInputs || !watchIsEmployee}
                    />
                </Stack>
            </Grid>

            <Grid item xs={12} sm={6}>
                <Stack spacing={3}>
                    <ControlledCheckBox
                        label={'Otros'}
                        name={`${nameBase}${PersonRelationshipFormFields.IsOther}`}
                        control={control}
                        disabled={disabledInputs}
                    />

                    <ControlledTextFieldFilled
                        label={'Cargo'}
                        name={`${nameBase}${PersonRelationshipFields.PositionOthersDesc}`}
                        control={control}
                        disabled={disabledInputs || !watchIsOther}
                    />
                </Stack>
            </Grid>
            {
                !legalPerson && !alreadyRendered &&
                <Grid item xs={12}>
                    <ControlledCheckBox label={'¿Es persona expuesta políticamente? (PEP)'}
                                        name={`${nameBase}${PersonRelationshipInsertFields.IsPoliticallyExposed}`}
                                        control={control}
                    />
                </Grid>
            }
        </Grid>
    );
}

export default RelatedPersonRelationshipComponent;
