import { BaseEdge, EdgeProps, Node, getStraightPath, useEdges, useNodes, useInternalNode } from "@xyflow/react";
import { calcCoupleEdgeYOffset } from "../tree/utils";

export const CoupleEdgeTypeKey = "couple";

function getNodeCenter(node: Node) {
    const w = (node.measured?.width ?? 0) / 2;
    const h = (node.measured?.height ?? 0) / 2;
    const nodeX = node.position.x ?? 0;
    const nodeY = node.position.y ?? 0;

    const x = nodeX + w;
    const y = nodeY + h;

    return { x, y };
}

export default function CoupleEdge({ id, source, target, style }: EdgeProps) {
    const sourceNode = useInternalNode(source);
    const targetNode = useInternalNode(target);
    const edges = useEdges();
    const nodes = useNodes();

    if (!sourceNode || !targetNode) {
        return null;
    }

    const sourceCenter = getNodeCenter(sourceNode);
    const targetCenter = getNodeCenter(targetNode);

    const sameGenEdges = edges
        .filter((edge) => {
            const isHorizontalEdge = edge.type == CoupleEdgeTypeKey;
            if (!isHorizontalEdge) return false;

            const sourceEdgePosition = nodes.find((node) => node.id == edge.source)?.position;
            const targetEdgePosition = nodes.find((node) => node.id == edge.target)?.position;
            if (!sourceEdgePosition || !targetEdgePosition) return false;

            const sameY = sourceEdgePosition.y == sourceNode.position.y;
            return sameY;
        })
        .map((edge) => edge.id)
        .sort();
    const edgeIndexInGen = sameGenEdges.indexOf(id);

    const offsetY = calcCoupleEdgeYOffset(edgeIndexInGen) * 10;

    const [edgePath] = getStraightPath({
        sourceX: sourceCenter.x,
        sourceY: sourceCenter.y + (offsetY ?? 0),
        targetX: targetCenter.x,
        targetY: targetCenter.y + (offsetY ?? 0)
    });

    return (
        <BaseEdge id={id} path={edgePath} style={style} />
    );
}
