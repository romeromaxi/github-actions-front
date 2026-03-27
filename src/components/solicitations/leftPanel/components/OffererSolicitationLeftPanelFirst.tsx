import {SolicitationViewDTO, SolicitationViewDTOFields} from "../../../../types/solicitations/solicitationData";
import {useNavigate} from "react-router-dom";
import {CompanyFileType} from "../../../../types/company/companyEnums";
import {Stack} from "@mui/material";
import CompactCardActionButton from "../../../cards/CompactCardActionButton";
import {BusinessTwoTone} from "@mui/icons-material";
import {EntityWithIdFields} from "../../../../types/baseEntities";
import React from "react";
import OffererSolicitationCompanyFileUpdates from "./OffererSolicitationCompanyFileUpdates";
import OffererPymeCurrentSolicitations from "./OffererPymeCurrentSolicitations";


interface OffererSolicitationLeftPanelFirstProps {
    solicitation: SolicitationViewDTO
}


const OffererSolicitationLeftPanelFirst = ({solicitation} : OffererSolicitationLeftPanelFirstProps) => {
    const navigate = useNavigate();
    const hasCreditFile =
        solicitation[SolicitationViewDTOFields.FileTypeCode] ===
        CompanyFileType.Long;

    return (
        <Stack spacing={1}>
            <CompactCardActionButton
                title={`Legajo de Contacto`}
                subtitle={`Hacé click para ver el Legajo enviado en esta solicitud`}
                icon={<BusinessTwoTone sx={{ fontSize: '30px' }} />}
                onClick={() => {
                    navigate({
                        pathname: `/offerer/solicitations/${solicitation[EntityWithIdFields.Id]}/solicitationFile${hasCreditFile ? '?tipo=2' : '?tipo=1'}`,
                    })
                }}
                subtitleTooltip={`Hacé click para ver el Legajo enviado en esta solicitud`}
            />
            <OffererSolicitationCompanyFileUpdates  />
            <OffererPymeCurrentSolicitations
                offererId={solicitation[SolicitationViewDTOFields.OffererId]}
                companyId={solicitation[SolicitationViewDTOFields.CompanyId]}
            />
        </Stack>
    );
}


export default OffererSolicitationLeftPanelFirst