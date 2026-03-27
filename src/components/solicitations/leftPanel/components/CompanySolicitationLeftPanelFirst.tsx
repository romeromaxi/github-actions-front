import {SolicitationViewDTO, SolicitationViewDTOFields} from "../../../../types/solicitations/solicitationData";
import {useNavigate} from "react-router-dom";
import {CompanyFileType} from "../../../../types/company/companyEnums";
import {Alert, Badge, Stack} from "@mui/material";
import {dateFormatter} from "../../../../util/formatters/dateFormatter";
import CompactCardActionButton from "../../../cards/CompactCardActionButton";
import {BusinessTwoTone} from "@mui/icons-material";
import {EntityWithIdFields} from "../../../../types/baseEntities";
import NotificationsActiveOutlinedIcon from "@mui/icons-material/NotificationsActiveOutlined";
import React from "react";
import CompanyCurrentSolicitations from "./CompanyCurrentSolicitations";


interface CompanySolicitationLeftPanelFirstProps {
    solicitation: SolicitationViewDTO
}


const CompanySolicitationLeftPanelFirst = ({solicitation} : CompanySolicitationLeftPanelFirstProps) => {
    const navigate = useNavigate();
    const hasCreditFile =
        solicitation[SolicitationViewDTOFields.FileTypeCode] ===
        CompanyFileType.Long;
    const requiresUpdate =
        solicitation[SolicitationViewDTOFields.RequestEditCompanyFile];

    return (
        <Stack spacing={1}>
            {requiresUpdate && (
                <Alert
                    severity={'info'}
                >{`El día ${dateFormatter.toShortDate(solicitation[SolicitationViewDTOFields.LastRequestEditCompanyFileDate])} se solicitó actualizar el legajo`}</Alert>
            )}
            <CompactCardActionButton
                title={`Legajo de Contacto`}
                subtitle={
                    requiresUpdate
                        ? 'Hace click para actualizar el legajo'
                        : `Hacé click para ver el Legajo enviado en esta solicitud`
                }
                icon={<BusinessTwoTone sx={{ fontSize: '30px' }} />}
                onClick={() => {
                    requiresUpdate
                            ? navigate({
                                pathname: `/mis-presentaciones/solicitud/${solicitation?.[SolicitationViewDTOFields.CompanyId]}/${solicitation?.[EntityWithIdFields.Id]}/legajo/detalle?tipo=2`,
                            })
                            : navigate({
                                pathname: `/mis-solicitudes/${solicitation[SolicitationViewDTOFields.CompanyId]}/${solicitation[EntityWithIdFields.Id]}/solicitationFile${hasCreditFile ? '?tipo=2' : '?tipo=1'}`,
                            });
                }}
                subtitleTooltip={
                    requiresUpdate
                        ? 'Hace click para actualizar el legajo'
                        : `Hacé click para ver el Legajo enviado en esta solicitud`
                }
                iconHeader={
                    requiresUpdate ? (
                        <Badge
                            variant={'dot'}
                            color={'success'}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'right',
                            }}
                        >
                            <NotificationsActiveOutlinedIcon
                                color={'success'}
                                fontSize={'small'}
                            />
                        </Badge>
                    ) : undefined
                }
            />
            {/*<CompanySolicitationCompanyFileUpdates />*/}
            {/*<CompanyCurrentSolicitations offererId={solicitation[SolicitationViewDTOFields.OffererId]} 
                                         companyId={solicitation[SolicitationViewDTOFields.CompanyId]}
            />*/}
        </Stack>
    );
}


export default CompanySolicitationLeftPanelFirst