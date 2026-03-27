import {DialogContent, Grid} from "@mui/material";
import React from "react";

interface SolicitationProposedCommunicationDialogSentContentProps {
    message: string;
}

function SolicitationProposedCommunicationDialogSentContent({message}: SolicitationProposedCommunicationDialogSentContentProps) {
    return (
        <DialogContent>
            <Grid container>
                <Grid item xs={12} container>
                    {message && (
                        <Grid item xs={12} container>
                            <Grid item xs={12}>
                                <div dangerouslySetInnerHTML={{ __html: message }} />
                            </Grid>
                        </Grid>
                    )}
                </Grid>
            </Grid>
        </DialogContent>
    )
}

export default SolicitationProposedCommunicationDialogSentContent;