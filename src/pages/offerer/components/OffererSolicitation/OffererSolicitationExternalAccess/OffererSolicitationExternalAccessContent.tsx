import {Alert, Card, CardContent, Chip, Stack, Tooltip, Typography} from "@mui/material";
import React, {useContext, useEffect, useState} from "react";
import {ShareNetworkIconButton, SocialShareIconButton} from "components/buttons/Buttons";
import {OffererContext} from "../../OffererContextProvider";
import {BaseRequestFields, EntityWithIdFields} from "types/baseEntities";
import OffererShareSolicitationDialog from "../OffererShareSolicitationDialog";
import {HttpSolicitation} from "http/index";
import {
    SolicitationAccessView,
    SolicitationAccessViewFields,
    SolicitationShareDerivation,
    SolicitationShareDerivationFields,
    SolicitationViewDTO,
    SolicitationViewDTOFields
} from "types/solicitations/solicitationData";
import {ITableColumn, TableList} from "components/table";
import {dateFormatter} from "util/formatters/dateFormatter";
import {
    SolicitationAccessStateTypeCodes,
    SolicitationOffererStatusType,
    SolicitationOffererTabs
} from "types/solicitations/solicitationEnums";
import {stringFormatter} from "util/formatters/stringFormatter";
import OffererShareSolicitationBySelectedDialog from "../OffererShareSolicitationBySelectedDialog";
import useAxios from "hooks/useAxios";
import {useAction} from "hooks/useAction";
import {TypographyBase} from "components/misc/TypographyBase";
import {DialogAlert} from "components/dialog";
import {HttpSolicitationTracking} from "http/solicitations/httpSolicitationTracking";
import {WrapperIcons} from "components/icons/Icons";
import {CheckCircle} from "@phosphor-icons/react";
import {SolicitationHelper} from "../../../../../util/helpers/solicitationHelper";
import {HttpSolicitationShareAccess} from "../../../../../http/solicitations/httpSolicitationShareAccess";
import OffererSolicitationExternalAccessDerivationDialog from "./OffererSolicitationExternalAccessDerivationDialog";


interface OffererSolicitationExternalAccessContentProps {
    solicitation: SolicitationViewDTO
}


