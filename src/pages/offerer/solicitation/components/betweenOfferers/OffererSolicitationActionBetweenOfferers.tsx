import {Fragment, useEffect, useState} from "react";
import {Button, Skeleton, Stack} from "@mui/material";
import {
    SolicitationDerivationResultView,
    SolicitationDerivationResultViewFields
} from "types/solicitations/solicitationDocumentationAnalysisData";
import {HttpSolicitationDerivation} from "http/solicitations/httpSolicitationDerivation";
import {EntityWithIdAndDescriptionFields, EntityWithIdFields} from "types/baseEntities";
import {HttpAction, HttpCacheSolicitation} from "http/index";
import {
    SolicitationAccessStateViewDTO,
    SolicitationAccessStateViewDTOFields,
    SolicitationViewDTO,
    SolicitationViewDTOFields
} from "types/solicitations/solicitationData";
import {useSolicitation} from "hooks/contexts/SolicitationsContext";
import {SolicitationAccessStateTypeCodes} from "types/solicitations/solicitationEnums";
import {themeColorDefinition} from "util/themes/definitions";
import {TypographyBase} from "components/misc/TypographyBase";
import {CheckIcon, XIcon} from "lucide-react";
import {dateFormatter} from "util/formatters/dateFormatter";
import {useAppNavigation} from "hooks/navigation";
import {OffererRoute} from "routes/offerer/routeAppOffererData";
import OffererSolicitationAssignmentActionWrapper, {
    OffererSolicitationAssignmentActionVariant
} from "../assignment/OffererSolicitationAssignmentActionWrapper";
import {ActionExecute, ActionExecuteFields, VariableWorkflow, VariableWorkflowFields} from "types/workflow/actionData";
import useAxios from "hooks/useAxios";

function OffererSolicitationActionBetweenOfferers() {
    const { fetchData } = useAxios();
    const {solicitation, message, reloadSolicitation, loadingSolicitation, offererBase} = useSolicitation();
    const [results, setResults] = useState<SolicitationDerivationResultView>();
    
    const loadResults = () => {
        if (solicitation) HttpSolicitationDerivation.getDerivationResults(solicitation[EntityWithIdFields.Id]).then(setResults)
    }

    const onSubmitResult = (value: number) => {
        const submitData: ActionExecute = {
            [ActionExecuteFields.MessageId]: message?.[EntityWithIdFields.Id] || 0,
            [ActionExecuteFields.WorkflowVariables]: [
                {
                    [VariableWorkflowFields.Name]: 'vchObservaciones',
                    [VariableWorkflowFields.StringValue]: ''
                } as VariableWorkflow,
            ]
        }

        fetchData(
            () => HttpAction.executeAction(value ?? 0, submitData),
            true
        ).then((r) => {
            reloadSolicitation(true)
        })
    }
    
    useEffect(() => {
        loadResults()
    }, []);
    
    return (
        <Stack direction={{xs: 'column', md: 'row'}}
               spacing={3}
               padding={3}
               borderRadius={4}
               justifyContent={'space-between'}
               alignItems={'center'}
               sx={{
                   backgroundColor: themeColorDefinition.UIElements.backgrounds.primary,
                   border: `1px solid ${themeColorDefinition.UIElements.borders.primary}`
               }}
        >
            {
                (loadingSolicitation || !results || !solicitation) ?
                    <Skeleton variant={'text'}
                              height={'fit-content'}
                              width={'100%'}
                              sx={{ minWidth: '100px' }}
                    />
                    :
                    offererBase ?
                        <OffererSolicitationActionBetweenOfferersBase solicitation={solicitation}
                                                                      results={results}
                                                                      onSubmitResult={onSubmitResult}
                        />
                        :
                        <OffererSolicitationActionBetweenOfferersIntermediary solicitation={solicitation}
                                                                              results={results}
                        />
            }
        </Stack>
    )
}

interface OffererSolicitationActionBetweenOfferersChildrenProps {
    results: SolicitationDerivationResultView,
    solicitation: SolicitationViewDTO
}

interface OffererSolicitationActionBetweenOfferersBaseProps extends OffererSolicitationActionBetweenOfferersChildrenProps {
    onSubmitResult: (value: number) => void
}

