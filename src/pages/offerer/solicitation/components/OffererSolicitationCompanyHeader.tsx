import React, {useEffect, useMemo, useState} from "react";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Alert,
    Button,
    Card,
    CardContent,
    Grid,
    Stack
} from "@mui/material";
import {useSolicitation} from "hooks/contexts/SolicitationsContext";
import {CompanyLogoById} from "pages/company/components/CompanyLogo";
import {
    SolicitationCompanyDataHeaderContainer,
    SolicitationCompanyDataHeaderContainerFields,
    SolicitationCompanyRequirement,
    SolicitationCompanyRequirementDataView,
    SolicitationCompanyRequirementDataViewFields,
    SolicitationCompanyRequirementFields,
    SolicitationViewDTOFields
} from "types/solicitations/solicitationData";
import {TypographyBase} from "components/misc/TypographyBase";
import {stringFormatter} from "util/formatters/stringFormatter";
import {HttpSolicitation} from "http/index";
import {EntityWithIdFields} from "types/baseEntities";
import OffererSolicitationCompanyRequirementData from "./OffererSolicitationCompanyRequirementData";
import {dateFormatter} from "util/formatters/dateFormatter";
import {CaretDown} from "@phosphor-icons/react";
import {BaseIconWrapper} from "components/icons/Icons";
import SolicitationSurveyDetailBySolicitationDialog
    from "pages/solicitations/survey/SolicitationSurveyDetailBySolicitationDialog";
import {SolicitationTypes} from "../../../../types/solicitations/solicitationEnums";
import {PersonTypes} from "../../../../types/person/personEnums";
import {ExternalLinkIcon} from "lucide-react";
import OffererSolicitationCompanyDataHeaderComponent from "./dataHeader/OffererSolicitationCompanyDataHeaderComponent";
import OffererSolicitationCompanyDataHeaderHistoryDialog
    from "./dataHeader/OffererSolicitationCompanyDataHeaderHistoryDialog";
import {themeColorDefinition} from "../../../../util/themes/definitions";

