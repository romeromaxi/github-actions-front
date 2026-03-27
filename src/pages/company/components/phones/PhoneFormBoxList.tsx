import {Alert, Box, Button, Grid, Stack, Typography, useMediaQuery, useTheme} from '@mui/material';
import {
    AddButton,
    CheckIconButton,
    DeleteIconButton,
    EditIconButton,
    XIconButton,
} from '../../../../components/buttons/Buttons';
import * as React from 'react';
import {useState, useEffect} from 'react';
import {CompanyPhoneInsertDTO} from '../../../../types/company/companyReferentialData';
import {useFieldArray, useFormContext, useForm, useWatch} from 'react-hook-form';
import {
    EntityPhoneNumber,
    EntityPhoneNumberFields,
} from '../../../../types/general/generalReferentialData';
import ControlledTextFieldStyles from '../../../../components/forms/ControlledTextField.styles';
import {themeColorDefinition} from "../../../../util/themes/definitions";
import {TypographyBase} from "../../../../components/misc/TypographyBase";
import {ControlledAreaCodePhoneFieldFilled} from '../../../../components/forms/ControlledAreaCodePhoneField';
import {
    ControlledTextFieldFilled,
} from '../../../../components/forms';
import {EntityWithIdAndDescription} from '../../../../types/baseEntities';
import {PhoneType} from '../../../../types/general/generalEnums';
import * as yup from 'yup';
import {
    RequiredAreaCodeSchema,
    RequiredPhoneSchema,
    RequiredSelectSchema,
} from '../../../../util/validation/validationSchemas';
import {yupResolver} from '@hookform/resolvers/yup';
import {
    digitsOnly,
    validateInternationalPhone,
    formatInternationalPhoneForSummary
} from '../../../../util/validation/phoneValidation';

interface PhoneFormBoxListProps {
    phoneListName: string;
    notCompanyTab?: boolean;
    disabled?: boolean;
}

const typesOptions: EntityWithIdAndDescription[] = [
    {
        id: PhoneType.CellPhone,
        descripcion: 'Celular',
    },
    {
        id: PhoneType.Landline,
        descripcion: 'Fijo',
    },
];

