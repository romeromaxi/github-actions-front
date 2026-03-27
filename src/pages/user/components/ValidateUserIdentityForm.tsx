import {
    Box, Button,
    DialogActions,
    FormControlLabel,
    Grid, Radio,
    RadioGroup, Stack, Tooltip, Typography,
} from "@mui/material";
import {AsyncSelect, ControlledTextFieldFilled} from "../../../components/forms";
import {
    BaseQueryResultFields, UserModelView,
    UserModelViewFields, UserValidateIdentityPublicBases,
    UserValidateIdentityPublicBasesFields,
    ValidationQueryResultFields, ValidationQuestionary
} from "../../../types/user";
import {HttpCachePerson, HttpUser} from "../../../http";
import React, {ChangeEvent, useEffect, useState} from "react";
import {userStorage} from "../../../util/localStorage/userStorage";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import * as yup from "yup";
import {RequiredDateSchema, RequiredSelectSchema} from "../../../util/validation/validationSchemas";
import {ControlledDatePicker} from "../../../components/forms/ControlledDatePicker";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import {TypographyBase} from "../../../components/misc/TypographyBase";
import {WrapperIcons} from "../../../components/icons/Icons";
import LabelFormBase from "../../../components/forms/LabelFormBase";
import {UserRound} from "lucide-react";
import {useLoaderActions} from "hooks/useLoaderActions";
import {useSnackbarActions} from "hooks/useSnackbarActions";


interface ValidateUserIdentityFormProps {
    afterSubmit: (queryId: number, reqEval: boolean, appliesQuest: boolean, questionary: ValidationQuestionary[], cuit?: string) => void,
    wrappedBack?: () => void,
    backLabel?: string,
    waitBackgroundProcessing?: boolean
}

