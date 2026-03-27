import React, {useEffect, useState} from "react";
import {HttpSolicitationAccess} from "../../../http/solicitations/httpSolicitationAccess";
import {
    SolicitationAccessResult,
    SolicitationAccessResultData,
    SolicitationAccessResultFields, SolicitationAccessStateViewDTO, SolicitationAccessStateViewDTOFields
} from "../../../types/solicitations/solicitationData";
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
import {Skeleton} from "@mui/lab";
import {ControlledTextFieldFilled} from "../../../components/forms";
import {useForm} from "react-hook-form";
import {SolicitationAccessStateTypeCodes} from "../../../types/solicitations/solicitationEnums";
import {DataWithLabel} from "../../../components/misc/DataWithLabel";
import {SendButton} from "../../../components/buttons/Buttons";
import useAxios from "../../../hooks/useAxios";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import {HttpCacheSolicitation} from "../../../http";
import {EntityWithIdAndDescriptionFields, EntityWithIdFields} from "../../../types/baseEntities";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import {getBaseColor} from "../../../util/typification/generalColors";
import {EnumColors} from "../../../types/general/generalEnums";
import ErrorIcon from "@mui/icons-material/Error";

interface SharedSolicitationGuidAnalysisProps {
    guid: string
}

const SharedSolicitationGuidAnalysis = ({guid}: SharedSolicitationGuidAnalysisProps) => {
    const [formerData, setFormerData] = useState<SolicitationAccessResult>()
    const [value, setValue] = useState<number>()
    const [opts, setOpts] = useState<SolicitationAccessStateViewDTO[]>()
    const {fetchData} = useAxios()
    
    const { control, handleSubmit } = useForm<SolicitationAccessResultData>()
    
    const loadData = () => HttpSolicitationAccess.getDataAccess(guid).then((r) => setFormerData(r))
    
    useEffect(() => {
        loadData()
        HttpCacheSolicitation.getExternalSolicitationStatuses().then((r) => setOpts(r))
    }, [guid]);

    const handleAssignValue = (
        event: React.MouseEvent<HTMLElement>,
        newValue: number,
    ) => {
        setValue(newValue);
    };
    
    const onSubmit = (data: SolicitationAccessResultData) => {
        if (value) {
            const submitData = {
                ...data,
                [SolicitationAccessResultFields.SolicitationAccessStateCode]: value,
            }
            
            fetchData(
                () => HttpSolicitationAccess.setDataAccess(guid, submitData),
                true
            ).then(() => loadData())
        }
    }
    
    return (
        <Card>
            <CardContent>
                    {
                        formerData ? 
                            formerData[SolicitationAccessResultFields.HasDefinedResult] ? 
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <Typography fontSize={18} textAlign={'center'} fontWeight={600}>
                                            {formerData[SolicitationAccessResultFields.SolicitationAccessStateCode] === SolicitationAccessStateTypeCodes.Interested ?
                                                'Ya contestaste esta solicitud diciendo que estás interesado.'
                                                :
                                                'Ya contestaste esta solicitud diciendo que no estás interesado.'
                                            }
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} textAlign="center">
                                        <Box sx={{ maxWidth: '500px' }} />
                                        {formerData[SolicitationAccessResultFields.SolicitationAccessStateCode] === SolicitationAccessStateTypeCodes.Interested ? (
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
                                    
                                    <Grid item md={12}>
                                        <ToggleButtonGroup
                                            color={'primary'}
                                            value={formerData[SolicitationAccessResultFields.SolicitationAccessStateCode]}
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
                                                       data={formerData[SolicitationAccessResultFields.SolicitationAccessObservations] || '-'}
                                                       rowDirection
                                        />
                                    </Grid>
                                                   
                                </Grid>
                                :
                                <Stack spacing={2}>
                                    <Typography fontSize={15} textAlign={'center'}>
                                        ¿Te interesa que la empresa te contacte por esta solicitud?
                                    </Typography>
                                    <ToggleButtonGroup
                                        color={'primary'}
                                        value={value}
                                        exclusive
                                        size='large'
                                        onChange={handleAssignValue}
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
                                    <ControlledTextFieldFilled control={control} name={SolicitationAccessResultFields.SolicitationAccessObservations}
                                                               label={'Observaciones'}
                                                               rows={4}
                                                               multiline
                                                               fullWidth
                                    />
                                    <Stack direction={'row-reverse'}>
                                        <SendButton size='small' onClick={handleSubmit(onSubmit)} disabled={!value}>Enviar respuesta</SendButton>
                                    </Stack>
                                </Stack>
                            :
                            <Skeleton height={50}/>
                    }
            </CardContent>
        </Card>
    )
}


export default SharedSolicitationGuidAnalysis