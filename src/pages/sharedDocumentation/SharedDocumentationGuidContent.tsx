import {SharedDocumentationData} from "../../types/files/sharedDocumentation";
import {NavsTabVertical} from "../../components/navs/NavsTab";
import SharedDocumentationTab from "./tabs/SharedDocumentationTab";
import SharedDocumentationTabsHeader from "./SharedDocumentationTabsHeader";


interface SharedDocumentationGuidContentProps {
    docsData: SharedDocumentationData,
    guid: string
}


const SharedDocumentationGuidContent = ({docsData, guid} : SharedDocumentationGuidContentProps) => {
    
    return (
        <NavsTabVertical tabSize={4}
                         lstTabs={[
                             {
                                 tabList: [
                                     {label: 'Documentos Compartidos', content: <SharedDocumentationTab guid={guid} />, default: true }
                                 ]
                             }
                         ]}
                         header={<SharedDocumentationTabsHeader data={docsData}/>}
        />
    )
}


export default SharedDocumentationGuidContent