export default function OffererSolicitationCompanyHeader() {
    const { solicitation } = useSolicitation();
    const [openHistoryHeaders, setOpenHistoryHeaders] = useState<boolean>(false);
    const [currentHeaderContainer, setCurrentHeaderContainer] = useState<SolicitationCompanyDataHeaderContainer>();

    const compliesRestrictions = useMemo(() => (
        !currentHeaderContainer || currentHeaderContainer[SolicitationCompanyDataHeaderContainerFields.CompliesRestrictions]
    ), [currentHeaderContainer]);
    
    const showHistoryHeadersDialog = () => setOpenHistoryHeaders(true);
    
    const hideHistoryHeadersDialog = () => setOpenHistoryHeaders(false);

    const onNavigateToClientPortfolio = () => {
        const url = `${window.location.origin}/offerer/clientPortfolio/${solicitation?.[SolicitationViewDTOFields.FolderId]}`;
        window.open(url, "_blank");
    }
    
    useEffect(() => {
        if (!!solicitation && !!solicitation[EntityWithIdFields.Id]) {
            HttpSolicitation.getCompanyDataHeaderCurrent(solicitation[EntityWithIdFields.Id])
                .then(setCurrentHeaderContainer)
        }
    }, [solicitation]);
    
    return (
        <Card sx={{ 
            border: compliesRestrictions ? 'none' : `1px solid ${themeColorDefinition.systemFeedback.warning.primary}`, 
            padding: '0px !important',
            paddingBottom: '24px !important'
        }}>
            {
                !compliesRestrictions && (
                    <Alert severity={'warning'}
                           icon={false}
                           sx={{
                               padding: '4px 0px !important',
                               backgroundColor: `${themeColorDefinition.systemFeedback.warning.secondary} !important`,
                               color: `${themeColorDefinition.systemFeedback.warning.secondaryContrastText} !important`,
                               borderRadius: 0,
                               display: 'flex',
                               justifyContent: 'center',
                               '& .MuiAlert-message': {
                                   textAlign: 'center',
                                   width: '100%'
                               }
                           }}
                    >
                        <TypographyBase variant={'body3'}>
                            Alguna de las características de esta PyME no son compatibles con los requerimientos de la linea. {' '}
                        </TypographyBase>

                        {/*<TypographyBase variant={'body3'}
                                        onClick={showHistoryHeadersDialog}
                                        sx={{ textDecoration: 'underline' }}
                        >
                            Ver todo
                        </TypographyBase>*/}
                    </Alert>
                )
            }
            
            <CardContent sx={{ paddingX: '24px', paddingTop: !compliesRestrictions ? '12px' : '24px' }}>
                <OffererSolicitationCompanyDataHeaderComponent solicitation={solicitation}
                                                               headerContainer={currentHeaderContainer}
                                                               actions={(
                                                                   !!solicitation?.[SolicitationViewDTOFields.FolderId] ?
                                                                       <Button variant={'text'}
                                                                               color={'primary'}
                                                                               size={'small'}
                                                                               endIcon={<ExternalLinkIcon />}
                                                                               onClick={onNavigateToClientPortfolio}
                                                                               minPadding
                                                                       >
                                                                           Ir a detalle de la PyME
                                                                       </Button>
                                                                       : undefined
                                                               )}
                >
                    {
                        !!currentHeaderContainer &&
                            <Stack direction={{ xs: 'column', md: 'row' }}
                                   justifyContent={'space-between'}
                                   alignItems={'center'}
                            >
                                <TypographyBase variant={'body3'} color={'text.lighter'}>
                                    {`Información de la PyME al ${dateFormatter.toShortDate(currentHeaderContainer[SolicitationCompanyDataHeaderContainerFields.InformationDate])}`}
                                </TypographyBase>

                                <Button variant={'text'}
                                        color={'primary'}
                                        size={'small'}
                                        onClick={showHistoryHeadersDialog}
                                        minPadding
                                >
                                    Ver situación al momento del envío de la solicitud
                                </Button>
                            </Stack>    
                    }
                </OffererSolicitationCompanyDataHeaderComponent>
            </CardContent>

            {
                !!solicitation &&
                    <OffererSolicitationCompanyDataHeaderHistoryDialog open={openHistoryHeaders} 
                                                                       solicitation={solicitation}
                                                                       currentHeaderContainer={currentHeaderContainer}
                                                                       onClose={hideHistoryHeadersDialog}
                    />
            }
        </Card>
    )
}

