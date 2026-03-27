import GuidesHtmlEmbeddedPage from "./GuidesHtmlEmbeddedPage";
import {useParams} from "react-router-dom";

function GuideLucInformationPage() {
    const { slug = 'que-es-luc' } = useParams();
    
    return (
        <GuidesHtmlEmbeddedPage urlBase={"ayuda"}
                                actualHtmlPage={slug}
        />
    )
}

export default GuideLucInformationPage;