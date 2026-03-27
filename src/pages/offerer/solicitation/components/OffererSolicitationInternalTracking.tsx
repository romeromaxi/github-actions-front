import React, {useState} from "react";
import {Card, CardContent, CardHeader} from "@mui/material";
import {HttpSolicitationsNotes} from "http/solicitations/httpSolicitationsNotes";
import {EntityWithIdFields} from "types/baseEntities";
import {useSolicitation} from "hooks/contexts/SolicitationsContext";
import SolicitationActivityList, {MixedItem} from "components/solicitations/SolicitationActivityList";
import {HttpFilesSolicitationManagement} from "http/index";

function OffererSolicitationInternalTracking() {
    const { solicitation } = useSolicitation();
    const [itemsCount, setItemsCount] = useState<number>();

    const fetchNotes = () => {
        if (solicitation) {
            return HttpSolicitationsNotes.search(solicitation[EntityWithIdFields.Id])
        }
        return Promise.resolve([]);
    }

    const fetchDocuments = () => {
        if (solicitation) {
            return HttpFilesSolicitationManagement.getList(solicitation[EntityWithIdFields.Id])
        }
        return Promise.resolve([]);
    }

    const onItemsLoaded = (items: MixedItem[]) => setItemsCount(items.length);
    
    if (itemsCount === 0)
        return null;
    
    return (
        <Card>
            <CardHeader title={'Seguimiento interno'}/>
            <CardContent>
                <SolicitationActivityList fetchNotes={fetchNotes}
                                          fetchDocuments={fetchDocuments}
                                          onItemsLoaded={onItemsLoaded}
                />
            </CardContent>
        </Card>
    )
}

export default OffererSolicitationInternalTracking;