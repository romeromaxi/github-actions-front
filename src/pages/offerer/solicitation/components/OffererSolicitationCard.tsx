import {Box, Grid, Stack, Button} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {ChevronRight, FileTextIcon, MessagesSquareIcon} from "lucide-react";
import {SolicitationViewDTO, SolicitationViewDTOFields} from "types/solicitations/solicitationData";
import {EntityWithIdFields} from "types/baseEntities";
import {
    SolicitationAlertType,
    SolicitationTypes,
    SolicitationOffererStatusType
} from "types/solicitations/solicitationEnums";
import {TypographyBase} from "components/misc/TypographyBase";
import {DataWithLabel} from "components/misc/DataWithLabel";
import {dateFormatter} from "util/formatters/dateFormatter";
import {WrapperIcons} from "components/icons/Icons";
import React, {useContext} from "react";
import {stringFormatter} from "util/formatters/stringFormatter";
import {CopyClipboardTypography} from "components/clipboards/CopyClipboardComponents";
import AvatarUserOfferer from "../../components/avatar/AvatarUserOfferer";
import OffererSolicitationLogo from "./OffererSolicitationLogo";
import {OffererContext} from "../../components/OffererContextProvider";
import SolicitationTableStatusOffererChip from "../../../solicitations/components/SolicitationTableStatusOffererChip";

interface OffererSolicitationCardProps {
    solicitation: SolicitationViewDTO;
}

const paddingXInternal = {xs: '12px', md: '16px !important'};

