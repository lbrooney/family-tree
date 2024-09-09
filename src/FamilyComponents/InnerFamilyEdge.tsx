import { uniqBy } from "../utils";
import { BaseEdge, type EdgeProps, getSmoothStepPath, Position, useReactFlow } from "@xyflow/react";
import { EDGE_XGAP_MODIFIER, NODE_HEIGHT } from "../tree/constants";
import type { FamilyMemberNode, InnerFamilyEdge } from "./types";

export const InnerFamilyTypeKey = "innerFamily";

export default function InnerFamilyEdge({
    id,
    source,
    target,
    sourceX,
    sourceY,
    targetX,
    targetY,
    style,
    data
}: EdgeProps<InnerFamilyEdge>) {
    const reactflow = useReactFlow<FamilyMemberNode, InnerFamilyEdge>();
    const edges = uniqBy(
        reactflow.getEdges().filter((edge) => edge.source === source),
        (edge) => edge.data?.familyIndex
    );
    const targetNode = reactflow.getInternalNode(target);

    const hiddenOffset = targetNode?.data?.isHidden ? NODE_HEIGHT / 2 : 0;

    const [edgePath] = getSmoothStepPath({
        sourceX: sourceX - edges.findIndex((edge) => edge.data?.familyIndex == data?.familyIndex) * EDGE_XGAP_MODIFIER,
        sourceY,
        sourcePosition: Position.Bottom,
        targetX,
        targetY,
        targetPosition: Position.Top,
        centerY: targetY - (data?.offsetY ?? 0) - hiddenOffset
    });

    return (
        <>
            <BaseEdge id={id} path={edgePath} style={style} />
        </>
    );
}
