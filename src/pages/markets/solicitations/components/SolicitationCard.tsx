import {Box, Checkbox, Collapse, Grid, Tooltip} from "@mui/material";
import {
    SolicitationAlertType,
    SolicitationClassificationTypesStatusType, SolicitationTypes,
} from "types/solicitations/solicitationEnums";
import SolicitationTableStatusCompanyChip from "pages/solicitations/components/SolicitationTableStatusCompanyChip";
import { SolicitationViewDTOFields } from "types/solicitations/solicitationData";
import { EntityWithIdFields } from "types/baseEntities";
import React, { useState } from "react";
import {useNavigate} from "react-router-dom";
import SolicitationCardActions from "./cards/SolicitationCardActions";
import {ButtonIconCollapse} from "components/buttons/Buttons";
import SolicitationCardCompanyInfo from "./cards/SolicitationCardCompanyInfo";
import SolicitationCardLineDescription from "./cards/SolicitationCardLineDescription";
import SolicitationCardProductDescription from "./cards/SolicitationCardProductDescription";
import SolicitationCardLastModified from "./cards/SolicitationCardLastModified";
import SolicitationCardChildrenWrapped from "./SolicitationCardChildrenWrapped";
import {getColumnSizesBySolicitation, SolicitationCardsGridFields} from "./cards/SolicitationCardsGridSizeUtils";

interface SolicitationCardProps {
    solicitation: any;
    selectedIds: number[];
    selectedCompanyId?: number;
    onToggleSelection?: (id: number, companyId: number) => void;
    onReloadSolicitations: () => void;
    hideCompanyInfo?: boolean;
    isMinimalActions?: boolean;
}

