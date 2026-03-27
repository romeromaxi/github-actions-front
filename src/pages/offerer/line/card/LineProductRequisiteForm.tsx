import React, {useEffect, useState} from 'react';
import {useFieldArray, useFormContext, useWatch} from 'react-hook-form';

import {FormControlLabel, Grid, Radio, RadioGroup, Stack, Switch, Typography,} from '@mui/material';
import {ControlledMultipleSelect} from 'components/forms/ControlledMultipleSelect';

import {
    ProductLineFields,
    ProductLineRequisiteDetailFields,
    ProductLineRequisiteDetailInsert,
    ProductLineRequisiteFields,
    ProductLineRequisiteView,
} from 'types/lines/productLineData';
import {EntityWithIdAndDescription, EntityWithIdFields,} from 'types/baseEntities';

import {HttpAddressData} from 'http/general';
import {HttpCacheGeneral} from 'http/index';
import {ControlledTextFieldFilled} from 'components/forms';
import ControlledTextFieldStyles from 'components/forms/ControlledTextField.styles';
import {useProductLineDetail} from '../../../lines/ProductLineDetailContext';
import {TypographyBase} from "components/misc/TypographyBase";

interface LineProductRequisiteFormProps {
    requisite: ProductLineRequisiteView;
    allowsRestrictivePolicy: boolean
}

function LineProductRequisiteProvinces({
                                           requisite, allowsRestrictivePolicy
                                       }: LineProductRequisiteFormProps) {
    const nameBase: string = `${ProductLineFields.ListRequisites}[${requisite[EntityWithIdFields.Id]}]`;
    const labelBase: string = requisite[ProductLineRequisiteFields.Title];

    return (
        <LineProductRequisiteMultipleSelect
            label={labelBase}
            nameBase={nameBase}
            field={ProductLineRequisiteDetailFields.ProvinceCode}
            loadOptions={() => HttpAddressData.getProvinces(1)}
            requisiteId={requisite[EntityWithIdFields.Id]}
            allowsRestrictivePolicy={allowsRestrictivePolicy}
        />
    );
}

function LineProductRequisiteAmount({
                                        requisite, allowsRestrictivePolicy
                                    }: LineProductRequisiteFormProps) {
    const labelBase: string = requisite[ProductLineRequisiteFields.Title];
    const nameBaseElement: string = `${ProductLineFields.ListRequisites}[${requisite[EntityWithIdFields.Id]}][0]`;

    const labelMinimum = labelBase.replace(
        'facturación anual',
        'facturación anual mínima',
    );
    const labelMaximum = labelBase.replace(
        'facturación anual',
        'facturación anual máxima',
    );

    return (
        <>
            <LineProductRequisiteTextInput
                label={labelMinimum}
                name={`${nameBaseElement}.${ProductLineRequisiteDetailFields.BillingAmountMinimum}`}
                currency
                requisiteId={requisite[EntityWithIdFields.Id]}
                allowsRestrictivePolicy={allowsRestrictivePolicy}
            />

            <Grid container mt={1}/>

            <LineProductRequisiteTextInput
                label={labelMaximum}
                name={`${nameBaseElement}.${ProductLineRequisiteDetailFields.BillingAmountMaximum}`}
                currency
                requisiteId={requisite[EntityWithIdFields.Id]}
                allowsRestrictivePolicy={allowsRestrictivePolicy}
            />
        </>
    );
}

function LineProductRequisiteSeniority({
                                           requisite, allowsRestrictivePolicy
                                       }: LineProductRequisiteFormProps) {
    const labelBase: string = requisite[ProductLineRequisiteFields.Title];
    const nameBaseElement: string = `${ProductLineFields.ListRequisites}[${requisite[EntityWithIdFields.Id]}][0]`;

    const labelMinimum = labelBase.replace('antigüedad', 'antigüedad mínima');
    const labelMaximum = labelBase.replace('antigüedad', 'antigüedad máxima');

    return (
        <>
            <LineProductRequisiteTextInput
                label={labelMinimum}
                name={`${nameBaseElement}.${ProductLineRequisiteDetailFields.SeniorityCompanyMinimum}`}
                requisiteId={requisite[EntityWithIdFields.Id]}
                allowsRestrictivePolicy={allowsRestrictivePolicy}
            />

            <Grid container mt={1}/>

            <LineProductRequisiteTextInput
                label={labelMaximum}
                name={`${nameBaseElement}.${ProductLineRequisiteDetailFields.SeniorityCompanyMaximum}`}
                requisiteId={requisite[EntityWithIdFields.Id]}
                allowsRestrictivePolicy={allowsRestrictivePolicy}
            />
        </>
    );
}

