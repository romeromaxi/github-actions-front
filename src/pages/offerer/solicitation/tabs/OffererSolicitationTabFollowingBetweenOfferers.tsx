import {
    Box,
    Card,
    CardContent,
    CardHeader,
    Grid,
    Stack,
    ToggleButton,
    ToggleButtonGroup,
    Typography
} from "@mui/material";
import {OffererSolicitationCompanyHeaderOld} from "../components/OffererSolicitationCompanyHeader";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import {ControlledTextFieldFilled} from "../../../../components/forms";
import {SendButton} from "../../../../components/buttons/Buttons";
import React, {useEffect, useMemo, useState} from "react";
import {useForm} from "react-hook-form";
import {
    ActionExecute,
    ActionExecuteFields,
    VariableWorkflow,
    VariableWorkflowFields
} from "../../../../types/workflow/actionData";
import useAxios from "../../../../hooks/useAxios";
import {HttpAction, HttpCacheSolicitation} from "../../../../http";
import {useSolicitation} from "../../../../hooks/contexts/SolicitationsContext";
import {EntityWithIdAndDescriptionFields, EntityWithIdFields} from "../../../../types/baseEntities";
import {
    SolicitationAccessStateViewDTO,
    SolicitationAccessStateViewDTOFields, SolicitationViewDTOFields
} from "../../../../types/solicitations/solicitationData";
import {Alert, Skeleton} from "@mui/lab";
import {HttpSolicitationDerivation} from "../../../../http/solicitations/httpSolicitationDerivation";
import {
    SolicitationDerivationResultView,
    SolicitationDerivationResultViewFields
} from "../../../../types/solicitations/solicitationDocumentationAnalysisData";
import {SolicitationAccessStateTypeCodes} from "../../../../types/solicitations/solicitationEnums";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import ErrorIcon from "@mui/icons-material/Error";
import {getBaseColor} from "../../../../util/typification/generalColors";
import {EnumColors} from "../../../../types/general/generalEnums";
import {DataWithLabel} from "../../../../components/misc/DataWithLabel";

interface OffererSolicitationTabFollowingBetweenOfferersProps {
    offererBase: boolean;
}

const OffererSolicitationTabFollowingBetweenOfferers = ({ offererBase } : OffererSolicitationTabFollowingBetweenOfferersProps) => {
    
    return (
        <Stack spacing={1}>
            <OffererSolicitationCompanyHeaderOld />
            <OffererSolicitationFollowingBetweenOfferersForm offererBase={offererBase}/>
        </Stack>
    )
}

export default OffererSolicitationTabFollowingBetweenOfferers