const SolicitationCard = ({
    solicitation,
    selectedIds,
    selectedCompanyId,
    onToggleSelection,
    onReloadSolicitations,
    isMinimalActions,
    hideCompanyInfo,
}: SolicitationCardProps) => {
    const navigate = useNavigate();
    
    const [showAssociated, setShowAssociated] = useState<boolean>(!!solicitation[SolicitationViewDTOFields.HasAssociatedSolicitations]);
    
    const hasAlert = solicitation[SolicitationViewDTOFields.AlertTypeCode] !== SolicitationAlertType.WithoutAlert;
    const solicitationId = solicitation[EntityWithIdFields.Id];
    const companyId = solicitation[SolicitationViewDTOFields.CompanyId];
    const isSelected = selectedIds.includes(solicitationId);
    const disabledByCompany = selectedCompanyId !== undefined && selectedCompanyId !== companyId;
    const classificationType = solicitation[SolicitationViewDTOFields.CompanySolicitationClassificationStatusTypeCod] as SolicitationClassificationTypesStatusType | undefined;
    const paddingYInternal = { xs: 'auto', md: '16px !important' };
    const paddingXInternal = { xs: '12px', md: '16px !important' };
    
    const columnSizes: Record<SolicitationCardsGridFields, number> = 
        getColumnSizesBySolicitation(solicitation, hideCompanyInfo, isMinimalActions, !!onToggleSelection);

    const to = `/mis-solicitudes/${companyId}/${solicitationId}`;
    const handleOpen = () => window.open(to, '_blank');

    const renderTitleByAlertType = (alertType?: SolicitationAlertType) => {
        if (alertType) {
            if (alertType === SolicitationAlertType.NewMessage) return 'Tenés un nuevo mensaje';
            if (alertType === SolicitationAlertType.NewDocument) return 'Se adjuntó documentación';
            return 'Tenés una nueva notificación';
        }
        return '';
    };
    
    if (solicitation[SolicitationViewDTOFields.SolicitationTypeCode] === SolicitationTypes.Matcher) {
        return (
            <React.Fragment>
                <Box
                    sx={{
                        position: 'relative',
                        width: { xs: '100vw', sm: '100%' },
                        ml: { xs: 'calc(50% - 50vw)', sm: 0 },
                        mr: { xs: 'calc(50% - 50vw)', sm: 0 }
                    }}
                >
                    {hasAlert && (
                        <Box
                            sx={{
                                position: 'absolute',
                                right: { xs: 8, sm: -2 },
                                top: -2,
                                zIndex: 10,
                                width: 18,
                                height: 18,
                                borderRadius: '50%',
                                backgroundColor: '#3392FF',
                                border: '2px solid white',
                                boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.15)',
                            }}
                            title={renderTitleByAlertType(solicitation[SolicitationViewDTOFields.AlertTypeCode])}
                        />
                    )}
                    <Box
                        sx={{
                            padding: '0px !important',
                            width: '100%',
                            background: '#FFFFFF',
                            border: '1px solid',
                            borderColor: isSelected ? '#309D6A' : '#ECECEC',
                            borderRadius: { xs: 0, sm: '16px' },
                            cursor: 'pointer !important',
                            transition: 'all 0.2s',
                            '&:hover': {
                                boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
                                borderColor: isSelected ? '#309D6A' : '#DADADA'
                            }
                        }}
                        onClick={
                            isMinimalActions ?
                                handleOpen
                                :
                                classificationType !== SolicitationClassificationTypesStatusType.InCart ?
                                    () => navigate(`/mis-solicitudes/${companyId}/${solicitationId}`)
                                    :
                                    undefined
                        }
                    >
                        <Grid container spacing={{ xs: 1.5, md: 0.8 }}
                              alignItems="center"
                              padding={{ xs: '12px !important', md: !isMinimalActions ? '6.5px 0px 0px 0px !important' : '6.5px 0px 0px 14px !important' }}
                        >

                            {
                                solicitation[SolicitationViewDTOFields.HasAssociatedSolicitations] && (
                                <Grid item xs={12} md={columnSizes[SolicitationCardsGridFields.CheckboxSelection]} sx={{
                                    display: { xs: 'flex', md: 'block' },
                                    height: '-webkit-fill-available',
                                    alignContent: 'center',
                                    justifyContent: { xs: 'center', md: 'flex-start' },
                                    order: { xs: 10, md: 0 },
                                    paddingLeft: paddingXInternal,
                                    paddingY: paddingYInternal
                                }}>
                                    <ButtonIconCollapse size="medium"
                                                        variant={'minPadding'}
                                                        expanded={showAssociated}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setShowAssociated(!showAssociated)
                                                        }}
                                    />
                                </Grid>
                            )}

                            
                            {
                                !hideCompanyInfo && (
                                    <Grid item xs={12} md={columnSizes[SolicitationCardsGridFields.CompanyBusinessName]} sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        height: '-webkit-fill-available',
                                        justifyContent: { xs: 'center', md: 'flex-start' },
                                        borderRight: { xs: 'none', md: '1px solid #ECECEC' },
                                        pr: { md: 2 },
                                        mr: { md: 1 },
                                        order: { xs: 0, md: 1 },
                                        paddingLeft: solicitation[SolicitationViewDTOFields.HasAssociatedSolicitations] ? 0 : paddingXInternal,
                                        paddingY: paddingYInternal
                                    }}>
                                        <SolicitationCardCompanyInfo solicitation={solicitation} />
                                    </Grid>
                                )}

                            <Grid item xs={12} md={columnSizes[SolicitationCardsGridFields.ProductLineDescription]} sx={{
                                textAlign: { xs: 'center', md: 'left' },
                                order: { xs: 1, md: 2 },
                                paddingLeft: (!solicitation[SolicitationViewDTOFields.HasAssociatedSolicitations] && !!hideCompanyInfo) ? paddingXInternal : 0,
                                paddingY: paddingYInternal,
                            }}>
                                <SolicitationCardLineDescription solicitation={solicitation} />
                            </Grid>

                            {
                                !solicitation[SolicitationViewDTOFields.HasAssociatedSolicitations] &&
                                    <Grid item xs={12} sm={6} md={columnSizes[SolicitationCardsGridFields.Status]}
                                          alignContent={'center'}
                                          sx={{
                                              textAlign: { xs: 'center', md: 'end' },
                                              borderRight: { xs: 'none', md: '1px solid #ECECEC' },
                                              height: '-webkit-fill-available !important',
                                              paddingRight: '10px',
                                              order: { xs: 4, md: 5 },
                                              paddingY: paddingYInternal,
                                          }}>
                                        <SolicitationTableStatusCompanyChip solicitation={solicitation} />
                                    </Grid>
                            }

                            {selectedIds.length === 0 && (
                                <Grid item xs={12} sm={6} md={columnSizes[SolicitationCardsGridFields.Actions]} sx={{
                                    display: 'flex',
                                    justifyContent: { xs: 'center', md: 'flex-end' },
                                    order: { xs: 5, md: 6 },
                                    paddingRight: paddingXInternal,
                                    paddingY: paddingYInternal
                                }}>
                                    <SolicitationCardActions solicitation={solicitation}
                                                             onReloadSolicitations={onReloadSolicitations}
                                                             isMinimalVariant={isMinimalActions}
                                    />
                                </Grid>
                            )}
                        </Grid>

                        {
                            solicitation[SolicitationViewDTOFields.HasAssociatedSolicitations] && (
                                <Collapse in={showAssociated}>
                                    <Grid item xs={12}
                                          paddingX={paddingXInternal}
                                          paddingY={2.5}
                                    >
                                        <SolicitationCardChildrenWrapped solicitationId={solicitationId} />
                                    </Grid>
                                </Collapse>
                            )
                        }
                    </Box>
                </Box>
            </React.Fragment>
        )
    }

    return (
        <React.Fragment>
            <Box
                sx={{
                    position: 'relative',
                    width: { xs: '100vw', sm: '100%' },
                    ml: { xs: 'calc(50% - 50vw)', sm: 0 },
                    mr: { xs: 'calc(50% - 50vw)', sm: 0 }
                }}
            >
                {hasAlert && (
                    <Box
                        sx={{
                            position: 'absolute',
                            right: { xs: 8, sm: -2 },
                            top: -2,
                            zIndex: 10,
                            width: 18,
                            height: 18,
                            borderRadius: '50%',
                            backgroundColor: '#3392FF',
                            border: '2px solid white',
                            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.15)',
                        }}
                        title={renderTitleByAlertType(solicitation[SolicitationViewDTOFields.AlertTypeCode])}
                    />
                )}
                <Box
                    sx={{
                        padding: '0px !important',
                        width: '100%',
                        background: '#FFFFFF',
                        border: '1px solid',
                        borderColor: isSelected ? '#309D6A' : '#ECECEC',
                        borderRadius: { xs: 0, sm: '16px' },
                        cursor: 'pointer !important',
                        transition: 'all 0.2s',
                        '&:hover': {
                            boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
                            borderColor: isSelected ? '#309D6A' : '#DADADA'
                        }
                    }}
                    onClick={
                        isMinimalActions ?
                            handleOpen
                            :
                            classificationType !== SolicitationClassificationTypesStatusType.InCart ?
                                () => navigate(`/mis-solicitudes/${companyId}/${solicitationId}`)
                                :
                                undefined
                    }
                >
                    <Grid container spacing={{ xs: 1.5, md: 0.8 }}
                          alignItems="center"
                          padding={{ xs: '12px !important', md: (!isMinimalActions && !!onToggleSelection) ? '6.5px 0px 0px 0px !important' : '6.5px 0px 0px 14px !important' }}
                    >
                        {
                            (!isMinimalActions && !!onToggleSelection) && (
                            <Grid item xs={12} md={columnSizes[SolicitationCardsGridFields.CheckboxSelection]} sx={{
                                display: { xs: 'flex', md: 'block' },
                                height: '-webkit-fill-available',
                                alignContent: 'center',
                                justifyContent: { xs: 'center', md: 'flex-start' },
                                order: { xs: 10, md: 0 },
                                paddingLeft: paddingXInternal,
                                paddingY: paddingYInternal
                            }}>
                                <Box>
                                    <Tooltip title={disabledByCompany ? 'Podes seleccionar múltiples solicitudes mientras pertenezcan a una misma PyME' : undefined}>
                                        <div>
                                            <Checkbox
                                                onClick={(e) => e.stopPropagation()}
                                                checked={isSelected}
                                                disabled={disabledByCompany}
                                                onChange={() => onToggleSelection(solicitationId, companyId)}
                                                sx={{ padding: 0 }}
                                            />
                                        </div>
                                    </Tooltip>
                                </Box>
                            </Grid>
                        )}

                        {
                            !hideCompanyInfo && (
                                <Grid item xs={12} md={columnSizes[SolicitationCardsGridFields.CompanyBusinessName]} sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    height: '-webkit-fill-available',
                                    justifyContent: { xs: 'center', md: 'flex-start' },
                                    borderRight: { xs: 'none', md: '1px solid #ECECEC' },
                                    pr: { md: 2 },
                                    mr: { md: 1 },
                                    order: { xs: 0, md: 1 },
                                    paddingY: paddingYInternal
                                }}>
                                    <SolicitationCardCompanyInfo solicitation={solicitation} />
                                </Grid>
                            )}

                        <Grid item xs={12} md={columnSizes[SolicitationCardsGridFields.ProductLineDescription]} sx={{
                            textAlign: { xs: 'center', md: 'left' },
                            order: { xs: 1, md: 2 },
                            paddingY: paddingYInternal,
                        }}>
                            <SolicitationCardLineDescription solicitation={solicitation} />
                        </Grid>

                        <Grid item xs={12} sm={6} md={columnSizes[SolicitationCardsGridFields.ProductDesc]} sx={{
                            textAlign: { xs: 'center', md: 'left' },
                            order: { xs: 2, md: 3 },
                            paddingY: paddingYInternal,
                        }}>
                            <SolicitationCardProductDescription solicitation={solicitation} />
                        </Grid>

                        <Grid item xs={12} sm={6} md={columnSizes[SolicitationCardsGridFields.LastModified]}
                              sx={{
                                  textAlign: { xs: 'center', md: 'left' },
                                  alignContent: 'center',
                                  height: '-webkit-fill-available !important',
                                  order: { xs: 3, md: 4 },
                                  paddingY: paddingYInternal,
                              }}
                        >
                            <SolicitationCardLastModified solicitation={solicitation} />
                        </Grid>

                        <Grid item xs={12} sm={6} md={columnSizes[SolicitationCardsGridFields.Status]}
                              alignContent={'center'}
                              sx={{
                                  textAlign: { xs: 'center', md: 'end' },
                                  borderRight: { xs: 'none', md: '1px solid #ECECEC' },
                                  height: '-webkit-fill-available !important',
                                  paddingRight: '10px',
                                  order: { xs: 4, md: 5 },
                                  paddingY: paddingYInternal,
                              }}>
                            <SolicitationTableStatusCompanyChip solicitation={solicitation} />
                        </Grid>

                        {selectedIds.length === 0 && (
                            <Grid item xs={12} sm={6} md={columnSizes[SolicitationCardsGridFields.Actions]} sx={{
                                display: 'flex',
                                justifyContent: { xs: 'center', md: 'flex-end' },
                                order: { xs: 5, md: 6 },
                                paddingRight: paddingXInternal,
                                paddingY: paddingYInternal
                            }}>
                                <SolicitationCardActions solicitation={solicitation}
                                                         onReloadSolicitations={onReloadSolicitations}
                                                         isMinimalVariant={isMinimalActions}
                                />
                            </Grid>
                        )}
                    </Grid>
                </Box>
            </Box>
        </React.Fragment>
    );
};

export default SolicitationCard;