function OffererSolicitationCompanyHeaderOld() {
  const { solicitation } = useSolicitation();
  const [companyRequirement, setCompanyRequirement] = useState<SolicitationCompanyRequirement>();
  const [dataRequirement, setDataRequirement] = useState<SolicitationCompanyRequirementDataView[]>();
  const [dataPublicBasesRequirement, setDataPublicBasesRequirement] = useState<SolicitationCompanyRequirementDataView[]>();
  const [openSurveyDetail, setOpenSurveyDetail] = useState<boolean>(false);
  const mappingOrder = [0, 3, 5, 7, 2, 4, 6, 8];
  const showSolicitationButton = useMemo(() => (
      !!solicitation && [SolicitationTypes.Matcher, SolicitationTypes.Orienteer, SolicitationTypes.BetweenOfferers].includes(solicitation[SolicitationViewDTOFields.SolicitationTypeCode])
  ), [solicitation]);  
  
  const showOpenSurveyDetail = (e: any) => {
    e.stopPropagation();
    setOpenSurveyDetail(true);
  }
  
  const closeOpenSurveyDetail = () => setOpenSurveyDetail(false);
  
  useEffect(() => {
    if (solicitation)
      HttpSolicitation.verifyCompanyRequirements(solicitation[EntityWithIdFields.Id])
        .then(response => {
          setCompanyRequirement(response);
          setDataRequirement(response[SolicitationCompanyRequirementFields.RequirementData].filter(x => !x[SolicitationCompanyRequirementDataViewFields.IsPublicBases]))
          setDataPublicBasesRequirement(response[SolicitationCompanyRequirementFields.RequirementData].filter(x => x[SolicitationCompanyRequirementDataViewFields.IsPublicBases]))
        })
  }, [solicitation]);
  
  return (
    <Card>
        {
            solicitation &&
            <Accordion defaultExpanded>
                <AccordionSummary expandIcon={<BaseIconWrapper Icon={CaretDown} size={'md'} bg={'#F7FAFC'} />}>
                    <Stack direction={'row'} width={1} spacing={3} justifyContent={'space-between'}>
                        <Stack direction={"row"} spacing={1} alignItems={'center'}>
                            <CompanyLogoById companyId={solicitation[SolicitationViewDTOFields.CompanyId]}
                                             isPhysicalPerson={solicitation[SolicitationViewDTOFields.CompanyPersonTypeCode] === PersonTypes.Physical}
                                             size={'xl'}
                            />
    
                            <Stack>
                                <TypographyBase fontWeight={500} tooltip maxLines={2}>
                                    {solicitation[SolicitationViewDTOFields.CompanyBusinessName]}
                                </TypographyBase>
                                <TypographyBase variant={'caption'} color={'text.disabled'}>
                                    {stringFormatter.formatCuit(solicitation[SolicitationViewDTOFields.CompanyCUIT])}
                                </TypographyBase>
                            </Stack>
                        </Stack>

                        {
                            showSolicitationButton &&
                                <Stack spacing={2} alignItems={'center'} direction={'row'} pr={2}>
                                    <Button onClick={showOpenSurveyDetail} variant={'outlined'} color={'secondary'} size='small'>
                                        Solicitud
                                    </Button>
                                </Stack>
                        }
                    </Stack>
                </AccordionSummary>
                
                <AccordionDetails>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={8} container spacing={1}>
                            <Grid item xs={12} order={0}>
                                <TypographyBase fontWeight={500}>Información de la empresa</TypographyBase>
                            </Grid>

                            {
                                dataRequirement &&
                                dataRequirement.map((req, idx) => (
                                    <Grid item xs={12} md={6} key={`dataOffererSolicitationCompanyRequirementData_${idx}`}
                                          order={{ xs: idx, md: mappingOrder[idx] }}
                                    >
                                        <OffererSolicitationCompanyRequirementData requirementData={req} />
                                    </Grid>
                                ))
                            }
                        </Grid>
                        <Grid item xs={12} md={4} container spacing={1}>
                            <Grid item xs={12}>
                                <TypographyBase fontWeight={500}>Bases Públicas / Bureau</TypographyBase>
                            </Grid>

                            {
                                dataPublicBasesRequirement &&
                                dataPublicBasesRequirement.map((req, idx) => (
                                    <Grid item xs={12} key={`dataPublicBasesOffererSolicitationCompanyRequirementData_${idx}`}>
                                        <OffererSolicitationCompanyRequirementData requirementData={req} />
                                    </Grid>
                                ))
                            }
                        </Grid>

                        {
                            companyRequirement &&
                            <Grid item xs={12}>
                                <TypographyBase variant={'subtitle2'} color={'text.lighter'}>
                                    {`Nota: Información de la empresa actualizada al ${dateFormatter.toShortDate(companyRequirement[SolicitationCompanyRequirementFields.CompanyFileDate])}
                      | Información de Bases Públicas al ${dateFormatter.toShortDate(companyRequirement[SolicitationCompanyRequirementFields.LastUpdatePublicBasesDate])}
                      `}
                                </TypographyBase>
                            </Grid>
                        }
                    </Grid>
                </AccordionDetails>
            </Accordion>
        }
        
        <SolicitationSurveyDetailBySolicitationDialog open={openSurveyDetail}
                                                      solicitationId={solicitation?.[EntityWithIdFields.Id] ?? 0}
                                                      onClose={closeOpenSurveyDetail} 
        />
    </Card>
  )
}

export {
    OffererSolicitationCompanyHeaderOld
};