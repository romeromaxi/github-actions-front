import { ProfilePersonTypes } from "../../../types/person/personData";
import { SolicitationViewDTO, SolicitationViewDTOFields } from "../../../types/solicitations/solicitationData";
import CompanySolicitationLeftPanelFirst from "./components/CompanySolicitationLeftPanelFirst";
import OffererSolicitationLeftPanelFirst from "./components/OffererSolicitationLeftPanelFirst";
import CompanySolicitationLeftPanelThird from "./components/CompanySolicitationLeftPanelThird";
import OffererSolicitationLeftPanelThird from "./components/OffererSolicitationLeftPanelThird";

interface SolicitationLeftPanelComponentProps {
    variant: ProfilePersonTypes;
    solicitation: SolicitationViewDTO;
}

export type AllowedSystems = 1 | 3;

export type PanelProps = {
    solicitation: SolicitationViewDTO;
};

export type PanelContentMap = {
    [K in AllowedSystems]: {
        [P in ProfilePersonTypes]: React.ComponentType<PanelProps>;
    };
};

const SolicitationLeftPanelComponent = ({ variant, solicitation }: SolicitationLeftPanelComponentProps) => {
    const contentMap: PanelContentMap = {
        1: {
            [ProfilePersonTypes.Company]: CompanySolicitationLeftPanelFirst,
            [ProfilePersonTypes.Offerer]: OffererSolicitationLeftPanelFirst
        },
        3: {
            [ProfilePersonTypes.Company]: CompanySolicitationLeftPanelThird,
            [ProfilePersonTypes.Offerer]: OffererSolicitationLeftPanelThird
        }
    };

    const system = solicitation[SolicitationViewDTOFields.SystemCode] as AllowedSystems;
    const LeftPanel = contentMap[system]?.[variant];

    if (!LeftPanel) {
        return null;
    }

    return <LeftPanel solicitation={solicitation} />;
};

export default SolicitationLeftPanelComponent;