const OffererSolicitationExternalAccessContent = ({solicitation} : OffererSolicitationExternalAccessContentProps) => {
    const [openShare, setOpenShare] = useState<boolean>(false)
    const [openIndividualShare, setOpenIndividualShare] = useState<boolean>(false)
    const [selectedOfferer, setSelectedOfferer] = useState<number>()
    const {snackbarSuccess} = useAction()
    const {fetchData} = useAxios()
    const [lstAccess, setLstAccess] = useState<SolicitationAccessView[]>();
    const [accessToTracking, setAccessToTracking] = useState<SolicitationAccessView>();
    const [derivationItem, setDerivationItem] = useState<SolicitationAccessView>();
    const [openDerivation, setOpenDerivation] = useState<boolean>(false);
    
    const tabActive = SolicitationHelper.isTabActive(solicitation, SolicitationOffererTabs.Assistance);
    const alreadyPassedTab = SolicitationHelper.alreadyPassedTab(solicitation, SolicitationOffererTabs.Assistance);
    
    const offerer = useContext(OffererContext);

    const statusCode: number = solicitation[SolicitationViewDTOFields.OffererSolicitationStatusTypeCode]
    const showAll = 
        statusCode === SolicitationOffererStatusType.Derivation || 
        statusCode === SolicitationOffererStatusType.SolicitationAssistanceApproval ||
        statusCode === SolicitationOffererStatusType.SolicitationAssistanceApprovalOrienteer;
    
    const loadSolicitationsShared = () => {
        HttpSolicitation.getSolicitationsShared(solicitation[EntityWithIdFields.Id]).then((r) => setLstAccess(r))
    }

    const onShare = (s: SolicitationAccessView) => {
        setOpenIndividualShare(true)
        setSelectedOfferer(s[SolicitationAccessViewFields.FinancialEntityId])
    }
    const getChipState = (s: SolicitationAccessView) =>
        s[SolicitationAccessViewFields.HasDefinedResult] ?
            s[SolicitationAccessViewFields.SolicitationAccessStateCode] === SolicitationAccessStateTypeCodes.Interested ?
                <Chip color={'success'} size={'small'} label={s[SolicitationAccessViewFields.SolicitationAccessStateDesc]} />
                :
                <Chip color={'error'} size={'small'} label={s[SolicitationAccessViewFields.SolicitationAccessStateDesc]} />
            :
                s[SolicitationAccessViewFields.SolicitationAccessStateDesc] && s[SolicitationAccessViewFields.SolicitationAccessStateDesc] !== '' ?
                <Chip color='warning' size={'small'} label={s[SolicitationAccessViewFields.SolicitationAccessStateDesc]} />
                :
                <Typography>-</Typography>
    
    const clearAccessToTracking = () => setAccessToTracking(undefined);
    
    const sendOffererToTracking = () => {
        if (accessToTracking) {
            fetchData(
                () => HttpSolicitationTracking.addFinancialEntityToTracking(
                    solicitation[EntityWithIdFields.Id],
                    accessToTracking[SolicitationAccessViewFields.FinancialEntityId]),
                true
            )
                .then(() => {
                    loadSolicitationsShared();
                    snackbarSuccess("Se le comunicó a la MiPyME exitosamente");
                })
                .finally(clearAccessToTracking)
        }
    }
    
    const handleShare = (item: SolicitationAccessView) => {
        if (item[SolicitationAccessViewFields.AllowPlatformDerivation]) {
            setOpenDerivation(true)
            setDerivationItem(item)
        } else onShare(item)
    }
    
    const onCloseDerivationDialog = () => {
        setOpenDerivation(false)
        setDerivationItem(undefined)
    }
    const onConfirmDerivation = (derivation: SolicitationAccessView, attachDoc: boolean) => {
        const submitData: SolicitationShareDerivation = {
            [SolicitationShareDerivationFields.FinancialEntityId]: derivation[SolicitationAccessViewFields.FinancialEntityId],
            [SolicitationShareDerivationFields.AttachDocumentation]: attachDoc,
            [BaseRequestFields.OriginCode]: 1,
            [BaseRequestFields.ModuleCode]: 1
        }
        fetchData(
            () => HttpSolicitationShareAccess.sendRequestDerivation(solicitation[EntityWithIdFields.Id], submitData),
            true
        ).then((r) => {
            if (!r.tieneError) {
                snackbarSuccess("La consulta de derivación fue enviada corrrectamente")
                onCloseDerivationDialog()
                loadSolicitationsShared()
            }
        })
    }
    
    const columns : ITableColumn[] = [
        {
            label: 'Entidad', textAlign:'left', value: SolicitationAccessViewFields.FinancialEntityBusinessName,
            onRenderCell: (i: SolicitationAccessView) => 
              <Tooltip title={i[SolicitationAccessViewFields.FinancialEntityBusinessName]}>
                <Typography>
                    {stringFormatter.cutIfHaveMoreThan(i[SolicitationAccessViewFields.FinancialEntityBusinessName], 31)}
                </Typography>
              </Tooltip>
        },
        {
            label: 'Invitado',
            value: SolicitationAccessViewFields.MailInvitationAccess,
            textAlign: 'left',
            onRenderCell: (i: SolicitationAccessView) =>
              i[SolicitationAccessViewFields.MailInvitationAccess] ?
                  <Stack>
                      <TypographyBase tooltip maxLines={2}>
                          {i[SolicitationAccessViewFields.MailInvitationAccess]}
                      </TypographyBase>

                      <TypographyBase variant={'caption'} color={'text.lighter'}>
                          {
                              dateFormatter.toShortDate(i[SolicitationAccessViewFields.DateSent]) !== '01/01/0001' ? 
                                `Envío: ${dateFormatter.toShortDate(i[SolicitationAccessViewFields.DateSent])}`
                                : 
                                '-'
                          }
                      </TypographyBase>
                  </Stack>
                :
                <Stack alignItems={'center'}>
                    <Typography>-</Typography>
                </Stack>
        },
        
        {
          label: 'Resultado', value: SolicitationAccessViewFields.SolicitationAccessStateCode,
          textAlign: 'left', width: '40%',
            onRenderCell: (i: SolicitationAccessView) => (
              dateFormatter.toShortDate(i[SolicitationAccessViewFields.DateSent]) !== '01/01/0001' ?
                  <Stack spacing={1}>
                    <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
                      {getChipState(i)}

                      {
                        i[SolicitationAccessViewFields.DateLastSolicitationAccessState] &&
                          <TypographyBase variant={'subtitle2'} fontWeight={400} color={'text.lighter'}>
                            {`${dateFormatter.toShortDate(i[SolicitationAccessViewFields.DateLastSolicitationAccessState])}`}
                          </TypographyBase>
                      }
                    </Stack>

                    {
                      i[SolicitationAccessViewFields.ObservationsAccessState] && 
                      i[SolicitationAccessViewFields.ObservationsAccessState] !== '' &&
                        <TypographyBase tooltip maxLines={2}>
                          {i[SolicitationAccessViewFields.ObservationsAccessState]}
                        </TypographyBase>
                    }

                  </Stack>
                :
                <Stack alignItems={'center'}>
                    <Typography>-</Typography>
                </Stack>
            )
        },
        {
          label: 'Acciones',
          onRenderCell: (i: SolicitationAccessView) => (
              <Stack direction={'row'} spacing={1} alignItems={'center'}>
                  {
                      (
                          showAll && 
                          (!i[SolicitationAccessViewFields.AllowPlatformDerivation] || !i[SolicitationAccessViewFields.SolicitationAccessStateCode])
                      ) &&
                          <ShareNetworkIconButton color={'inherit'} size={'small'}
                                                  tooltipTitle={i[SolicitationAccessViewFields.AllowPlatformDerivation] ? 'Derivar la consulta' : 'Compartir para este oferente'}
                                                  onClick={() => handleShare(i)}/>
                  }
                  
                  {
                      i[SolicitationAccessViewFields.SolicitationAccessStateCode] === SolicitationAccessStateTypeCodes.Interested ?
                          i[SolicitationAccessViewFields.ReportedTrackingOfferer] ?
                              <WrapperIcons Icon={CheckCircle} color={'success'} size={'md'} 
                                            tooltip={"Ya se le comunicó a la MiPyME"} 
                              />
                              :
                              <SocialShareIconButton color={'inherit'} size={'small'} 
                                                     tooltipTitle={'Comunicar a la MiPyME'} 
                                                     onClick={() => setAccessToTracking(i)}
                              />
                          :
                          <React.Fragment />
                  }
              </Stack>
          )
        }
    ]
    
    useEffect(() => {
        loadSolicitationsShared()
    }, []);
    
    return (
        <React.Fragment>
            {
                (tabActive || alreadyPassedTab) ?
                    <TableList entityList={lstAccess}
                               columns={columns}
                               isLoading={!lstAccess}
                               error={false}
                               keepBorderRadius
                    />
                    :
                    <Card>
                        <CardContent>
                            <Alert severity={'info'}>La solicitud aún no se encuentra en la etapa de derivación</Alert>
                        </CardContent>
                    </Card>
            }
            
            {
                offerer &&
                <OffererShareSolicitationDialog open={openShare}
                                                onClose={() => {
                                                    setOpenShare(false)
                                                }}
                                                onReload={loadSolicitationsShared}
                                                solicitationId={solicitation[EntityWithIdFields.Id]}
                                                offererId={offerer[EntityWithIdFields.Id]}
                />
            }
            {
                selectedOfferer &&
                <OffererShareSolicitationBySelectedDialog open={openIndividualShare}
                                                          onClose={() => {
                                                              setOpenIndividualShare(false)
                                                              setSelectedOfferer(undefined)
                                                          }}
                                                          onReload={loadSolicitationsShared}
                                                          solicitationId={solicitation[EntityWithIdFields.Id]}
                                                          financialEntityId={selectedOfferer}
                />
            }
            
            {
                accessToTracking &&
                    <DialogAlert open={!!accessToTracking}
                                 textContent={`¿Estás seguro de que querés enviar a ${solicitation[SolicitationViewDTOFields.CompanyBusinessName]} los datos de ${accessToTracking[SolicitationAccessViewFields.FinancialEntityBusinessName]}?`}
                                 onClose={clearAccessToTracking}
                                 onConfirm={sendOffererToTracking}
                                 hideTitle
                    />
            }
            {
                derivationItem &&
                <OffererSolicitationExternalAccessDerivationDialog open={openDerivation}
                                                                   onClose={onCloseDerivationDialog}
                                                                   derivationItem={derivationItem}
                                                                   onSubmit={onConfirmDerivation}
                />
            }
                         
        </React.Fragment>
    )
}


export default OffererSolicitationExternalAccessContent