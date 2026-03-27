import React, {useEffect} from "react";
import {
    Background,
    BackgroundVariant,
    Edge,
    MarkerType,
    Node,
    Position,
    ReactFlow,
    ReactFlowProvider,
    useEdgesState,
    useNodesState,
    useReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import {Box} from "@mui/material";
import {PersonRelationship, PersonRelationshipFields} from "types/person/personData";
import dagre from "@dagrejs/dagre";
import RelationshipPersonMapNode from "./RelationshipPersonMapNode";
import RelationshipPersonMapEdge from "./RelationshipPersonMapEdge";
import {PersonTypes} from "../../../../types/person/personEnums";

function measureEdgeLabels(edges: Edge[]): Record<string, { width: number; height: number }> {
    const defaultSize = { width: 220, height: 60 };
    const result: Record<string, { width: number; height: number }> = {};
    edges.forEach(edge => {
        result[edge.id] = defaultSize;
    });
    return result;
}

export interface PersonaData extends Record<string, unknown>, PersonRelationship {
    isMainPerson?: boolean;
}

interface RelationshipPersonMapProps {
    relationshipData?: PersonRelationship[];
    mainPersonId?: number;
}

const nodeTypes = {
    PersonNode: RelationshipPersonMapNode,
};

const transformDataToNodesAndEdges = (data: PersonRelationship[], mainPersonId?: number) => {
    const personsMap = new Map<number, PersonRelationship>();

    data.forEach(item => {
        personsMap.set(item.idPersona, item);
        if (item.idPersonaBase && !personsMap.has(item.idPersonaBase)) {
            const basePersonData = data.find(d => d.idPersona === item.idPersonaBase);
            if (basePersonData) {
                personsMap.set(item.idPersonaBase, basePersonData);
            }
        }
    });

    const basePerson = data.find(item => !item.idPersonaBase);
    const actualMainPersonId = mainPersonId ?? basePerson?.idPersona;

    const nodes: Node<PersonaData>[] = [];

    personsMap.forEach((person, id) => {
        const isMainPerson = id === actualMainPersonId;

        const isLegalPerson = person[PersonRelationshipFields.PersonTypeCode] === PersonTypes.Legal;

        nodes.push({
            id: id.toString(),
            type: "PersonNode",
            position: { x: 0, y: 0 },
            data: {
                ...person,
                isMainPerson
            },
            sourcePosition: isLegalPerson ? Position.Bottom : Position.Right,
            targetPosition: isLegalPerson ? Position.Top : Position.Left,
        });
    });

    const edges: Edge[] = [];
    const processedRelations = new Set<string>();

    data.forEach(item => {
        if (item.idPersonaBase) {
            const relationKey = `${Math.min(item.idPersona, item.idPersonaBase)}-${Math.max(item.idPersona, item.idPersonaBase)}`;

            if (!processedRelations.has(relationKey)) {
                processedRelations.add(relationKey);

                const sourcePerson = personsMap.get(item.idPersonaBase);
                const targetPerson = personsMap.get(item.idPersona);

                let sourceId = item.idPersonaBase.toString();
                let targetId = item.idPersona.toString();

                if (sourcePerson && targetPerson) {
                    const sourceIsLegal = sourcePerson[PersonRelationshipFields.PersonTypeCode] === PersonTypes.Legal;
                    const targetIsLegal = targetPerson[PersonRelationshipFields.PersonTypeCode] === PersonTypes.Legal;

                    if (sourceIsLegal && !targetIsLegal) {
                        sourceId = item.idPersonaBase.toString();
                        targetId = item.idPersona.toString();
                    } else if (!sourceIsLegal && targetIsLegal) {
                        sourceId = item.idPersona.toString();
                        targetId = item.idPersonaBase.toString();
                    }
                }

                edges.push({
                    id: `e${sourceId}-${targetId}`,
                    source: sourceId,
                    target: targetId,
                    data: { relationship: item },
                    type: "custom",
                    style: { stroke: "#2e7d32", strokeWidth: 2 },
                    markerEnd: {
                        type: MarkerType.ArrowClosed,
                        color: '#2e7d32',
                    },
                });
            }
        }
    });

    return { nodes, edges };
};

const defaultNodes: Node<PersonaData>[] = [];

const defaultEdges: Edge[] = [];

const edgeTypes = {
    custom: RelationshipPersonMapEdge,
};

const RelationshipPersonMapInner = ({relationshipData, mainPersonId} : RelationshipPersonMapProps) => {
    const [nodes, setNodes, onNodesChange] = useNodesState(defaultNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(defaultEdges);
    const { fitView } = useReactFlow();

    useEffect(() => {
        if (relationshipData && relationshipData.length > 0) {
            const { nodes: newNodes, edges: newEdges } = transformDataToNodesAndEdges(relationshipData, mainPersonId);
            const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(newNodes, newEdges, "TB");
            setNodes(layoutedNodes);
            setEdges(layoutedEdges);
        }
    }, [relationshipData, mainPersonId, setNodes, setEdges]);

    useEffect(() => {
        setTimeout(() => {
            fitView({
                padding: 0.1,
                maxZoom: 0.8,
                minZoom: 0.3,
                duration: 800
            });
        }, 100);
    }, [fitView, nodes]);

    const getLayoutedElements = (
        nodes: Node[],
        edges: Edge[],
        direction: "TB" | "LR" = "TB"
    ) => {
        const dagreGraph = new dagre.graphlib.Graph();
        dagreGraph.setDefaultEdgeLabel(() => ({}));

        dagreGraph.setGraph({
            rankdir: direction,
            ranksep: 120,
            nodesep: 80,
            marginx: 50,
            marginy: 50
        });

        const nodeWidth = 220;
        const nodeHeight = 60;

        const edgeLabels = measureEdgeLabels(edges);

        nodes.forEach((node) => {
            dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
        });

        edges.forEach((edge) => {
            const labelSize = edgeLabels[edge.id] || { width: 0, height: 0 };
            dagreGraph.setEdge(edge.source, edge.target, {
                minlen: 2,
                width: labelSize.width,
                height: labelSize.height,
                labelpos: 'c',
                labeloffset: 10,
            });
        });

        dagre.layout(dagreGraph);

        nodes.forEach((node) => {
            const nodeWithPosition = dagreGraph.node(node.id);
            node.position = {
                x: nodeWithPosition.x - nodeWidth / 2,
                y: nodeWithPosition.y - nodeHeight / 2,
            };

            const originalNode = nodes.find(n => n.id === node.id);
            if (originalNode) {
                node.sourcePosition = originalNode.sourcePosition;
                node.targetPosition = originalNode.targetPosition;
            }
        });

        return { nodes, edges };
    };

    return (
        <Box sx={{ width: "100%" }}>
            <Box sx={{ width: "100%", height: "calc(65vh - 80px)" }}>
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    edgeTypes={edgeTypes}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    nodeTypes={nodeTypes}
                    attributionPosition="top-center"
                    defaultViewport={{ x: 0, y: 0, zoom: 0.75 }}
                    minZoom={0.3}
                    maxZoom={1.2}
                >
                    <Background variant={BackgroundVariant.Cross} gap={12} size={0.5} />
                </ReactFlow>
            </Box>
        </Box>
    );
};

const RelationshipPersonMap: React.FC<RelationshipPersonMapProps> = ({ relationshipData, mainPersonId }) => (
    <ReactFlowProvider>
        <RelationshipPersonMapInner relationshipData={relationshipData} mainPersonId={mainPersonId} />
    </ReactFlowProvider>
);

export default RelationshipPersonMap;