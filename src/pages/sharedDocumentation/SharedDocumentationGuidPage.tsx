import {useParams} from "react-router-dom";
import {useAction} from "../../hooks/useAction";
import React, {useEffect, useState} from "react";
import {Box} from "@mui/material";
import {HttpSharedFiles} from "../../http/files/httpSharedFiles";
import {SharedDocumentationData} from "../../types/files/sharedDocumentation";
import SharedDocumentationGuidDialog from "./SharedDocumentationGuidDialog";
import SharedDocumentationGuidContent from "./SharedDocumentationGuidContent";


const SharedDocumentationGuidPage = () => {
    const { guid } = useParams();
    const { showLoader, hideLoader } = useAction();
    const [open, setOpen] = useState<boolean>(true)
    const [docs, setDocs] = useState<SharedDocumentationData>()

    useEffect(() => {
        if (guid && !docs && !open) {
            showLoader();
            HttpSharedFiles.getDataByGuid(guid)
                .then(setDocs)
                .finally(hideLoader)
        }
    }, [open, guid])

    return (
        <Box sx={{width: '100%', mt: 2}}>
            {
                open ?
                    <SharedDocumentationGuidDialog open={open} guid={guid ?? ''} onConfirm={() => setOpen(false)}/>
                    :
                    docs ? <SharedDocumentationGuidContent docsData={docs} guid={guid ?? ''}/> : <></>
            }
        </Box>
    )
}


export default SharedDocumentationGuidPage