const ValidationUserIdentityForm = ({
                                        afterSubmit, wrappedBack, backLabel = 'Volver', waitBackgroundProcessing = false
} : ValidateUserIdentityFormProps) => {
    const [userDetails, setUserDetails] = useState<UserModelView>();
    const [userSex, setUserSex] = useState<string>( '')
    const [hasProcess, setHasProcess] = useState();
    const username = userStorage.getFullName()
    const { showLoader, hideLoader } = useLoaderActions();
    const { addSnackbarError } = useSnackbarActions();
    const formattedName = (name: string) =>
        name
            .split(' ')
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toUpperCase())
            .join(' ');
    const formatName = () => {
        if (!username) {
            return 'Usuario Desconocido';
        }

        const parts = username.toUpperCase().split(', ');
        if (parts.length === 2) {
            const [surname, newName] = parts;
            const surnameFormatted = formattedName(surname || '');
            const nameFormatted = formattedName(newName || '');
            return `${nameFormatted} ${surnameFormatted}`;
        }


        return formattedName(username);
    }

    const validateUserSchema = yup.object().shape({
        [UserValidateIdentityPublicBasesFields.Sex]: RequiredSelectSchema,
        [UserValidateIdentityPublicBasesFields.BirthDate]: RequiredDateSchema,
        [UserValidateIdentityPublicBasesFields.ProcessIdNumber]: yup.string()
            .matches(/^\d*$/, 'Este campo solo puede contener dígitos')
            .test(
                'length',
                'No puede contener más de 11 dígitos',
                (value) => !value || value.length <= 11
            )
    });
    const { control,
        reset,
        getValues,
        watch,
        handleSubmit,
        setValue
    } =
        useForm<UserValidateIdentityPublicBases>({
            defaultValues: {
                [UserValidateIdentityPublicBasesFields.Document]: userDetails?.[UserModelViewFields.DocumentNumber],
                [UserValidateIdentityPublicBasesFields.BusinessName]: formatName()
            },
            resolver: yupResolver(validateUserSchema),
        });

    const watchSex = watch(UserValidateIdentityPublicBasesFields.Sex)

    useEffect(() => {
        if (parseInt(watchSex) === 1) setUserSex('M')
        else if (parseInt(watchSex) === 2) setUserSex('F')
        else setUserSex('X')
    }, [watchSex]);

    useEffect(() => {
        HttpUser.getUserDataLogged().then((r) => {
            setUserDetails(r);
            reset({
                ...getValues(),
                [UserValidateIdentityPublicBasesFields.Document]: r[UserModelViewFields.DocumentNumber],
            });
        });
    }, []);

    const onValidate = (data: UserValidateIdentityPublicBases) => {
        showLoader();
        
        const submitData: UserValidateIdentityPublicBases = {
            ...data,
            [UserValidateIdentityPublicBasesFields.BusinessName]: formatName(),
            [UserValidateIdentityPublicBasesFields.Sex]: userSex,
            [UserValidateIdentityPublicBasesFields.WaitBackgroundProcessing]: waitBackgroundProcessing
        }
        
        HttpUser.validateIdentityNosis(submitData).then((r) => {
            if (r[BaseQueryResultFields.IsValid]) {
                afterSubmit(r[BaseQueryResultFields.QueryId], r[ValidationQueryResultFields.RequiresEvaluation], r[ValidationQueryResultFields.AppliesQuestionary],
                            r[ValidationQueryResultFields.Questionary], userDetails?.[UserModelViewFields.CUIT])
                hideLoader()
            } else {
                hideLoader()
                addSnackbarError(r[BaseQueryResultFields.StateDescription])
            }
        });
    };

    const watchProcessId = watch(UserValidateIdentityPublicBasesFields.ProcessIdNumber)
    
    const handleChangeProcess = (event: ChangeEvent<HTMLInputElement>) => {
        const processResponse = (event.target as HTMLInputElement).value
        setHasProcess(processResponse);
        if (processResponse === 'no') setValue(UserValidateIdentityPublicBasesFields.ProcessIdNumber, undefined)
    };

    const getProcedureNumberLabel = () =>
        <Stack direction='row' alignItems='center' spacing={1}>
            <LabelFormBase label={"Número de trámite"} />
            
            <Tooltip title={'Ingresar los 11 primeros dígitos. En el DNI tarjeta, se encuentra en la parte frontal debajo de la fecha de vencimiento. ' +
                'En otros DNI, en el reverso del documento, justo por encima de la firma del ministro del Interior.'}>
                <HelpOutlineIcon fontSize={'small'} color={'info'} />
            </Tooltip>
        </Stack>
    
    return (
        <Stack spacing={4}>
            <Stack spacing={0.75}>
                <TypographyBase variant="eyebrow2" color="primary">VERIFICACIÓN DE IDENTIDAD</TypographyBase>
                <Typography variant="h4">Para tener acceso a todas las funciones de LUC, necesitamos verificar tu identidad</Typography>
                <Typography variant="body2" color="text.lighter">Necesitamos esto para proteger tus datos.</Typography>
            </Stack>
            
            <form onSubmit={handleSubmit(onValidate)}>
                    <Grid container spacing={4}>
                        {
                            /*
                                <Grid item xs={12} md={6}>
                                    <AsyncSelect
                                        control={control}
                                        fullWidth
                                        name={UserValidateIdentityRequestFields.DocumentTypeCode}
                                        label={'Tipo de Documento'}
                                        loadOptions={HttpCachePerson.getDocumentTypes}
                                        autoSelect
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <ControlledTextFieldFilled control={control}
                                                               fullWidth
                                                               disabled
                                                               label={'Nombre Completo'}
                                                               name={UserValidateIdentityPublicBasesFields.BusinessName}
                                                               defaultValue={formatName()}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <ControlledTextFieldFilled
                                        control={control}
                                        fullWidth
                                        name={UserValidateIdentityPublicBasesFields.Document}
                                        label={'Número de Documento'}
                                        defaultValue={userDetails?.[UserModelViewFields.DocumentNumber]}
                                        disabled
                                    />
                                </Grid>
                             */
                        }
                        <Grid item xs={12}>
                            <Stack direction="row" alignItems="center" spacing={2}>
                                <Box sx={{backgroundColor: '#E1F3D6', width: '56px', height: '56px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                    <WrapperIcons Icon={UserRound} size={'lg'} color={'#5A9437'}/>
                                </Box>
                                <Stack spacing={0.75}>
                                    <Typography variant="h4" color="primary">{userDetails?.[UserModelViewFields.UserName]}</Typography>
                                    <Typography color="text.tertiary" fontSize={16}>{`DNI ${userDetails?.[UserModelViewFields.DocumentNumber]}`}</Typography>
                                </Stack>
                            </Stack>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <AsyncSelect
                                control={control}
                                fullWidth
                                name={UserValidateIdentityPublicBasesFields.Sex}
                                label={'Sexo según tu documento'}
                                loadOptions={HttpCachePerson.getGenderTypes}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <ControlledDatePicker control={control}
                                                  name={UserValidateIdentityPublicBasesFields.BirthDate}
                                                  label={'Fecha de nacimiento'}
                                                  filled
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <RadioGroup aria-labelledby="demo-controlled-radio-buttons-group" 
                                        name="controlled-radio-buttons-group" 
                                        value={hasProcess} 
                                        onChange={handleChangeProcess} 
                                        sx={{ 
                                            display: 'flex', 
                                            flexDirection: 'column',
                                            gap: 1,
                                            width: '100%',
                                        }}
                            >
                                <FormControlLabel 
                                    value="si" 
                                    control={<Radio size="medium" />}
                                    label="Verificar mi identidad con número de trámite de mi DNI"
                                    sx={{ m: 0 }}
                                    slotProps={{
                                        typography: {
                                            sx: {
                                                fontFamily: 'Geist',
                                                fontSize: 14,
                                                color: 'black',
                                                fontWeight: 500,
                                            },
                                        },
                                    }}
                                />
                                <FormControlLabel 
                                    value="no"
                                    control={<Radio size="medium" />} 
                                    label="Verificar mi identidad con un breve cuestionario"
                                    sx={{ m: 0 }}
                                    slotProps={{
                                        typography: {
                                            sx: {
                                                fontFamily: 'Geist',
                                                fontSize: 14,
                                                color: 'black',
                                                fontWeight: 500,
                                            },
                                        },
                                    }}
                                />
                            </RadioGroup>
                        </Grid>
                        {
                            hasProcess === 'si' &&
                            <Grid item xs={12} md={6}>
                                <ControlledTextFieldFilled
                                    control={control}
                                    fullWidth
                                    name={UserValidateIdentityPublicBasesFields.ProcessIdNumber}
                                    label={getProcedureNumberLabel()}
                                    inputProps={{ maxlength: 11 }}
                                />
                            </Grid>
                        }
                    </Grid>
    
                <DialogActions sx={{ 
                    flexDirection: { xs: 'column-reverse', sm: 'row' },
                    gap: { xs: 2, sm: 1 },
                    mt: 4,
                    alignItems: 'center',
                    justifyContent: wrappedBack ? 'space-between' : 'flex-end'
                }}>
                    {wrappedBack && (
                        <Button
                            onClick={wrappedBack}
                            variant="text"
                            sx={{ width: { xs: '100%', sm: 'auto' } }}
                        >
                            {backLabel}
                        </Button>
                    )}
                    <Button type={'submit'}
                            variant="contained"
                            disabled={!hasProcess || (hasProcess === 'si' && !watchProcessId)} 
                            sx={{ width: { xs: '100%', sm: 'auto' } }}
                    >
                        Continuar
                    </Button>
                </DialogActions>
            </form>
        </Stack>
    )
}


export default ValidationUserIdentityForm