function LineProductRequisiteClassificationSepyme({
                                                      requisite, allowsRestrictivePolicy
                                                  }: LineProductRequisiteFormProps) {
    const nameBase: string = `${ProductLineFields.ListRequisites}[${requisite[EntityWithIdFields.Id]}]`;
    const labelBase: string = requisite[ProductLineRequisiteFields.Title];

    return (
        <LineProductRequisiteMultipleSelect
            label={labelBase}
            nameBase={nameBase}
            field={ProductLineRequisiteDetailFields.AfipSepymeCode}
            loadOptions={HttpCacheGeneral.getAfipSection}
            requisiteId={requisite[EntityWithIdFields.Id]}
            allowsRestrictivePolicy={allowsRestrictivePolicy}
        />
    );
}

function LineProductRequisiteActivitySector({
                                                requisite, allowsRestrictivePolicy
                                            }: LineProductRequisiteFormProps) {
    const nameBase: string = `${ProductLineFields.ListRequisites}[${requisite[EntityWithIdFields.Id]}]`;
    const labelBase: string = requisite[ProductLineRequisiteFields.Title];

    return (
        <LineProductRequisiteMultipleSelect
            label={labelBase}
            nameBase={nameBase}
            field={ProductLineRequisiteDetailFields.AfipSectorCode}
            loadOptions={HttpCacheGeneral.getAfipSectors}
            requisiteId={requisite[EntityWithIdFields.Id]}
            allowsRestrictivePolicy={allowsRestrictivePolicy}
        />
    );
}

function LineProductRequisiteGender({
                                        requisite,
                                    }: LineProductRequisiteFormProps) {
    const {allowEdit} = useProductLineDetail();
    const {setValue, watch} = useFormContext();
    const classes = ControlledTextFieldStyles();
    const labelBase: string = requisite[ProductLineRequisiteFields.Title];
    const nameBaseElement: string = `${ProductLineFields.ListRequisites}[${requisite[EntityWithIdFields.Id]}][0]`;

    const [restricted, setRestricted] = useState<boolean>(
        watch(
            `${nameBaseElement}.${ProductLineRequisiteDetailFields.IsExclusiveLedWomen}`,
        ),
    );

    const onChangeRestricted = (newValue: boolean) => {
        setValue(
            `${nameBaseElement}.${ProductLineRequisiteDetailFields.IsExclusiveLedWomen}`,
            newValue, {shouldDirty: true}
        );
        setRestricted(newValue);
    };

    return (
        <>
            <Grid item xs={9} alignSelf={!restricted ? 'center' : ''}>
                <Typography className={classes.labelFilled}>{labelBase}</Typography>
            </Grid>

            <LineProductRequisiteRadioForm
                value={restricted}
                onChange={onChangeRestricted}
                disabled={!allowEdit}
            />
        </>
    );
}

function LineProductRequisiteTaxCondition({
                                              requisite, allowsRestrictivePolicy
                                          }: LineProductRequisiteFormProps) {
    const nameBase: string = `${ProductLineFields.ListRequisites}[${requisite[EntityWithIdFields.Id]}]`;
    const labelBase: string = requisite[ProductLineRequisiteFields.Title];

    return (
        <LineProductRequisiteMultipleSelect
            label={labelBase}
            nameBase={nameBase}
            field={ProductLineRequisiteDetailFields.AfipTaxConditionCode}
            loadOptions={HttpCacheGeneral.getAfipTaxConditions}
            requisiteId={requisite[EntityWithIdFields.Id]}
            allowsRestrictivePolicy={allowsRestrictivePolicy}
        />
    );
}

function LineProductRequisiteScoringMinimum({
                                                requisite, allowsRestrictivePolicy
                                            }: LineProductRequisiteFormProps) {
    const nameBaseElement: string = `${ProductLineFields.ListRequisites}[${requisite[EntityWithIdFields.Id]}][0]`;
    const labelBase: string = requisite[ProductLineRequisiteFields.Title];

    return (
        <LineProductRequisiteTextInput
            label={labelBase}
            name={`${nameBaseElement}.${ProductLineRequisiteDetailFields.ScoringMinimum}`}
            requisiteId={requisite[EntityWithIdFields.Id]}
            allowsRestrictivePolicy={allowsRestrictivePolicy}
        />
    );
}

