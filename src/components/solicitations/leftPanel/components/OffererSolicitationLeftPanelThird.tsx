import {SolicitationViewDTO, SolicitationViewDTOFields} from "../../../../types/solicitations/solicitationData";
import {useNavigate} from "react-router-dom";
import {CompanyFileType} from "../../../../types/company/companyEnums";
import {Stack} from "@mui/material";
import CompactCardActionButton from "../../../cards/CompactCardActionButton";
import {BusinessTwoTone} from "@mui/icons-material";
import {EntityWithIdFields} from "../../../../types/baseEntities";
import OffererPymeCurrentSolicitations from "./OffererPymeCurrentSolicitations";
import React from "react";
import OffererSolicitationCompanyFileUpdatesThird from "./OffererSolicitationCompanyFileUpdatesThird";


interface OffererSolicitationLeftPanelThirdProps {
    solicitation: SolicitationViewDTO
}


const OffererSolicitationLeftPanelThird = ({solicitation} : OffererSolicitationLeftPanelThirdProps) => {
    const navigate = useNavigate();
    const hasCreditFile =
        solicitation[SolicitationViewDTOFields.FileTypeCode] ===
        CompanyFileType.Long;

    return (
        <Stack spacing={1}>
            <CompactCardActionButton
                title={`Formulario de Contacto`}
                subtitle={`Hacé click para ver el Formulario enviado en esta solicitud`}
                icon={<BusinessTwoTone sx={{ fontSize: '30px' }} />}
                onClick={() => {
                    navigate({
                        pathname: `/offerer/solicitations/${solicitation[EntityWithIdFields.Id]}/solicitationFile${hasCreditFile ? '?tipo=2' : '?tipo=1'}`,
                    })
                }}
                subtitleTooltip={`Hacé click para ver el Formulario enviado en esta solicitud`}
            />
            <OffererSolicitationCompanyFileUpdatesThird  />
            <OffererPymeCurrentSolicitations
                offererId={solicitation[SolicitationViewDTOFields.OffererId]}
                companyId={solicitation[SolicitationViewDTOFields.CompanyId]}
            />
        </Stack>
    );
}


export default OffererSolicitationLeftPanelThird