function OffererSolicitationCard({solicitation}: OffererSolicitationCardProps) {
    const navigate = useNavigate();
    const offerer = useContext(OffererContext);

    const solicitationId = solicitation[EntityWithIdFields.Id];
    const alertType = solicitation[SolicitationViewDTOFields.AlertTypeCode];
    const hasNewMessage = alertType === SolicitationAlertType.NewMessage || alertType === SolicitationAlertType.NewMessageAndNewDocument;
    const hasNewDocument = alertType === SolicitationAlertType.NewDocument || alertType === SolicitationAlertType.NewMessageAndNewDocument;
    const showNotification = hasNewMessage || hasNewDocument;
    const solicitationType = solicitation[SolicitationViewDTOFields.SolicitationTypeCode];
    const isBetweenOfferers = solicitationType === SolicitationTypes.BetweenOfferers;

    const offererStatus = solicitation[SolicitationViewDTOFields.OffererSolicitationStatusTypeCode];
    const isPending = offererStatus === SolicitationOffererStatusType.SolicitationBetweenOfferersReception;
    const isAccepted = offererStatus === SolicitationOffererStatusType.SolicitationBetweenOfferersAcceptedDerivation;
    const isRejected = offererStatus === SolicitationOffererStatusType.SolicitationBetweenOfferersRejectedDerivation;

    const paddingYInternal = {xs: 'auto', md: '16px !important'};

    const handleClick = () => {
        navigate(`/offerer/solicitations/${solicitationId}`);
    };

    const handleConversationClick = () => {
        navigate(`/offerer/solicitations/${solicitationId}`);
    };

    return (
        <Box
            sx={{
                position: 'relative',
                width: {xs: '100vw', sm: '100%'},
                ml: {xs: 'calc(50% - 50vw)', sm: 0},
                mr: {xs: 'calc(50% - 50vw)', sm: 0},
            }}
        >
            {isBetweenOfferers ? (
                <Box
                    onClick={handleClick}
                    sx={{
                        padding: '0px !important',
                        width: '100%',
                        background: '#FFFFFF',
                        border: isPending ? '1px solid #27B877' : '1px solid #ECECEC',
                        borderRadius: {xs: 0, sm: '16px'},
                        overflow: 'hidden',
                        cursor: 'pointer',
                        '&:hover': {
                            boxShadow: '0px 2px 8px rgba(0,0,0,0.1)',
                            borderColor: '#DADADA',
                        },
                    }}
                >
                    <Grid
                        container
                        alignItems="center"
                        spacing={{xs: 1.5, md: 0.8}}
                        padding={{xs: '12px !important', md: '6.5px 0px 0px 14px !important'}}
                    >
                        <Grid
                            item
                            xs={12}
                            md={2.5}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                borderRight: {xs: 'none', md: '1px solid #ECECEC'},
                                pr: {md: 2},
                                mr: {md: 1},
                                paddingY: paddingYInternal
                            }}
                        >
                            <Stack direction='row' alignItems='center' spacing={1.5}
                                   sx={{width: '100%', overflow: 'hidden'}}>
                                <OffererSolicitationLogo solicitation={solicitation}
                                                         userOffererId={offerer[EntityWithIdFields.Id]}
                                                         size={'md'}
                                                         badgeSize={20}
                                />
                                
                                <Stack sx={{flex: 1}}>
                                    <TypographyBase variant={'body3'} color="text.lighter" maxLines={1} tooltip>
                                        Derivación LUC #{solicitationId}
                                    </TypographyBase>
                                    <TypographyBase variant={'button2'} fontFamily={'Poppins !important'}
                                                    fontWeight={600} fontSize={16} tooltip maxLines={1}>
                                        {solicitation[SolicitationViewDTOFields.CompanyBusinessName]}
                                    </TypographyBase>
                                </Stack>
                            </Stack>
                        </Grid>

                        <Grid
                            item
                            xs={12}
                            md={2}
                            sx={{
                                display: 'flex',
                                justifyContent: {xs: 'center', md: 'flex-start'},
                                paddingY: paddingYInternal
                            }}
                        >
                            <DataWithLabel
                                label={
                                    <TypographyBase variant="body4" fontWeight={400} color="text.lighter">
                                        Asignado a
                                    </TypographyBase>
                                }
                                data={'-'}
                            />
                        </Grid>

                        <Grid
                            item
                            sx={{
                                display: 'flex',
                                justifyContent: {xs: 'center', md: 'flex-end'},
                                alignItems: 'center',
                                gap: 0.5,
                                color: 'primary.main',
                                height: '-webkit-fill-available',
                                paddingY: paddingYInternal,
                                flex: 1,
                                minWidth: 0
                            }}
                        >
                            {isPending && showNotification ? (
                                hasNewMessage ? (
                                    <Stack direction="row" alignItems="center" spacing={1} justifyContent="flex-end">
                                        <WrapperIcons Icon={MessagesSquareIcon} size="sm" color="primary"/>
                                        <TypographyBase variant="button2" color="primary.main">
                                            1 nuevo mensaje
                                        </TypographyBase>
                                    </Stack>
                                ) : (
                                    <Stack direction="row" alignItems="center" spacing={1} justifyContent="flex-end">
                                        <WrapperIcons Icon={FileTextIcon} size="sm" color="primary"/>
                                        <TypographyBase variant="button2" fontWeight={500} color="primary.main">
                                            Nueva documentación
                                        </TypographyBase>
                                    </Stack>
                                )
                            ) : isAccepted ? (
                                <TypographyBase variant="button2" fontWeight={600} color="text.secondary">
                                    Esperando aprobación de la derivación por parte de LUC
                                </TypographyBase>
                            ) : isRejected ? (
                                <TypographyBase variant="button2" fontWeight={600} color="error.strong">
                                    Esta derivación fue rechazada
                                </TypographyBase>
                            ) : (
                                <Box sx={{minHeight: 20}}/>
                            )}
                        </Grid>

                        <Grid
                            item
                            xs={12}
                            sm={6}
                            md="auto"
                            sx={{
                                display: 'flex',
                                justifyContent: {xs: 'center', md: 'flex-end'},
                                alignItems: 'center',
                                pr: paddingXInternal,
                                marginLeft: 4,
                                height: '-webkit-fill-available',
                                paddingY: paddingYInternal
                            }}
                        >
                            <Button
                                variant="outlined"
                                color="secondary"
                                size="small"
                                onClick={handleConversationClick}
                                sx={{
                                    textTransform: 'none',
                                    whiteSpace: 'nowrap',
                                }}
                            >
                                Ir a la conversación
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            ) : (
                <Box
                    onClick={handleClick}
                    sx={{
                        padding: '0px !important',
                        width: '100%',
                        background: '#FFFFFF',
                        border: '1px solid #ECECEC',
                        borderRadius: {xs: 0, sm: '16px'},
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        overflow: 'hidden',
                        '&:hover': {
                            boxShadow: '0px 2px 8px rgba(0,0,0,0.1)',
                            borderColor: '#DADADA',
                        },
                    }}
                >
                    <Grid
                        container
                        alignItems="center"
                        spacing={{xs: 1.5, md: 0.8}}
                        padding={{xs: '12px !important', md: '6.5px 0px 0px 14px !important'}}
                    >
                        <Grid
                            item
                            xs={12}
                            md={2.5}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                borderRight: {xs: 'none', md: '1px solid #ECECEC'},
                                pr: {md: 2},
                                mr: {md: 1},
                                paddingY: paddingYInternal
                            }}
                        >
                            <Stack direction='row' alignItems='center' spacing={1.5}
                                   sx={{width: '100%', overflow: 'visible'}}>
                                <OffererSolicitationLogo solicitation={solicitation}
                                                         userOffererId={offerer[EntityWithIdFields.Id]}
                                                         size={'md'}
                                                         badgeSize={20}
                                />

                                <Stack>
                                    <TypographyBase variant={'body3'} color="text.lighter" maxLines={1} tooltip>
                                        {solicitation[SolicitationViewDTOFields.LineDesc]}
                                    </TypographyBase>
                                    <TypographyBase variant={'button2'} fontFamily={'Poppins !important'}
                                                    fontWeight={600} fontSize={16} tooltip maxLines={1}>
                                        {solicitation[SolicitationViewDTOFields.CompanyBusinessName]}
                                    </TypographyBase>
                                </Stack>
                            </Stack>
                        </Grid>
                        <Grid
                            item
                            xs={6}
                            md={1.2}
                            sx={{
                                textAlign: {xs: 'center', md: 'left'},
                                paddingY: paddingYInternal
                            }}
                        >
                            <DataWithLabel
                                label={
                                    <TypographyBase variant="body4" fontWeight={400} color="text.lighter">
                                        CUIT
                                    </TypographyBase>
                                }
                                data={
                                    <CopyClipboardTypography
                                        textToCopy={solicitation[SolicitationViewDTOFields.CompanyCUIT] || ''}
                                        variant="subtitle1" fontWeight={600} maxLines={1} tooltip
                                    >
                                        {stringFormatter.formatCuit(solicitation[SolicitationViewDTOFields.CompanyCUIT])}
                                    </CopyClipboardTypography>
                                }
                            />
                        </Grid>

                        <Grid
                            item
                            xs={6}
                            md={0.6}
                            sx={{
                                textAlign: {xs: 'center', md: 'left'},
                                paddingY: paddingYInternal
                            }}
                        >
                            <DataWithLabel
                                label={
                                    <TypographyBase variant="body4" fontWeight={400} color="text.lighter">
                                        ID
                                    </TypographyBase>
                                }
                                data={
                                    <CopyClipboardTypography textToCopy={`${solicitationId || ''}`}
                                                             variant="subtitle1" fontWeight={600} maxLines={1} tooltip
                                    >
                                        {solicitationId}
                                    </CopyClipboardTypography>
                                }
                            />
                        </Grid>

                        <Grid
                            item
                            xs={6}
                            md={1}
                            sx={{
                                textAlign: {xs: 'center', md: 'left'},
                                paddingY: paddingYInternal
                            }}
                        >
                            <DataWithLabel
                                label={
                                    <TypographyBase variant="body4" fontWeight={400} color="text.lighter">
                                        Último contacto
                                    </TypographyBase>
                                }
                                data={
                                    <TypographyBase variant="subtitle1" fontWeight={600} maxLines={1} tooltip>
                                        {solicitation[SolicitationViewDTOFields.OffererLastModified]
                                            ? dateFormatter.formatTimeAgo(solicitation[SolicitationViewDTOFields.OffererLastModified])
                                            : '-'}
                                    </TypographyBase>
                                }
                            />
                        </Grid>

                        <Grid
                            item
                            xs={12}
                            md={1.4}
                            sx={{
                                display: 'flex',
                                justifyContent: {xs: 'center', md: 'flex-start'},
                                paddingY: paddingYInternal
                            }}
                        >
                            <DataWithLabel
                                label={
                                    <TypographyBase variant="body4" fontWeight={400} color="text.lighter">
                                        Asignado a
                                    </TypographyBase>
                                }
                                data={
                                    solicitation[SolicitationViewDTOFields.StageResponsibleUserName] ? (
                                        <AvatarUserOfferer size={'xs'}
                                                           userName={solicitation[SolicitationViewDTOFields.StageResponsibleUserName]}
                                                           tooltip={'Responsable asignado'}
                                                           NameProps={{ maxLines: 1, tooltip: true, TooltipProps: { title: '' }  }}
                                                           includeName
                                        />
                                    ) : (
                                        <TypographyBase variant={'body3'}
                                                        fontWeight={600}
                                                        maxLines={1}
                                        >
                                            -
                                        </TypographyBase>
                                    )
                                }
                            />
                        </Grid>

                        <Grid
                            item
                            xs={12}
                            sm={6}
                            md={4.8}
                            gap={2}
                            sx={{
                                display: 'flex',
                                justifyContent: {xs: 'center', md: 'flex-end'},
                                alignItems: 'center',
                                pr: {md: '10px'},
                                height: '-webkit-fill-available',
                                paddingY: paddingYInternal
                            }}
                        >
                            {showNotification ? (
                                hasNewMessage ? (
                                    <Stack direction="row" alignItems="center" spacing={1} justifyContent="flex-end">
                                        <WrapperIcons Icon={MessagesSquareIcon} size="sm" color="primary"/>
                                        <TypographyBase variant="button2" color="primary.main">
                                            1 nuevo mensaje
                                        </TypographyBase>
                                    </Stack>
                                ) : (
                                    <Stack direction="row" alignItems="center" spacing={1} justifyContent="flex-end">
                                        <WrapperIcons Icon={FileTextIcon} size="sm" color="primary"/>
                                        <TypographyBase variant="button2" fontWeight={500} color="primary.main">
                                            Nueva documentación
                                        </TypographyBase>
                                    </Stack>
                                )
                            ) : (
                                <Box/>
                            )}

                            <SolicitationTableStatusOffererChip solicitation={solicitation}/>
                        </Grid>

                        <Grid
                            item
                            xs={12}
                            sm={6}
                            md="auto"
                            sx={{
                                display: 'flex',
                                justifyContent: {xs: 'center', md: 'flex-end'},
                                alignItems: 'center',
                                pr: paddingXInternal,
                                height: '-webkit-fill-available',
                                paddingY: paddingYInternal
                            }}
                        >
                            <ChevronRight size={24} color="#5B6560"/>
                        </Grid>
                    </Grid>
                </Box>
            )}
        </Box>
    );
}

export default OffererSolicitationCard;