function LineProductRequisiteDebtSituationMaximum({
                                                      requisite, allowsRestrictivePolicy
                                                  }: LineProductRequisiteFormProps) {
    const nameBaseElement: string = `${ProductLineFields.ListRequisites}[${requisite[EntityWithIdFields.Id]}][0]`;
    const labelBase: string = requisite[ProductLineRequisiteFields.Title];

    return (
        <LineProductRequisiteTextInput
            label={labelBase}
            name={`${nameBaseElement}.${ProductLineRequisiteDetailFields.DebtSituationMaximum}`}
            requisiteId={requisite[EntityWithIdFields.Id]}
            allowsRestrictivePolicy={allowsRestrictivePolicy}
        />
    );
}

function LineProductRequisiteSocialOrEnvironmentalImpact({
                                                             requisite, allowsRestrictivePolicy
                                                         }: LineProductRequisiteFormProps) {
    const {allowEdit} = useProductLineDetail();
    const {setValue, watch, control, getValues} = useFormContext();
    const {append, remove} = useFieldArray({
        control: control,
        name: ProductLineFields.ListRequisitesPolicyRestrictive,
    });
    const watchedRestrictives = useWatch({
        control: control,
        name: ProductLineFields.ListRequisitesPolicyRestrictive
    });
    
    const classes = ControlledTextFieldStyles();
    const requisiteId = requisite[EntityWithIdFields.Id];
    const labelBase: string = requisite[ProductLineRequisiteFields.Title];
    const nameBaseElement: string = `${ProductLineFields.ListRequisites}[${requisite[EntityWithIdFields.Id]}][0]`;

    const [restricted, setRestricted] = useState<boolean>(
        watch(
            `${nameBaseElement}.${ProductLineRequisiteDetailFields.IsExclusiveSocialImpact}`, {shouldDirty: true}
        ),
    );
    
    const onChangeRestricted = (newValue: boolean) => {
        setValue(
            `${nameBaseElement}.${ProductLineRequisiteDetailFields.IsExclusiveSocialImpact}`,
            newValue, {shouldDirty: true}
        );
        
        if (newValue) removeFromPolicyRestrictive();
        
        setRestricted(newValue);
    };
    
    const removeFromPolicyRestrictive = () => {
        const values = getValues(ProductLineFields.ListRequisitesPolicyRestrictive);
        const index = values.indexOf(requisiteId);

        if (index >= 0) remove(index);
    }
    
    const onChangeRestrictivePolicy = (newValue: boolean) => {        
        if (requisiteId) {
            if (newValue)
                append(requisiteId);
            else {
                const values = getValues(ProductLineFields.ListRequisitesPolicyRestrictive);
                const index = values.indexOf(requisiteId);

                if (index >= 0) remove(index);
            }
        }
    };
    
    return (
        <>
            <Grid item xs={9} alignSelf={!restricted ? 'center' : ''}>
                <Typography className={classes.labelFilled}>{labelBase}</Typography>
            </Grid>

            <LineProductRequisiteRadioForm
                value={restricted}
                onChange={onChangeRestricted}
                disabled={!allowEdit}
                allowRestriction={allowsRestrictivePolicy ?
                    {value: (watchedRestrictives || []).includes(requisite[EntityWithIdFields.Id]), onChange: onChangeRestrictivePolicy}
                    :
                    undefined
                }
            />
        </>
    );
}

interface LineProductRequisiteRadioFormProps {
    value: boolean;
    onChange: (newValue: boolean) => void;
    disabled?: boolean;
    allAndSomeValues?: boolean;
    allowRestriction?: {
        value: boolean,
        onChange: (newValue: boolean) => void
    }
}

