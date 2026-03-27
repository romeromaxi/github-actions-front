import {ProfilePersonTypes} from "../../../types/person/personData";
import {SolicitationViewDTO, SolicitationViewDTOFields} from "../../../types/solicitations/solicitationData";
import {AllowedSystems, PanelContentMap} from "../leftPanel/SolicitationLeftPanelComponent";
import CompanySolicitationRightPanelFirst from "./components/CompanySolicitationRightPanelFirst";
import OffererSolicitationRightPanelFirst from "./components/OffererSolicitationRightPanelFirst";
import CompanySolicitationRightPanelThird from "./components/CompanySolicitationRightPanelThird";
import OffererSolicitationRightPanelThird from "./components/OffererSolicitationRightPanelThird";


interface SolicitationRightPanelComponentProps {
    variant: ProfilePersonTypes,
    solicitation: SolicitationViewDTO
}

const SolicitationRightPanelComponent = ({variant, solicitation} : SolicitationRightPanelComponentProps) => {
    const system = solicitation[SolicitationViewDTOFields.SystemCode] as AllowedSystems
    
    const contentMap: PanelContentMap = {
        1: {
            [ProfilePersonTypes.Company]: CompanySolicitationRightPanelFirst,
            [ProfilePersonTypes.Offerer]: OffererSolicitationRightPanelFirst
        },
        3: {
            [ProfilePersonTypes.Company]: CompanySolicitationRightPanelThird,
            [ProfilePersonTypes.Offerer]: OffererSolicitationRightPanelThird 
        }
    };
    
    
    const RightPanel = contentMap[system]?.[variant];

    if (!RightPanel) {
        return null;
    }

    return <RightPanel solicitation={solicitation} />;
}


export default SolicitationRightPanelComponent