import { EntityWithIdAndDescription } from "types/baseEntities";
import {Table, TableBody, TableCell, TableHead, TableRow} from "@mui/material";
import SolicitationTrackingOffererRow from "./components/SolicitationTrackingOffererRow";
import {Skeleton} from "@mui/lab";
import React from "react";
import {SolicitationTrackingView} from "../../../types/solicitations/solicitationTrackingData";

interface SolicitationTrackingTableOffererProps {
    solicitationId: number,
    dataTrackings: SolicitationTrackingView[] | undefined,
    loadTrackingStatus: () => Promise<EntityWithIdAndDescription[]> | undefined,
    onReload: () => void,
    allowEdit?: boolean
}

function SolicitationTrackingTableOfferer({
    solicitationId, dataTrackings, loadTrackingStatus, onReload, allowEdit 
}: SolicitationTrackingTableOffererProps) {
    return (
        <Table variant={'basic-style'}>
            <TableHead>
                <TableRow>
                    <TableCell>Entidad</TableCell>
                    <TableCell>Estado</TableCell>
                    <TableCell>Observaciones</TableCell>
                    { allowEdit && <TableCell /> }
                </TableRow>
            </TableHead>

            <TableBody>
                {
                    dataTrackings ?
                        dataTrackings.map(tracking => (
                            <SolicitationTrackingOffererRow solicitationId={solicitationId}
                                                            tracking={tracking}
                                                            loadTrackingStatus={loadTrackingStatus}
                                                            onReload={onReload}
                                                            allowEdit={allowEdit}
                            />
                        ))
                        :
                        Array.from({ length: 3 }).map((_, idx) => (
                            <TableRow key={`solicitationTrackingOffererLoading_${idx}`}>
                                <TableCell colSpan={4}>
                                    <Skeleton />
                                </TableCell>
                            </TableRow>
                        ))
                }
            </TableBody>
        </Table>
    )
}

export default SolicitationTrackingTableOfferer;