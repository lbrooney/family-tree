import { Edge, Node } from "@xyflow/react";

export type BadgeData = {
    bgColor: string;
    label: string;
    textColor: string;
};

type FamilyMemberNodeData = {
    subtitles: string[];
    badges: BadgeData[];
    title: string;
    titleBgColor: string;
    titleTextColor: string;
    sex: "M" | "F";
    imageUrl?: string;
    isRoot?: boolean;
    relationToSelected?: string | null;
    onVisibilityChange: (isVisible: boolean) => void;
    isHidden?: boolean;
};

export type FamilyMemberNode = Node<FamilyMemberNodeData>;

type InnerFamilyEdgeData = {
    offsetY: number;
    familyIndex: number;
};

export type InnerFamilyEdge =  Edge<InnerFamilyEdgeData>
