import React, {useCallback, useMemo} from "react";
import {Chip, Link, Stack} from "@mui/material";
import {Skeleton} from "@mui/lab";
import {useCompanySolicitation} from "../CompanySolicitationContext";
import {TypographyBase} from "components/misc/TypographyBase";
import {OffererLogoWithName} from "../../../offerer/components/OffererLogo";
import SolicitationTableStatusCompanyChip from "../../../solicitations/components/SolicitationTableStatusCompanyChip";
import {DataWithLabelTypographyBase} from "components/misc/DataWithLabel";
import {dateFormatter} from "util/formatters/dateFormatter";
import {SolicitationViewDTOFields} from "types/solicitations/solicitationData";
import {SolicitationStatusType} from "types/solicitations/solicitationEnums";
import {useAppNavigation} from "hooks/navigation";
import {PymeRoute} from "routes/pyme/routeAppPymeData";


const solicitationSentStatus = [
    SolicitationStatusType.GeneralCompanySent, 
    SolicitationStatusType.AssistedSearchCompanySent, 
    SolicitationStatusType.OrienteerCompanySent
]

export default function CompanySolicitationHeader () {
    const { navigate } = useAppNavigation();
    const { solicitation, urlOffererLogo } = useCompanySolicitation();
    
    const showLastModifiedDate = useMemo(() => {
        if (!solicitation) return false;

        return !solicitationSentStatus.includes(solicitation[SolicitationViewDTOFields.CompanySolicitationStatusTypeCode]);
    }, [solicitation]);
    
    const onHandleClickOriginSolicitation = useCallback(() => {
        if (!solicitation || !solicitation[SolicitationViewDTOFields.OriginSolicitationId]) return;

        navigate(PymeRoute.PymeSolicitationDetail,
            { 
                companyId: solicitation[SolicitationViewDTOFields.CompanyId],
                solicitationId: solicitation[SolicitationViewDTOFields.OriginSolicitationId]
            },
        )
    }, [solicitation])
    
    return (
        <Stack spacing={1.5}>
            {
                solicitation && !!solicitation[SolicitationViewDTOFields.OriginSolicitationId] && (
                    <Link variant={'body2'} fontWeight={600} component={'button'} color={'primary'} textAlign={'start'}
                          underline={'hover'}
                          onClick={onHandleClickOriginSolicitation}
                    >
                        {`A partir de ${solicitation[SolicitationViewDTOFields.OriginSolicitationTypeDesc] || 'solicitud'}`}
                    </Link >
                )
            }
            <Stack spacing={1} 
                   direction={{ xs: 'column', md: 'row' }}
                   alignItems={'center'}
            >
                <OffererLogoWithName offererUrlLogo={!!urlOffererLogo ? urlOffererLogo : undefined}
                                     offererBusinessName={solicitation?.[SolicitationViewDTOFields.OffererBusinessName]}
                                     size={'md'}
                                     NameProps={{ variant: 'h2', fontWeight: 600 }}
                />
                {
                    solicitation &&
                    <SolicitationTableStatusCompanyChip solicitation={solicitation} />
                }
                {
                    !!solicitation && solicitation[SolicitationViewDTOFields.IsNewSolicitationSideCompany] &&
                    <Chip variant={'newStatus'}
                          label={'Nueva!'}
                    />
                }
            </Stack>
            
            <Stack direction={{ xs: 'column', md: 'row' }}>
                <Stack spacing={2} flex={1}>
                    <Stack direction={'row'} spacing={2}>
                        <TypographyBase variant={'h5'}>
                            {solicitation?.[SolicitationViewDTOFields.LineDesc]}
                        </TypographyBase>
                    </Stack>
                    
                    <TypographyBase variant={'body1'} color={'text.lighter'}>
                        {solicitation?.[SolicitationViewDTOFields.LongLineDesc]}
                    </TypographyBase>
                </Stack>
                
                <Stack spacing={{ xs: 4, md: 8 }}
                       direction={{ xs: 'column', sm: 'row' }}
                       alignItems={{ xs: 'start', sm: 'end'}}
                       justifyContent={'end'}
                       flex={1}
                >
                    <CompanySolicitationHeaderDate label={'Solicitud Enviada'}
                                                   date={solicitation?.[SolicitationViewDTOFields.CreationDate]} />

                    {
                        showLastModifiedDate &&
                            <CompanySolicitationHeaderDate label={'Última Actualización'}
                                                           date={solicitation?.[SolicitationViewDTOFields.CompanyLastModified]} />
                    }
                </Stack>
            </Stack>
            
        </Stack>
    );
}

