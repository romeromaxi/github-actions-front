import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import {Button, Chip, IconButton, Stack, Tooltip} from "@mui/material";
import { WrapperIcons } from "components/icons/Icons";
import {EntityWithIdFields} from "types/baseEntities";
import { MailIcon, ArrowRight, TrashIcon } from "lucide-react";
import {SolicitationViewDTOFields} from "types/solicitations/solicitationData";
import {SolicitationAlertType, SolicitationClassificationTypesStatusType, SolicitationTypes} from "types/solicitations/solicitationEnums";
import { SendButtonNew } from "components/buttons/Buttons";
import {MarketSolicitationFields, marketSolicitationStorage } from "util/sessionStorage/marketSolicitationStorage";
import { CompanyFileType } from "types/company/companyEnums";
import {DialogAlert} from "components/dialog";
import {HttpSolicitation} from "http/index";
import useAxios from "hooks/useAxios";
import {useSnackbarActions} from "hooks/useSnackbarActions";

interface SolicitationCardActionsProps {
    solicitation: any;
    isMinimalVariant?: boolean;
    onReloadSolicitations: () => void;
}

function SolicitationCardActions({ solicitation, isMinimalVariant, onReloadSolicitations }: SolicitationCardActionsProps) {
    const navigate = useNavigate();
    const { fetchData } = useAxios();
    const { addSnackbarSuccess } = useSnackbarActions();

    const [openDiscardDialog, setOpenDiscardDialog] = useState<boolean>(false);
    const solicitationId = solicitation[EntityWithIdFields.Id];
    const companyId = solicitation[SolicitationViewDTOFields.CompanyId];
    const classificationType = solicitation[SolicitationViewDTOFields.CompanySolicitationClassificationStatusTypeCod] as SolicitationClassificationTypesStatusType | undefined;

    const hasAlert = solicitation[SolicitationViewDTOFields.AlertTypeCode] !== SolicitationAlertType.WithoutAlert;
    
    const pathToDetail = `/mis-solicitudes/${companyId}/${solicitationId}`;
    const handleOpenInNewTab = () => window.open(pathToDetail, '_blank');

    const handleOpenSolicitation = (e: any) => {
        e.stopPropagation();
        e.preventDefault();
        navigate(pathToDetail)
    }
    
    const cancelSolicitation = () => {
        fetchData(
            () => HttpSolicitation.cancelSolicitation(solicitationId),
            true
        ).then(() => {
            addSnackbarSuccess("La solicitud se descartó con éxito");
            setOpenDiscardDialog(false);
            onReloadSolicitations();
        })
    }
    
    if (isMinimalVariant)
        return (
            <Button variant="outlined" color="secondary" size={'small'}
                    onClick={(e) => { e.stopPropagation(); handleOpenInNewTab(); }}>
                <WrapperIcons Icon={ArrowRight} size='sm'/>
            </Button>
        )

    if (classificationType === SolicitationClassificationTypesStatusType.InCart)
        return (
            <React.Fragment>
                <Stack direction={'row-reverse'} width={1} spacing={3} alignItems={'anchor-center'}>
                    <Tooltip title={"Descartar solicitud"}>
                        <IconButton onClick={() => setOpenDiscardDialog(true)}
                                    size="small"
                        >
                            <TrashIcon />
                        </IconButton>
                    </Tooltip>

                    <SendButtonNew
                        size={'small'}
                        onClick={(e) => {
                            e.stopPropagation();
                            marketSolicitationStorage.setCurrentSolicitation({
                                [MarketSolicitationFields.CompanyId]: companyId,
                                [MarketSolicitationFields.SolicitationIdList]: [solicitationId],
                                [MarketSolicitationFields.SolicitationType]: solicitation[SolicitationViewDTOFields.SolicitationTypeCode] ?? SolicitationTypes.General,
                                [MarketSolicitationFields.FileType]: solicitation[SolicitationViewDTOFields.FileTypeCode] ?? CompanyFileType.Long,
                            });

                            navigate(`/market/lines/${companyId}/prequalification`);
                        }}
                    >
                        Enviar ahora
                    </SendButtonNew>
                </Stack>

                <DialogAlert open={openDiscardDialog}
                             onClose={() => setOpenDiscardDialog(false)}
                             title='Descartar Solicitud lista para enviar'
                             textContent='¿Estás seguro de descartar esta solicitud?'
                             onConfirm={cancelSolicitation}
                             textConfirm={'Sí, Descartar Solicitud'}
                             maxWidth={'sm'}

                />
            </React.Fragment>
        );

    if (solicitation[SolicitationViewDTOFields.SolicitationTypeCode] === SolicitationTypes.Matcher)
        return (
            <Stack direction={'row'}
                   alignItems={'center'}
                   spacing={2}>
                <Button variant="outlined"
                        color="secondary"
                        size="small"
                        onClick={handleOpenSolicitation}
                >
                    Ver Búsqueda Asistida
                </Button>

                {
                    !!solicitation[SolicitationViewDTOFields.AssociatedNewSolicitationsSideCompanyQuantity] &&
                    <Chip variant={'newStatus'}
                          label={`${solicitation[SolicitationViewDTOFields.AssociatedNewSolicitationsSideCompanyQuantity]} nueva${solicitation[SolicitationViewDTOFields.AssociatedNewSolicitationsSideCompanyQuantity] > 1 ? 's' : ''}`}
                    />
                }
            </Stack>
        )
    
    if (hasAlert) {
        const alertType = solicitation[SolicitationViewDTOFields.AlertTypeCode];
        if (alertType === SolicitationAlertType.NewMessage) {
            return (
                <Button
                    variant="outlined"
                    color="secondary"
                    size="small"
                    startIcon={<MailIcon />}
                    onClick={handleOpenSolicitation}
                >
                    Ver nuevo mensaje
                </Button>
            );
        } else if (alertType === SolicitationAlertType.NewDocument) {
            return (
                <Button
                    variant="outlined"
                    color="secondary"
                    size="small"
                    onClick={handleOpenSolicitation}
                >
                    Ver documentación pendiente
                </Button>
            );
        } else if (alertType === SolicitationAlertType.NewMessageAndNewDocument) {
            return (
                <Button
                    variant="outlined"
                    color="secondary"
                    size="small"
                    onClick={handleOpenSolicitation}
                >
                    Ver solicitud
                </Button>
            );
        }
    }

    /*if (classificationType === 22 || classificationType === 37) {
        return (
            <Button
                variant="outlined"
                color="secondary"
                size="small"
                onClick={(e) => {
                    e.stopPropagation();
                    navigate(pathToDetail)
                }}
            >
                Ver resultado
            </Button>
        );
    }*/
        
    return (
        <Stack direction={'row'}
               alignItems={'center'}
               spacing={2}
        >
            <Button
                variant="outlined"
                color="secondary"
                size="small"
                onClick={handleOpenSolicitation}
            >
                Ver solicitud
            </Button>

            {
                !!solicitation[SolicitationViewDTOFields.IsNewSolicitationSideCompany] &&
                <Chip variant={'newStatus'}
                      label={'Nueva!'}
                />
            }
        </Stack>
    )
}

export default SolicitationCardActions;