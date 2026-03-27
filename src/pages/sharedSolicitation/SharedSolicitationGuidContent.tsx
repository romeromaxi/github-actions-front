import {SolicitationSharedViewDTO} from "../../types/solicitations/solicitationData";
import {NavsTabVertical} from "../../components/navs/NavsTab";
import SharedSolicitationGuidCompanyFile from "./tabs/SharedSolicitationGuidCompanyFile";
import SharedSolicitationGuidAnalysis from "./tabs/SharedSolicitationGuidAnalysis";
import SharedSolicitationGuidHeader from "./components/SharedSolicitationGuidHeader";


interface SharedSolicitationGuidContentProps {
    solicitation: SolicitationSharedViewDTO,
    guid: string
}


const SharedSolicitationGuidContent = ({solicitation, guid} : SharedSolicitationGuidContentProps) => {
    
    return (
        <NavsTabVertical tabSize={4} lstTabs={[
            {tabList: [
                    {
                        label: 'Solicitud y legajo',
                        content: <SharedSolicitationGuidCompanyFile solicitation={solicitation} />,
                        default: true
                    },
                    {
                        label: 'Respuesta',
                        content: <SharedSolicitationGuidAnalysis guid={guid} />,
                    }
            ]}
        ]}
                         header={<SharedSolicitationGuidHeader solicitation={solicitation} />}
        />
    )
}

export default SharedSolicitationGuidContent