function OffererSolicitationActionBetweenOfferersBase({ results, solicitation, onSubmitResult }: OffererSolicitationActionBetweenOfferersBaseProps) {
    const { navigate } = useAppNavigation();
    const [optionsAction, setOptionsAction] = useState<SolicitationAccessStateViewDTO[]>()

    const navigateToResultSolicitation = (resultId: number) =>
        navigate(
            OffererRoute.OffererSolicitationDetail,
            { solicitationId: resultId as number },
            undefined,
            { replace: true }
        );

    const ResultSolicitationButtonComponent = () => (
        !!results[SolicitationDerivationResultViewFields.SolicitationIdPlatformDerivation] ?
            <Button variant={'contained'}
                    color={'primary'}
                    onClick={() => navigateToResultSolicitation(results[SolicitationDerivationResultViewFields.SolicitationIdPlatformDerivation] || 0)}
            >
                Ver solicitud
            </Button>
            :
            <Fragment />
    )
    
    useEffect(() => {
        if (!optionsAction) 
            HttpCacheSolicitation.getExternalSolicitationStatuses().then(setOptionsAction)
    }, []);
    
    if (!results[SolicitationDerivationResultViewFields.HasDefinedResult])
        return (
            <Fragment>
                <Stack spacing={0.5}>
                    <TypographyBase variant={'button1'}>
                        ¿Deseas aceptar esta derivación?
                    </TypographyBase>
                    <TypographyBase variant={'body2'} color={'text.lighter'}>
                        Si crees que tenés opciones de financiamiento para este cliente, crea una solicitud para iniciar una conversación.
                    </TypographyBase>
                </Stack>

                <Stack direction={{ xs: 'column', sm: 'row-reverse' }}
                       spacing={2}
                >
                    {
                        !!optionsAction && !!optionsAction.length ?
                            optionsAction.map((o, idx) => (
                                <OffererSolicitationAssignmentActionWrapper variant={OffererSolicitationAssignmentActionVariant.Stage}
                                                                            key={`offererSolicitationAssignmentActionWrapper_${idx}`}
                                >
                                    <Button variant={o[SolicitationAccessStateViewDTOFields.PositiveState] ? 'contained' : 'outlined'}
                                            color={o[SolicitationAccessStateViewDTOFields.PositiveState] ? 'primary' : 'error'}
                                            startIcon={o[SolicitationAccessStateViewDTOFields.PositiveState] ? <CheckIcon /> : <XIcon />}
                                            onClick={() => onSubmitResult(o[SolicitationAccessStateViewDTOFields.ActionId])}
                                    >
                                        {o[EntityWithIdAndDescriptionFields.Description]}
                                    </Button>
                                </OffererSolicitationAssignmentActionWrapper>
                            ))
                            :
                            <Skeleton variant={'text'}
                                      height={'fit-content'}
                                      width={'100%'}
                                      sx={{ minWidth: '100px' }}
                            />
                    }
                </Stack>
            </Fragment>
        )
    
    if (results[SolicitationDerivationResultViewFields.AccessStateSolicitationCode] === SolicitationAccessStateTypeCodes.NotInterested)
        return (
            <Stack spacing={0.5}>
                <TypographyBase variant={'button1'} color={'error.strong'}>
                    Rechazaste esta derivación
                </TypographyBase>
                <TypographyBase variant={'body2'} color={'text.lighter'}>
                    {
                        `Esta derivación fue rechazada 
                                    ${results[SolicitationDerivationResultViewFields.LastModifiedDate] ?
                            `el ${dateFormatter.toShortDate(results[SolicitationDerivationResultViewFields.LastModifiedDate])}`
                            : ''
                        }
                                    ${results[SolicitationDerivationResultViewFields.LastModifiedUserBusinessName] ?
                            `por ${results[SolicitationDerivationResultViewFields.LastModifiedUserBusinessName]}`
                            : ''
                        }
                                `}
                </TypographyBase>
            </Stack>
        )
    
    return (
        !results[SolicitationDerivationResultViewFields.SolicitationIdPlatformDerivation] ?
            <Stack spacing={0.5}>
                <TypographyBase variant={'button1'} color={'text.lighter'}>
                    {`Esperando aprobación de la derivación por parte de ${solicitation?.[SolicitationViewDTOFields.IntermediaryOffererBusinessName]}`}
                </TypographyBase>
                <TypographyBase variant={'body2'} color={'text.lighter'}>
                    {`Aceptaste esta derivación. Una vez que ${solicitation?.[SolicitationViewDTOFields.IntermediaryOffererBusinessName]} la apruebe se iniciará una solicitud instantaneamente`}
                </TypographyBase>
            </Stack>
            :
            <Fragment>
                <Stack spacing={0.5}>
                    <TypographyBase variant={'button1'} color={'text.lighter'}>
                        {`${solicitation?.[SolicitationViewDTOFields.IntermediaryOffererBusinessName]} aprobó la derivación`}
                    </TypographyBase>
                    <TypographyBase variant={'body2'} color={'text.lighter'}>
                        {`Aceptaste esta derivación, y ${solicitation?.[SolicitationViewDTOFields.IntermediaryOffererBusinessName]} ya inició la solicitud correspondiente`}
                    </TypographyBase>
                </Stack>

                <Stack>
                    <ResultSolicitationButtonComponent />
                </Stack>
            </Fragment>
    )
}

