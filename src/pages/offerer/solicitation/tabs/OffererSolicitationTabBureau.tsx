import {Stack} from "@mui/material";
import CompanyBureauInfo from "../../../bureau/CompanyBureauInfo";
import {useSolicitation} from "hooks/contexts/SolicitationsContext";
import {SolicitationViewDTOFields} from "types/solicitations/solicitationData";
import {CompanyFileSourceType} from "types/company/companyEnums";

function OffererSolicitationTabBureau() {
  const { solicitation } = useSolicitation();
  const companyFileId = solicitation?.[SolicitationViewDTOFields.FileId]
  
  return (
    <Stack direction={"column"} spacing={1}>
      {
          companyFileId &&
            <CompanyBureauInfo dataId={companyFileId} 
                               dataSource={CompanyFileSourceType.CompanyFile}
                               defaultTab={'bcra'} 
                               hideActions
            />
      }
    </Stack>
  )
}

export default OffererSolicitationTabBureau;