function LineProductRequisiteRadioForm(
    props: LineProductRequisiteRadioFormProps,
) {
    const yesValue: string = 'true';
    const noValue: string = 'false';

    const onChangeOption = (
        event: React.ChangeEvent<HTMLInputElement>,
        value: string,
    ) => {
        props.onChange(value === yesValue);
    };

    return (
        <React.Fragment>
            <Grid item xs={3}>
                <RadioGroup
                    value={props.value ? yesValue : noValue}
                    onChange={onChangeOption}
                    row
                >
                    {props.allAndSomeValues ? (
                        <>
                            <FormControlLabel
                                control={<Radio/>}
                                label="Todos"
                                value={noValue}
                                disabled={props.disabled}
                            />
                            <FormControlLabel
                                control={<Radio/>}
                                label="Algunos"
                                value={yesValue}
                                disabled={props.disabled}
                            />
                        </>
                    ) : (
                        <>
                            <FormControlLabel
                                control={<Radio/>}
                                label="Si"
                                value={yesValue}
                                disabled={props.disabled}
                            />
                            <FormControlLabel
                                control={<Radio/>}
                                label="No"
                                value={noValue}
                                disabled={props.disabled}
                            />
                        </>
                    )}
                </RadioGroup>

                {
                    (props.value && props.allowRestriction) &&
                    <Stack direction={'row'}
                           alignItems={'center'}
                           justifyContent={'space-between'}
                           spacing={1}
                    >
                        <TypographyBase variant={'body3'} color={'text.lighter'}>
                            ¿Es restrictiva?
                        </TypographyBase>

                        <Switch
                            checked={props.allowRestriction.value}
                            onChange={(e) => props.allowRestriction?.onChange(e.target.checked)}
                            name={`select_template}`}
                            size={'small'}
                        />
                    </Stack>
                }
            </Grid>
        </React.Fragment>
    );
}

interface LineProductRequisiteMultipleSelectProps {
    label: string;
    nameBase: string;
    field:
        | ProductLineRequisiteDetailFields.ProvinceCode
        | ProductLineRequisiteDetailFields.BillingAmountMinimum
        | ProductLineRequisiteDetailFields.BillingAmountMaximum
        | ProductLineRequisiteDetailFields.AfipSepymeCode
        | ProductLineRequisiteDetailFields.SeniorityCompanyMinimum
        | ProductLineRequisiteDetailFields.SeniorityCompanyMaximum
        | ProductLineRequisiteDetailFields.AfipSectorCode
        | ProductLineRequisiteDetailFields.AfipTaxConditionCode
        | ProductLineRequisiteDetailFields.ScoringMinimum
        | ProductLineRequisiteDetailFields.DebtSituationMaximum;
    loadOptions: () => Promise<EntityWithIdAndDescription[]>;
    requisiteId: number,
    allowsRestrictivePolicy: boolean
}

function LineProductRequisiteMultipleSelect({
                                                label,
                                                nameBase,
                                                field,
                                                loadOptions,
                                                requisiteId,
                                                allowsRestrictivePolicy
                                            }: LineProductRequisiteMultipleSelectProps) {
    const {allowEdit} = useProductLineDetail();
    const {setValue, watch, control, getValues} = useFormContext();
    const {append, remove} = useFieldArray({
        control: control,
        name: ProductLineFields.ListRequisitesPolicyRestrictive,
    });
    const watchedRestrictives = useWatch({
        control: control,
        name: ProductLineFields.ListRequisitesPolicyRestrictive
    });

    const [options, setOptions] = useState<EntityWithIdAndDescription[]>();
    const [restricted, setRestricted] = useState<boolean>(false);
    const classes = ControlledTextFieldStyles();
    const watchSelectedList = watch(nameBase).map(
        (x: ProductLineRequisiteDetailInsert) => x[field],
    );

    const setCodesOptions = (value: number[]) => {
        setValue(
            nameBase,
            value.map((x) => {
                return {
                    [field]: x,
                } as unknown as ProductLineRequisiteDetailInsert;
            }),
            {shouldDirty: true}
        );
    };

    const onChangeRestricted = (newValue: boolean) => {
        if (!newValue && options)
            setCodesOptions(options.map((x) => x[EntityWithIdFields.Id]));

        setRestricted(newValue);
        
        if (newValue) removeFromPolicyRestrictive();
    };
    
    const removeFromPolicyRestrictive = () => {
        const values = getValues(ProductLineFields.ListRequisitesPolicyRestrictive);
        const index = values.indexOf(requisiteId);

        if (index >= 0) remove(index);
    }

    const onChangeRestrictivePolicy = (newValue: boolean) => {
        if (requisiteId) {
            if (newValue)
                append(requisiteId);
            else
                removeFromPolicyRestrictive();
        }
    };

    useEffect(() => {
        loadOptions().then((responseOptions) => {
            const isSelectAll: boolean =
                !!watchSelectedList &&
                (responseOptions.length === watchSelectedList.length ||
                    watchSelectedList.length === 0);
            setOptions(responseOptions);
            setRestricted(!isSelectAll);

            if (isSelectAll && watchSelectedList.length === 0)
                setCodesOptions(responseOptions.map((x) => x[EntityWithIdFields.Id]));
        });
    }, []);

    return (
        <>
            <Grid item xs={9} alignSelf={!restricted ? 'center' : ''}>
                {
                    !restricted ?
                        <Typography className={classes.labelFilled}>{label}</Typography>
                        :
                        <ControlledMultipleSelect
                            label={label}
                            lstData={options}
                            valuesSelected={watchSelectedList}
                            variant="outlined"
                            id={`selMulCodLineProductRequisite${field}`}
                            field={field}
                            onHandleChange={(field: string, value?: number[]) =>
                                setCodesOptions(value || [])
                            }
                            disabled={!allowEdit}
                            filled
                            fullWidth
                        />
                }
            </Grid>

            <LineProductRequisiteRadioForm
                value={restricted}
                onChange={onChangeRestricted}
                disabled={!allowEdit}
                allAndSomeValues
                allowRestriction={allowsRestrictivePolicy ?
                    {value: (watchedRestrictives || []).includes(requisiteId), onChange: onChangeRestrictivePolicy}
                    :
                    undefined
                }
            />
        </>
    );
}

