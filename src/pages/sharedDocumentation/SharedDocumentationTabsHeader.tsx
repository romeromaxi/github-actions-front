import {SharedDocumentationData, SharedDocumentationDataFields} from "../../types/files/sharedDocumentation";
import {Stack} from "@mui/material";
import {DataWithLabel} from "../../components/misc/DataWithLabel";
import {dateFormatter} from "../../util/formatters/dateFormatter";


interface SharedDocumentationTabsHeaderProps {
    data: SharedDocumentationData
}


const SharedDocumentationTabsHeader = ({data} : SharedDocumentationTabsHeaderProps) => {
    
    return (
        <Stack spacing={1} mb={1}>
            <DataWithLabel label={'Fecha de envío'} data={dateFormatter.toShortDate(data[SharedDocumentationDataFields.DateSent])} rowDirection />
            <DataWithLabel label={'Mail del remitente'} data={data[SharedDocumentationDataFields.SenderMail]} rowDirection />
            <DataWithLabel label={'Mensaje'} data={data[SharedDocumentationDataFields.Observations] ?? '-'} />
        </Stack>
    )
}


export default SharedDocumentationTabsHeader