const PhoneFormBoxList = ({
                              phoneListName,
                              notCompanyTab,
                              disabled,
                          }: PhoneFormBoxListProps) => {
    const classes = ControlledTextFieldStyles();

    const [showNewPhoneForm, setShowNewPhoneForm] = useState<boolean>(false);
    const [phoneToEditId, setPhoneToEditId] = useState<number>();

    const {control, setValue, watch} = useFormContext();

    const {fields, append, update, remove} = useFieldArray({
        control: control,
        name: phoneListName,
    });

    const theme = useTheme();
    const isMediumScreenSize = useMediaQuery(theme.breakpoints.up("md"));

    const phoneResolverSchema = yup.object().shape({
        [EntityPhoneNumberFields.PhoneTypeCode]: RequiredSelectSchema,
        [EntityPhoneNumberFields.AreaCode]: RequiredAreaCodeSchema,
        [EntityPhoneNumberFields.PhoneNumber]: RequiredPhoneSchema.test(
            'intl-phone',
            'Verifique teléfono',
            function (val) {
                const area = digitsOnly(this.parent?.[EntityPhoneNumberFields.AreaCode] ?? '');
                const number = digitsOnly(val ?? '');
                const res = validateInternationalPhone('54', `${area} ${number}`.trim());
                return res.ok;
            },
        ),
    });

    const {
        control: phoneFormControl,
        handleSubmit: handlePhoneSubmit,
        reset: resetPhoneForm
    } = useForm<CompanyPhoneInsertDTO>({
        defaultValues: {
            [EntityPhoneNumberFields.MainPhone]: false,
            [EntityPhoneNumberFields.PhoneNumber]: '',
            [EntityPhoneNumberFields.PhoneTypeCode]: PhoneType.CellPhone,
            [EntityPhoneNumberFields.PhoneTypeDesc]: '',
            [EntityPhoneNumberFields.AreaCode]: '',
            [EntityPhoneNumberFields.Whatsapp]: false,
        },
        resolver: yupResolver(phoneResolverSchema),
    });

    const phoneType = useWatch({
        control: phoneFormControl,
        name: EntityPhoneNumberFields.PhoneTypeCode,
        defaultValue: PhoneType.CellPhone,
    });

    const handleSubmit = (phone: CompanyPhoneInsertDTO) => {
        const sentData: CompanyPhoneInsertDTO = {
            ...phone,
            [EntityPhoneNumberFields.Whatsapp]:
                phone[EntityPhoneNumberFields.PhoneTypeCode] === PhoneType.CellPhone
                    ? phone[EntityPhoneNumberFields.Whatsapp]
                    : false,
            [EntityPhoneNumberFields.AreaCode]: digitsOnly(phone[EntityPhoneNumberFields.AreaCode] ?? ''),
            [EntityPhoneNumberFields.PhoneNumber]: digitsOnly(phone[EntityPhoneNumberFields.PhoneNumber] ?? ''),
        };

        if (phoneToEditId !== undefined) {
            update(phoneToEditId, sentData);
        } else {
            const phoneSent: CompanyPhoneInsertDTO = {
                ...sentData,
                [EntityPhoneNumberFields.MainPhone]:
                    fields.length === 0 ? true : sentData[EntityPhoneNumberFields.MainPhone],
            };
            append(phoneSent);
        }
        handleCancelForm();
    };

    const handleCancelForm = () => {
        setShowNewPhoneForm(false);
        setPhoneToEditId(undefined);
        resetPhoneForm({
            [EntityPhoneNumberFields.MainPhone]: false,
            [EntityPhoneNumberFields.PhoneNumber]: '',
            [EntityPhoneNumberFields.PhoneTypeCode]: PhoneType.CellPhone,
            [EntityPhoneNumberFields.PhoneTypeDesc]: '',
            [EntityPhoneNumberFields.AreaCode]: '',
            [EntityPhoneNumberFields.Whatsapp]: false,
        });
    };

    const handleAddNewPhone = () => {
        setShowNewPhoneForm(true);
        setPhoneToEditId(undefined);
        resetPhoneForm({
            [EntityPhoneNumberFields.MainPhone]: false,
            [EntityPhoneNumberFields.PhoneNumber]: '',
            [EntityPhoneNumberFields.PhoneTypeCode]: PhoneType.CellPhone,
            [EntityPhoneNumberFields.PhoneTypeDesc]: '',
            [EntityPhoneNumberFields.AreaCode]: '',
            [EntityPhoneNumberFields.Whatsapp]: false,
        });
    };

    useEffect(() => {
        if (phoneToEditId !== undefined) {
            const phoneToEdit = watch(`${phoneListName}.${phoneToEditId}`);
            resetPhoneForm(phoneToEdit);
            setShowNewPhoneForm(true);
        }
    }, [phoneToEditId]);

    const onChangeMain = (phone: EntityPhoneNumber, index: number) => {
        fields.forEach((_, idx) => {
            const currentPhone: EntityPhoneNumber = watch(`${phoneListName}.${idx}`);
            update(idx, {
                ...currentPhone,
                [EntityPhoneNumberFields.MainPhone]: idx === index,
            });
        });
    };

    const onEdit = (index: number) => {
        setPhoneToEditId(index);
    };

    const onRemove = (index: number) => {
        const wasMain = watch(`${phoneListName}.${index}`)[EntityPhoneNumberFields.MainPhone];
        if (fields.length > 1 && wasMain) {
            const lastPhone: EntityPhoneNumber = watch(`${phoneListName}.${fields.length - 1}`);
            if (lastPhone[EntityPhoneNumberFields.MainPhone]) {
                setValue(`${phoneListName}.${fields.length - 2}`, {
                    ...watch(`${phoneListName}.${fields.length - 2}`),
                    [EntityPhoneNumberFields.MainPhone]: true,
                });
            } else {
                setValue(`${phoneListName}.${fields.length - 1}`, {
                    ...lastPhone,
                    [EntityPhoneNumberFields.MainPhone]: true,
                });
            }
        }
        remove(index);
    };

    const getPhoneTypeDesc = (code: number) => {
        return code === 1 ? 'Celular' : 'Fijo';
    };

    const renderPhoneInfo = (idx: number) => {
        const phone = watch(`${phoneListName}.${idx}`);
        const formatted = formatInternationalPhoneForSummary(
            '54',
            `${phone[EntityPhoneNumberFields.AreaCode]}${phone[EntityPhoneNumberFields.PhoneNumber]}`,
        );
        return (
            <Stack spacing={1}>
                <Grid container alignItems="center">
                    <Grid item xs={5}>
                        <Typography className={classes.labelFilled} variant="caption">
                            Número completo:
                        </Typography>
                    </Grid>
                    <Grid item xs={7}>
                        <Typography fontSize={13} fontWeight={600}>
                            {formatted || `${phone[EntityPhoneNumberFields.AreaCode]} - ${phone[EntityPhoneNumberFields.PhoneNumber]}`}
                        </Typography>
                    </Grid>
                </Grid>
                <Grid container alignItems="center">
                    <Grid item xs={5}>
                        <Typography className={classes.labelFilled} variant="caption">
                            Whatsapp:
                        </Typography>
                    </Grid>
                    <Grid item xs={7}>
                        <Typography fontSize={13} fontWeight={600}>
                            {phone[EntityPhoneNumberFields.Whatsapp] ? 'Sí' : 'No'}
                        </Typography>
                    </Grid>
                </Grid>
                <Grid container alignItems="center">
                    <Grid item xs={5}>
                        <Typography className={classes.labelFilled} variant="caption">
                            Tipo:
                        </Typography>
                    </Grid>
                    <Grid item xs={7}>
                        <Typography fontSize={13} fontWeight={600}>
                            {getPhoneTypeDesc(phone[EntityPhoneNumberFields.PhoneTypeCode])}
                        </Typography>
                    </Grid>
                </Grid>
            </Stack>
        );
    };

    const renderActions = (idx: number) => {
        const phone = watch(`${phoneListName}.${idx}`);
        return (
            <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={1}>
                {
                    !disabled &&
                    <EditIconButton
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onEdit(idx);
                        }}
                        size="medium"
                        color="primary"
                        tooltipTitle="Editar"
                        id={"company-phone-edit-btn"}
                    />
                }
                {
                    !disabled &&
                    <DeleteIconButton
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onRemove(idx);
                        }}
                        size="medium"
                        color="primary"
                        tooltipTitle="Eliminar"
                        id={"company-phone-delete-btn"}
                    />
                }
                {!notCompanyTab &&
                    (phone[EntityPhoneNumberFields.MainPhone] ? (
                        <TypographyBase variant="body3" fontWeight={600} color="text.lighter">Teléfono
                            principal</TypographyBase>
                    ) : !disabled && (
                        <Button
                            size="small"
                            variant="outlined"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                onChangeMain(phone, idx);
                            }}
                            color="secondary"
                            id={"company-mark-phone-as-main-btn"}
                        >
                            Definir como principal
                        </Button>
                    ))}
            </Stack>
        );
    };

    return (
        <Stack spacing={isMediumScreenSize ? 3 : 2} mt={isMediumScreenSize ? 1 : 0}>
            {/* Mobile View */}
            <Box sx={{display: {xs: 'block', md: 'none'}}}>
                {fields.length === 0 && (
                    <Box sx={{width: '100%'}}>
                        <Alert severity="info">
                            No hay teléfonos cargados. Presioná "{'>'}" para añadir hasta 3
                        </Alert>
                    </Box>
                )}
                {fields.map((field, idx) => (
                    <Box
                        key={field.id}
                        sx={{
                            mb: 2,
                            pb: 2,
                            borderBottom: idx < fields.length - 1 ? '1px solid #e0e0e0' : 'none',
                        }}
                    >
                        {renderPhoneInfo(idx)}
                        {renderActions(idx)}
                    </Box>
                ))}
            </Box>

            {/* Desktop View */}
            <Box sx={{display: {xs: 'none', md: 'block'}}}>
                {
                    /*
                      <Grid container>
                        <Grid item md={4}>
                          <Typography className={classes.labelFilled}>Número completo</Typography>
                        </Grid>
                        <Grid item md={3} textAlign="center">
                          <Typography className={classes.labelFilled} textAlign="center">
                            Whatsapp
                          </Typography>
                        </Grid>
                        <Grid item md={2.5} textAlign="center">
                          <Typography className={classes.labelFilled} textAlign="center">
                            Tipo
                          </Typography>
                        </Grid>
                        <Grid item md={2.5} />
                      </Grid>
                     */
                }
                {fields.map((field, idx) => (
                    <Grid
                        container
                        alignItems="center"
                        justifyContent="space-between"
                        key={field.id}
                        mt={!!idx ? 1.25 : -0.5}
                        sx={{
                            border: `1px solid ${themeColorDefinition.UIElements.borders.tertiary}`,
                            borderRadius: '16px',
                            padding: '16px'
                        }}
                    >
                        <Grid item md={7}>
                            <TypographyBase variant="body4" color="text.lighter">
                                {`${getPhoneTypeDesc(watch(`${phoneListName}.${idx}`)[EntityPhoneNumberFields.PhoneTypeCode])} ${watch(`${phoneListName}.${idx}`)[EntityPhoneNumberFields.Whatsapp] ? ' (con Whatsapp)' : ''}`}
                            </TypographyBase>
                            <Typography fontSize={16} fontWeight={600}>
                                {formatInternationalPhoneForSummary(
                                    '54',
                                    `${watch(`${phoneListName}.${idx}`)[EntityPhoneNumberFields.AreaCode]}${watch(`${phoneListName}.${idx}`)[EntityPhoneNumberFields.PhoneNumber]}`,
                                ) || `${watch(`${phoneListName}.${idx}`)[EntityPhoneNumberFields.AreaCode]} - ${watch(`${phoneListName}.${idx}`)[EntityPhoneNumberFields.PhoneNumber]}`}
                            </Typography>
                        </Grid>
                        <Grid item md={5} textAlign="center">
                            {renderActions(idx)}
                        </Grid>
                    </Grid>
                ))}
            </Box>

            {showNewPhoneForm && (
                <Box
                    sx={{
                        p: 2,
                        border: `1px solid ${themeColorDefinition.UIElements.borders.tertiary}`,
                        borderRadius: '16px',
                    }}
                >
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={12} md={3} lg={3}>
                            <ControlledTextFieldFilled
                                select
                                control={phoneFormControl}
                                options={typesOptions}
                                name={EntityPhoneNumberFields.PhoneTypeCode}
                                defaultValue={typesOptions[0]}
                                label={'Tipo'}
                                sx={{borderColor: themeColorDefinition.UIElements.borders.tertiary}}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={7} lg={7}>
                            <ControlledAreaCodePhoneFieldFilled
                                control={phoneFormControl}
                                nameAreaCode={EntityPhoneNumberFields.AreaCode}
                                namePhoneNumber={EntityPhoneNumberFields.PhoneNumber}
                                showWhatsapp={phoneType === PhoneType.CellPhone}
                                nameWhatsapp={EntityPhoneNumberFields.Whatsapp}
                                whatsappControl={phoneFormControl}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={2} lg={2} mt={4}>
                            <Stack direction="row" alignItems={'center'} spacing={0.5} justifyContent={'flex-end'}>
                                <CheckIconButton
                                    color="primary"
                                    size="medium"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        handlePhoneSubmit(handleSubmit)(e);
                                    }}
                                    tooltipTitle="Confirmar"
                                />
                                <XIconButton
                                    size="medium"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        handleCancelForm();
                                    }}
                                    tooltipTitle="Cancelar"
                                />
                            </Stack>
                        </Grid>
                    </Grid>
                </Box>
            )}

            {
                !fields.length && !!disabled && (
                    <TypographyBase variant={'subtitle1'} 
                                    color={'text.lighter'}
                                    mt={'0rem !important'}
                    >
                        No hay teléfonos cargados
                    </TypographyBase>
                )
            }

            {fields.length < 3 && !disabled && !showNewPhoneForm && (
                <AddButton
                    variant="text"
                    color="primary"
                    fullWidth
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleAddNewPhone();
                    }}
                >
                    Agregar nuevo teléfono
                </AddButton>
            )}
        </Stack>
    );
};

export default PhoneFormBoxList;
