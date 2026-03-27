import React, {Fragment} from "react";
import {BaseEdge, EdgeProps, getBezierPath} from "@xyflow/react";
import {Paper, Stack, Typography} from "@mui/material";
import {PersonRelationship, PersonRelationshipFields} from "types/person/personData";
import {TypographyBase} from "components/misc/TypographyBase";

interface RelationshipPersonMapEdgeProps extends EdgeProps {
    data: { relationship: PersonRelationship }
}

interface RelationshipPersonMapEdgeRelationLabelProps {
    label: string,
    value: string | undefined
}

function RelationshipPersonMapEdgeRelationLabel({label, value}: RelationshipPersonMapEdgeRelationLabelProps) {
    return (
        <Stack direction={'row'} alignItems={'center'} spacing={1} sx={{ flexWrap: 'nowrap' }}>
            <TypographyBase variant={'caption'}
                            fontWeight={600}
                            fontSize={'0.6rem'}
                            maxLines={1}
                            tooltip
                            sx={{ whiteSpace: 'nowrap' }}
            >
                {`${label}:`}
            </TypographyBase>
            <Typography color={'text.lighter'} 
                        variant={'caption'}
                sx={{ fontSize: 10, lineHeight: 1.2 }}
            >
                {value || ''}
            </Typography>
        </Stack>
    )
}

function RelationshipPersonMapEdge({ id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, style = {}, data, }
                                   : RelationshipPersonMapEdgeProps) {

    const [edgePath, labelX, labelY] = getBezierPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
    });

    const renderRelationshipLabel = (relationship: PersonRelationship) => {
        const hasAnyRelationship =
            relationship[PersonRelationshipFields.PositionAuthorityDesc] ||
            relationship[PersonRelationshipFields.PositionEmployeeDesc] ||
            relationship[PersonRelationshipFields.PositionOthersDesc] ||
            (relationship[PersonRelationshipFields.ParticipationPercent] && relationship[PersonRelationshipFields.ParticipationPercent] !== 0) ||
            relationship[PersonRelationshipFields.PositionSpouseDesc];

        if (!hasAnyRelationship) return null;

        return (
            <Stack spacing={0.5} sx={{ minWidth: 110 }}>
                {
                    relationship[PersonRelationshipFields.PositionAuthorityDesc] && (
                        <RelationshipPersonMapEdgeRelationLabel label={'Autoridad'} 
                                                                value={relationship[PersonRelationshipFields.PositionAuthorityDesc]}
                        />)
                }
                
                {
                    relationship[PersonRelationshipFields.PositionEmployeeDesc] && (
                        <RelationshipPersonMapEdgeRelationLabel label={'Empleado'}
                                                                value={relationship[PersonRelationshipFields.PositionEmployeeDesc]}
                        />)
                }

                {
                    !!relationship[PersonRelationshipFields.ParticipationPercent] &&
                    relationship[PersonRelationshipFields.ParticipationPercent] !== 0 && (
                        <RelationshipPersonMapEdgeRelationLabel label={'Socio'}
                                                                value={`${relationship[PersonRelationshipFields.ParticipationPercent]} %`}
                        />)
                }

                {
                    relationship[PersonRelationshipFields.PositionSpouseDesc] && (
                        <RelationshipPersonMapEdgeRelationLabel label={'Cónyuge'}
                                                                value={relationship[PersonRelationshipFields.PositionSpouseDesc]}
                        />)
                }
                
                {
                    relationship[PersonRelationshipFields.PositionOthersDesc] && (
                        <RelationshipPersonMapEdgeRelationLabel label={'Otros'}
                                                                value={relationship[PersonRelationshipFields.PositionOthersDesc]}
                        />)
                }
            </Stack>
        );
    };

    return (
        <Fragment>
            <BaseEdge id={id} path={edgePath} style={style} type="straight"/>
            {data?.relationship && (
                <foreignObject
                    width={250}
                    height={120}
                    x={labelX - 125}
                    y={labelY - 60}
                    requiredExtensions="http://www.w3.org/1999/xhtml"
                >
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Paper
                            elevation={3}
                            sx={{
                                p: 1.5,
                                borderRadius: 2,
                                border: '1px solid #e0e0e0',
                                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                backdropFilter: 'blur(4px)',
                                maxWidth: 220,
                                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                            }}
                        >
                            {renderRelationshipLabel(data.relationship)}
                        </Paper>
                    </div>
                </foreignObject>
            )}
        </Fragment>
    );
}

export default RelationshipPersonMapEdge;