import React, {useContext, useEffect, useMemo, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {useAction} from "hooks/useAction";
import {Grid} from "@mui/material";
import {Skeleton} from "@mui/lab";
import {BackButton} from "components/buttons/Buttons";
import ReportFromLookerStudio from "./ReportFromLookerStudio";
import {OffererContext} from "pages/offerer/components/OffererContextProvider";
import {EntityWithIdFields} from "types/baseEntities";

interface ReportsEmbeddedProps {
    offerer?: boolean
}

const ReportsEmbedded = (props: ReportsEmbeddedProps) => {
    const { reportId } = useParams();
    const { setTitle } = useAction();
    const navigate = useNavigate();
    
    const [reportIdParsed, setReportIdParsed] = useState<number>();

    setTitle(
        `Reportes`,
        <BackButton size={'small'} onClick={() => navigate(-1)} variant={'contained'} color={'inherit'}>Reportes</BackButton>
    );
    
    useEffect(() => {
        if (!reportIdParsed && reportId)
            setReportIdParsed(parseInt(reportId ?? '0'))
    }, [reportId]);
    
    return (
        <Grid container spacing={1}>
            {
                (!!reportIdParsed) ?
                    !!props.offerer ?
                        <ReportsEmbeddedWithOfferer reportId={reportIdParsed} />
                        :
                        <ReportsEmbeddedBase reportId={reportIdParsed} />
                    :
                    <Grid item xs={12}>
                        <Skeleton />
                    </Grid>
            }
        </Grid>
    );
}

interface ReportsEmbeddedBaseProps {
    reportId: number,
}

export const ReportsEmbeddedBase = ({ reportId }: ReportsEmbeddedBaseProps) => {
    return (
        <ReportFromLookerStudio reportId={reportId} />
    );
}

export const ReportsEmbeddedWithOfferer = ({ reportId }: ReportsEmbeddedBaseProps) => {
    const offerer = useContext(OffererContext);
    const offererId = useMemo(() => (
        (!!offerer) ? offerer[EntityWithIdFields.Id] : undefined
    ), [offerer]);

    return (
        (!!reportId && !!offererId) ?
            <ReportFromLookerStudio offererId={offererId}
                                    reportId={reportId}
            />
            :
            <Skeleton />
    );
}


export default ReportsEmbedded