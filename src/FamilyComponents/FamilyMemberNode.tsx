import { memo } from "react";
import { Handle, NodeProps, Position } from "@xyflow/react";
import type { BadgeData, FamilyMemberNode } from "./types";
import Female from "./Female";
import Male from "./Male";
import "./FamilyMemberNode.css";

function Chips({ label, bgColor, textColor }: BadgeData) {
    return (
        <div className="chip" style={{ backgroundColor: bgColor, color: textColor }}>
            {label}
        </div>
    );
}

interface ProfileImageProps {
    imageUrl?: string
    sex: 'M' | 'F'
}
const ProfileImageMemo = memo(function ProfileImage({imageUrl, sex}: ProfileImageProps) {
    if (imageUrl) {
        return <img src={imageUrl} alt={sex} width="40px" height="40px" />;
    }
    if (sex === "F") {
        return <Female width="40px" height="40px" />;
    }
    if (sex === "M") {
        return <Male width="40px" height="40px" />;
    }
    return undefined;
})

function changeLabelVisibility(id: string, visibility: string) {
    const elementById = document.getElementById(id);
    if (elementById !== null) {
        elementById.style.visibility = visibility;
    }
}
function FamilyMemberNodeUI({ id, data }: NodeProps<FamilyMemberNode>) {
    const titleBgColor = data.titleBgColor;
    const titleTextColor = data.titleTextColor;

    if (data.isHidden) {
        return (
            <>
                <div
                    className="small-node"
                    onClick={() => {
                        data.onVisibilityChange(true);
                    }}
                >
                    <Handle type="target" position={Position.Top} />
                    <div
                        className="plus div-hover-able"
                        onMouseOver={() => changeLabelVisibility(id, "visible")}
                        onMouseLeave={() => changeLabelVisibility(id, "hidden")}
                    >
                        +
                    </div>
                    <Handle type="source" position={Position.Bottom} />
                </div>
                <div className="label-alt" id={id}>
                    {data.title}
                </div>
            </>
        );
    }
    return (
        <div className={`family-member-node ${data.isRoot ? "root-node" : ""}`}>
            <Handle type="target" position={Position.Top} />
            <div>
                <div className="node-title" style={{ color: titleTextColor, backgroundColor: titleBgColor }}>
                    <label htmlFor="text">{data.title}</label>
                    <div className="minus-node" onClick={() => data.onVisibilityChange(false)}>
                        <div className="minus-sign">-</div>
                    </div>
                </div>
                <div className="content">
                    <div className="text-content">
                        {data.subtitles.map((subtitle, index) => {
                            return (
                                <div key={index}>
                                    <span className="subtitle-key">{subtitle}</span>
                                </div>
                            );
                        })}

                        {data.relationToSelected && <div className="relation">relation: {data.relationToSelected}</div>}
                    </div>
                    <ProfileImageMemo imageUrl={data.imageUrl} sex={data.sex} />
                </div>
            </div>
            <div className="chips-row">
                {data.badges?.map((badge) => {
                    return (
                        <Chips
                            key={badge.label}
                            label={badge.label}
                            textColor={badge.textColor}
                            bgColor={badge.bgColor}
                        />
                    );
                })}
            </div>
            <Handle type="source" position={Position.Bottom} />
        </div>
    );
}

export function FamilyMemberNodeComp(props: NodeProps<FamilyMemberNode>) {
    return <FamilyMemberNodeUI {...props} />;
}