interface LineProductRequisiteTextInputProps {
    label: string;
    name: string;
    currency?: boolean;
    requisiteId: number;
    allowsRestrictivePolicy: boolean;
}

function LineProductRequisiteTextInput({
                                           label,
                                           name,
                                           currency,
                                           requisiteId, 
                                           allowsRestrictivePolicy
                                       }: LineProductRequisiteTextInputProps) {
    const classes = ControlledTextFieldStyles();
    const {allowEdit} = useProductLineDetail();
    const {setValue, watch, control, getValues} = useFormContext();
    const {append, remove} = useFieldArray({
        control: control,
        name: ProductLineFields.ListRequisitesPolicyRestrictive,
    });
    const watchedRestrictives = useWatch({
        control: control,
        name: ProductLineFields.ListRequisitesPolicyRestrictive
    });
    const [restricted, setRestricted] = useState<boolean>(!!watch(name));

    const onChangeRestricted = (newValue: boolean) => {
        if (!newValue) setValue(name, '', {shouldDirty: true});
        else removeFromPolicyRestrictive();

        setRestricted(newValue);
    };

    const removeFromPolicyRestrictive = () => {
        const values = getValues(ProductLineFields.ListRequisitesPolicyRestrictive);
        const index = values.indexOf(requisiteId);

        if (index >= 0) remove(index);
    }
    
    const onChangeRestrictivePolicy = (newValue: boolean) => {
        if (requisiteId) {
            if (newValue)
                append(requisiteId);
            else 
                removeFromPolicyRestrictive();
        }
    };

    return (
        <>
            <Grid item xs={9} alignSelf={!restricted ? 'center' : ''}>
                {restricted ? (
                    <ControlledTextFieldFilled
                        control={control}
                        label={label}
                        name={name}
                        type={!currency ? 'number' : undefined}
                        currency={currency}
                        disabled={!(restricted && allowEdit)}
                    />
                ) : (
                    <Typography className={classes.labelFilled}>{label}</Typography>
                )}
            </Grid>

            <LineProductRequisiteRadioForm
                value={restricted}
                onChange={onChangeRestricted}
                disabled={!allowEdit}
                allowRestriction={allowsRestrictivePolicy ?
                    {value: (watchedRestrictives || []).includes(requisiteId), onChange: onChangeRestrictivePolicy}
                    :
                    undefined
                }
            />
        </>
    );
}

export {
    LineProductRequisiteProvinces,
    LineProductRequisiteAmount,
    LineProductRequisiteSeniority,
    LineProductRequisiteGender,
    LineProductRequisiteClassificationSepyme,
    LineProductRequisiteActivitySector,
    LineProductRequisiteTaxCondition,
    LineProductRequisiteSocialOrEnvironmentalImpact,
    LineProductRequisiteScoringMinimum,
    LineProductRequisiteDebtSituationMaximum
};
