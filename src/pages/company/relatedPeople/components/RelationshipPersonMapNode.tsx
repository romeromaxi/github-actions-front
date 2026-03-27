import {PersonRelationshipFields} from "types/person/personData";
import {PersonTypes} from "types/person/personEnums";
import {Factory, User} from "@phosphor-icons/react";
import React, {Fragment, useState} from "react";
import {Box, Paper, Typography} from "@mui/material";
import {Handle, Position} from "@xyflow/react";
import {WrapperIcons} from "components/icons/Icons";
import {stringFormatter} from "util/formatters/stringFormatter";
import RelatedPersonDetailMapDrawer from "./RelatedPersonDetailMapDrawer";
import {PersonaData} from "./RelationshipPersonMap";

interface RelationshipPersonMapNodeProps {
    data: PersonaData;
    isConnectable: boolean;
}

function RelationshipPersonMapNode({ data, isConnectable }: RelationshipPersonMapNodeProps) {
    const Icon = data[PersonRelationshipFields.PersonTypeCode] === PersonTypes.Legal ? Factory : User;
    const [open, setOpen] = useState<boolean>(false);
    const handleConnectionStyle = {
        background: "transparent", width: 0, height: 0,
    }
    const borderStyle = data.isMainPerson ? "3px solid #2e7d32" : "2px solid #E0E0E0"
    
    return (
        <Fragment>
            <Paper
                elevation={4}
                sx={{
                    minWidth: 220,
                    p: 2,
                    textAlign: "center",
                    borderRadius: 3,
                    border: borderStyle,
                }}
                onClick={() => setOpen(true)}
            >
                { /* @ts-ignore */ }
                <Handle
                    type="target"
                    position={Position.Top}
                    style={handleConnectionStyle}
                    isConnectable={isConnectable}
                    isValidConnection={() => false}
                />

                <Box display="flex" flexDirection="column" alignItems="center">
                    <WrapperIcons Icon={Icon} size={64} />

                    <Typography variant="subtitle1" fontWeight="bold" mt={1}>
                        {data[PersonRelationshipFields.LegalName]}
                    </Typography>

                    <Typography variant="caption" color="text.secondary">
                        {stringFormatter.formatCuit(data[PersonRelationshipFields.CUIT])}
                    </Typography>
                </Box>

                { /* @ts-ignore */ }
                <Handle
                    type="source"
                    position={Position.Bottom}
                    style={handleConnectionStyle}
                    isConnectable={isConnectable}
                    isValidConnection={() => false}
                />
            </Paper>
            
            <RelatedPersonDetailMapDrawer
                open={open}
                onClose={() => setOpen(false)}
                person={data}
            />
        </Fragment>
    );
}

export default RelationshipPersonMapNode;