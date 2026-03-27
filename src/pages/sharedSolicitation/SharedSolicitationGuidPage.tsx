import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {Box} from "@mui/material";
import {useAction} from "hooks/useAction";
import {SolicitationSharedViewDTO} from "types/solicitations/solicitationData";
import {HttpSharedSolicitation} from "http/solicitations/httpSharedSolicitation";
import SharedSolicitationGuidContent from "./SharedSolicitationGuidContent";
import SharedSolicitationGuidDialog from "./SharedSolicitationGuidDialog";
import {HttpSolicitationAccess} from "../../http/solicitations/httpSolicitationAccess";
import {BaseResponseFields} from "../../types/baseEntities";


const SharedSolicitationGuidPage = () => {
    const { guid } = useParams();
    const { showLoader, hideLoader } = useAction();
    const [open, setOpen] = useState<boolean>(true);
    const [solicitation, setSolicitation] = useState<SolicitationSharedViewDTO>()

    const cleanStorageAndHideLoader = () => {
        localStorage.removeItem(guid ?? '');
        hideLoader();
    }
    
    const loadSolicitation = (initializeLoader: boolean = false) => {
        if (guid) {
            if (initializeLoader) showLoader();
    
            HttpSharedSolicitation.getByGuid(guid ?? '')
                .then(s => {
                    setSolicitation(s);
                    setOpen(false);
                })
                .finally(hideLoader)
        }
    }
    
    useEffect(() => {
        if (guid && !solicitation && !open) {
            loadSolicitation(true);
        }
    }, [open, guid])

    useEffect(() => {
        const prevPin = localStorage.getItem(guid ?? '')
        if (guid && !solicitation && !!prevPin) {
            showLoader()
            HttpSolicitationAccess.validateState(guid)
                .then(response => {
                    if (!response[BaseResponseFields.HasError]) {
                        loadSolicitation();
                    } else {
                        cleanStorageAndHideLoader();
                    }
                })
                .catch(cleanStorageAndHideLoader)
        }
    }, [open, guid])
    
    return (
        <Box sx={{width: '100%', mt: 2}}>
            {
                open ?
                    <SharedSolicitationGuidDialog open={open} guid={guid ?? ''} onConfirm={() => setOpen(false)}/>
                    :
                    solicitation ? <SharedSolicitationGuidContent solicitation={solicitation} guid={guid ?? ''}/> : <></>
            }
        </Box>
    )
}


export default SharedSolicitationGuidPage