function OffererSolicitationActionBetweenOfferersIntermediary({ results, solicitation }: OffererSolicitationActionBetweenOfferersChildrenProps) {
    const { navigate } = useAppNavigation();

    const navigateToOriginSolicitation = () =>
        navigate(
            OffererRoute.OffererSolicitationDetail,
            { solicitationId: solicitation[SolicitationViewDTOFields.OriginSolicitationId] as number },
            undefined,
            { replace: true }
        );
    
    const OriginSolicitationButtonComponent = () => (
        <Fragment />
        /*<Button variant={'contained'}
                color={'primary'}
                onClick={navigateToOriginSolicitation}
        >
            Ver solicitud
        </Button>*/
    )
    
    if (!results[SolicitationDerivationResultViewFields.HasDefinedResult])
        return (
            <Fragment>
                <Stack spacing={0.5}>
                    <TypographyBase variant={'button1'} color={'text.lighter'}>
                        {`Esperando aprobación de la derivación por parte de ${solicitation[SolicitationViewDTOFields.OffererBusinessName]}`}
                    </TypographyBase>
                </Stack>

                <Stack direction={{ xs: 'column', sm: 'row-reverse' }}
                       spacing={2}
                >
                    <OriginSolicitationButtonComponent />
                </Stack>
            </Fragment>
        )

    if (results[SolicitationDerivationResultViewFields.AccessStateSolicitationCode] === SolicitationAccessStateTypeCodes.NotInterested)
        return (
            <Stack spacing={0.5}>
                <TypographyBase variant={'button1'} color={'error.strong'}>
                    {`Esta derivación fue rechazada por ${solicitation[SolicitationViewDTOFields.OffererBusinessName]}`}
                </TypographyBase>
                <TypographyBase variant={'body2'} color={'text.lighter'}>
                    {
                        `Esta derivación fue rechazada 
                                    ${results[SolicitationDerivationResultViewFields.LastModifiedDate] ?
                            `el ${dateFormatter.toShortDate(results[SolicitationDerivationResultViewFields.LastModifiedDate])}`
                            : ''
                        }
                                    ${results[SolicitationDerivationResultViewFields.LastModifiedUserBusinessName] ?
                            `por ${results[SolicitationDerivationResultViewFields.LastModifiedUserBusinessName]}`
                            : ''
                        }
                                `}
                </TypographyBase>
            </Stack>
        )

    return (
        <Fragment>
            <Stack spacing={0.5}>
                <TypographyBase variant={'button1'} color={'text.lighter'}>
                    {`${solicitation?.[SolicitationViewDTOFields.OffererBusinessName]} aprobó la derivación`}
                </TypographyBase>
                <TypographyBase variant={'body2'} color={'text.lighter'}>
                    {`El oferente aceptó esta derivación`}
                </TypographyBase>
            </Stack>

            <OriginSolicitationButtonComponent />
        </Fragment>
    )
}

export default OffererSolicitationActionBetweenOfferers;