const OffererSolicitationFollowingBetweenOfferersForm = ({offererBase} : OffererSolicitationTabFollowingBetweenOfferersProps) => {
    const [opts, setOpts] = useState<SolicitationAccessStateViewDTO[]>()
    const [value, setValue] = useState<number>()
    const {control, handleSubmit} = useForm<ActionExecute>()
    const { fetchData } = useAxios()
    const { message, solicitation, isStageResponsible } = useSolicitation()
    const [results, setResults] = useState<SolicitationDerivationResultView>()
    const messageResult = useMemo(() => {
        if (!results || !results[SolicitationDerivationResultViewFields.HasDefinedResult])
            return '';
        
        if (results[SolicitationDerivationResultViewFields.AccessStateSolicitationCode] === SolicitationAccessStateTypeCodes.Interested) 
            return !offererBase ? 'Ya te contestaron esta consulta de derivación diciendo que está interesado.' : 'Ya contestaste esta consulta de derivación diciendo que estás interesado.'
        else
            return !offererBase ? 'Ya te contestaron esta consulta de derivación diciendo que está no interesado.' : 'Ya contestaste esta consulta de derivación diciendo que no estás interesado.'
    }, [results, offererBase]);

    const loadResults = () => {
        if (solicitation) HttpSolicitationDerivation.getDerivationResults(solicitation[EntityWithIdFields.Id]).then(setResults)
    }
    
    useEffect(() => {
        loadResults()
        HttpCacheSolicitation.getExternalSolicitationStatuses().then(setOpts)
    }, []);
    const onSubmit = (data: ActionExecute) => {
        const submitData: ActionExecute = {
            [ActionExecuteFields.MessageId]: message?.[EntityWithIdFields.Id] || 0,
            [ActionExecuteFields.WorkflowVariables]: [
                {
                    [VariableWorkflowFields.Name]: 'vchObservaciones',
                    [VariableWorkflowFields.StringValue]: data[ActionExecuteFields.Observations]
                } as VariableWorkflow,
            ]
        }
        
        fetchData(
            () => HttpAction.executeAction(value ?? 0, submitData),
            true
        ).then((r) => {
            loadResults()
        })
    }

    const handleAssignValue = (
        event: React.MouseEvent<HTMLElement>,
        newValue: number,
    ) => {
        setValue(newValue);
    };
    
    return (
        <Card>
            <CardHeader title='Consulta de derivación'/>
            <CardContent>
                    {
                        results && results[SolicitationDerivationResultViewFields.HasDefinedResult] ?
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Typography fontSize={18} textAlign={'center'} fontWeight={600}>
                                        {messageResult}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} textAlign="center">
                                    <Box sx={{ maxWidth: '500px' }} />
                                    {results[SolicitationDerivationResultViewFields.AccessStateSolicitationCode] === SolicitationAccessStateTypeCodes.Interested ? (
                                        <CheckCircleRoundedIcon
                                            sx={{
                                                userSelect: 'none',
                                                width: '1em',
                                                height: '1em',
                                                display: 'inline-block',
                                                flexShrink: 0,
                                                transition: 'fill 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
                                                fontSize: '100px',
                                                marginBottom: '16px',
                                                color: '#4DAB2B',
                                            }}
                                        />
                                    ) : (
                                        <ErrorIcon
                                            sx={{
                                                userSelect: 'none',
                                                width: '1em',
                                                height: '1em',
                                                display: 'inline-block',
                                                flexShrink: 0,
                                                transition: 'fill 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
                                                fontSize: '100px',
                                                marginBottom: '16px',
                                                color: getBaseColor(EnumColors.RED),
                                            }}
                                        />
                                    )}
                                </Grid>

                                <Grid item md={12} sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                    <ToggleButtonGroup
                                        color={'primary'}
                                        value={results[SolicitationDerivationResultViewFields.AccessStateSolicitationCode]}
                                        exclusive
                                        size='large'
                                        disabled
                                        sx={{ justifyContent: 'center', textAlign: 'center' }}
                                    >
                                        {
                                            !!opts && opts.length !== 0 ?
                                                opts.map((o) =>
                                                    <ToggleButton value={o[EntityWithIdFields.Id]} color={o[SolicitationAccessStateViewDTOFields.PositiveState] ? 'success' : 'error'}>
                                                        <Stack direction={'row'} alignItems={'center'} spacing={1}>
                                                            <Stack>
                                                                <Typography fontSize={17} fontWeight={700}>{o[EntityWithIdAndDescriptionFields.Description]}</Typography>
                                                                <Typography fontSize={12} fontWeight={500}>{o[SolicitationAccessStateViewDTOFields.Detail]}</Typography>
                                                            </Stack>
                                                            {o[SolicitationAccessStateViewDTOFields.PositiveState] ? <CheckIcon /> : <CloseIcon />}
                                                        </Stack>
                                                    </ToggleButton>
                                                )
                                                :
                                                <>
                                                    <Skeleton />
                                                    <Skeleton />
                                                </>
                                        }
                                    </ToggleButtonGroup>
                                </Grid>
                                <Grid item md={12}>
                                    <DataWithLabel label={'Observaciones'}
                                                   data={results[SolicitationDerivationResultViewFields.AccessStateObservations] ?? '-'}
                                                   rowDirection
                                    />
                                </Grid>

                            </Grid>
                            :
                            offererBase ?
                                <Stack spacing={2}>
                                    <Typography>
                                        {`¿Querés que ${solicitation?.[SolicitationViewDTOFields.IntermediaryOffererBusinessName]} te derive esta solicitud?
                                        Si tanto vos como la MiPyME aceptan se creará una nueva solicitud entre ustedes para que continúen con el proceso.`}
                                    </Typography>
                                    <ToggleButtonGroup
                                        color={'primary'}
                                        value={value}
                                        exclusive
                                        size='large'
                                        onChange={handleAssignValue}
                                        sx={{ justifyContent: 'center', textAlign: 'center' }}
                                        disabled={!isStageResponsible}
                                    >
                                        {
                                            !!opts && opts.length !== 0 ?
                                                opts.map((o) =>
                                                    <ToggleButton value={o[SolicitationAccessStateViewDTOFields.ActionId]} color={o[SolicitationAccessStateViewDTOFields.PositiveState] ? 'success' : 'error'}>
                                                        <Stack direction={'row'} alignItems={'center'} spacing={1}>
                                                            <Stack>
                                                                <Typography fontSize={17} fontWeight={700}>{o[EntityWithIdAndDescriptionFields.Description]}</Typography>
                                                                <Typography fontSize={12} fontWeight={500}>{o[SolicitationAccessStateViewDTOFields.Detail]}</Typography>
                                                            </Stack>
                                                            {o[SolicitationAccessStateViewDTOFields.PositiveState] ? <CheckIcon /> : <CloseIcon />}
                                                        </Stack>
                                                    </ToggleButton>
                                                )
                                                :
                                                <>
                                                    <Skeleton />
                                                    <Skeleton />
                                                </>
                                        }
                                    </ToggleButtonGroup>
                                    <ControlledTextFieldFilled control={control} name={ActionExecuteFields.Observations}
                                                               label={'Observaciones'}
                                                               rows={4}
                                                               multiline
                                                               fullWidth
                                                               disabled={!isStageResponsible}
                                    />
                                    <Stack direction={'row-reverse'}>
                                        <SendButton size='small' onClick={handleSubmit(onSubmit)}
                                                    disabled={!value || !isStageResponsible}>
                                            Enviar respuesta
                                        </SendButton>
                                    </Stack>
                                </Stack>
                                :
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <Alert severity={'info'} color={'info'}>
                                            Por el momento no se recibió una respuesta
                                        </Alert>
                                    </Grid>
                                </Grid>
                    }
            </CardContent>
        </Card>
    )
}