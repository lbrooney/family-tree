import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ReactFlowProvider } from "@xyflow/react";
import { RawFamilyMember, buildFamilyAndRelations, RawFamilyRelation } from "./utils";
import { FamilyTree } from "./FamilyTree";
import rawFamily from "../tests/family1.json";
import "./index.css";
import "@xyflow/react/dist/style.css";

declare global {
    interface Window {
        showTree: (
            element: HTMLElement,
            familyMembers: RawFamilyMember[],
            familyRelations: RawFamilyRelation[],
            rootId: string | null
        ) => void;
        showDefaultTree: () => void;
    }
}

window.showTree = (
    element: HTMLElement,
    familyMembers: RawFamilyMember[],
    familyRelations: RawFamilyRelation[],
    rootId: string | null
) => {
    const [familyMembersRecord, familyRelationsRecord] = buildFamilyAndRelations(
        familyMembers as RawFamilyMember[],
        familyRelations as RawFamilyRelation[]
    );
    const rootMember = rootId ? familyMembersRecord[rootId] : Object.values(familyMembersRecord)[0];

    createRoot(element).render(
        <StrictMode>
            <ReactFlowProvider>
                <div style={{ height: "100vh", width: "100%" }}>
                    <FamilyTree
                        familyMembers={familyMembersRecord}
                        familyRelations={familyRelationsRecord}
                        rootMember={rootMember}
                    />
                </div>
            </ReactFlowProvider>
        </StrictMode>
    );
};

window.showTree(
    document.getElementById("root")!,
    rawFamily.familyMembers as RawFamilyMember[],
    rawFamily.familyRelations as RawFamilyRelation[],
    "3"
);