interface CompanySolicitationHeaderDateProps {
    label: string,
    date?: Date
}

function CompanySolicitationHeaderDate({ label, date }: CompanySolicitationHeaderDateProps) {
    return (
        <DataWithLabelTypographyBase label={label}
                                     data={
                                         date ?
                                             dateFormatter.toShortDateWithMonthName(date)
                                             :
                                             <Skeleton />
                                     }
                                     LabelProps={{ variant: 'body1', color: 'text.lighter', fontWeight: 600 }}
                                     DataProps={{ variant: 'body1', color: 'text.lighter' }}
                                     StackProps={{ alignItems: { sm: 'end' } }}
        /> 
    )
}

/*
        <React.Fragment>
            <Stack>
                <Stack direction='row' alignItems='center' justifyContent='space-between'>
                    <Stack spacing={2}>
                        <Stack direction={'row'} spacing={1} alignItems={'center'}>
                            <CompanyLogoById companyId={solicitation?.[SolicitationViewDTOFields.CompanyId]}
                                             isPhysicalPerson={solicitation?.[SolicitationViewDTOFields.CompanyPersonTypeCode] === PersonTypes.Physical}
                                             size={'sm'}
                            />
                            
                            <TypographyBase variant={'subtitle1'} fontWeight={400} color={'text.lighter'} tooltip maxLines={2}>
                                {businessName}
                            </TypographyBase>
                        </Stack>
                        <Stack direction={'row'} spacing={1} alignItems={'center'}>
                            <Chip  color={'default'} size={'small'}
                                   label={solicitation ? solicitation[SolicitationViewDTOFields.ProductDesc] : ''}/>
                            
                            {
                                cancelled &&
                                <Chip color={'error'}
                                      size={'small'}
                                      label={solicitation?.[SolicitationViewDTOFields.CompanySolicitationStatusTypeDesc]}
                                />
                            }
                        </Stack>
                    </Stack>

                    {
                        solicitation && itemsDropdown && !!itemsDropdown.length &&
                        <ButtonIconDropdown label={''}
                                            items={itemsDropdown}
                                            size='small'
                        />
                    }
                </Stack>

                <Stack mt={1.5}>
                    <Typography variant={'h4'} fontWeight={500}>
                        {solicitation ? solicitation[SolicitationViewDTOFields.LineDesc] : '-'}
                    </Typography>
                    
                    <OffererLogoWithName offererId={solicitation ? solicitation[SolicitationViewDTOFields.OffererId] : undefined}
                                         offererUrlLogo={solicitation?.[SolicitationViewDTOFields.OffererUrlLogo]}
                                         offererBusinessName={solicitation?.[SolicitationViewDTOFields.OffererBusinessName]}
                                         withTooltip
                                         NameProps={{fontSize: '16px'}}
                    />
                </Stack>
            </Stack>
            {
                solicitation &&
                <LinkedSolicitationsDrawer open={openLinkedSolicitations}
                                           onClose={onCloseLinkedSolicitations}
                                           solicitation={solicitation}
                />
            }
            <DialogAlert onClose={onCloseCancel}
                         open={openCancel}
                         title={'Cancelar solicitud'}
                         textConfirm={'Si'}
                         textClose={'No'}
                         onConfirm={onCancelSolicitation}
                         textContent={hasAlert ? 'Tenés mensajes o pedidos de documentación sin responder. ¿Deseas cancelar la solicitud de todos modos?' : '¿Querés cancelar esta solicitud?'}
            />
        </React.Fragment>*/