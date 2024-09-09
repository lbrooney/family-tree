import type { FamilyMemberNode } from "./FamilyComponents/types";
import { FamilyMember, FamilyMembers, FamilyRelations, RelationTypes } from "./tree/types";

/**
 * Creates a new array with only uniq values.
 *
 * @param array - The array from which to remove duplicates.
 * @returns A new array with unique values.
**/
export const uniq = <T>(array: T[]): T[] => Array.from(new Set(array))

type Comparator <T> = (a: T, b: T) => boolean
/**
 * Creates a new array with unique values based on a custom comparator function.
 * The comparator function is used to determine the uniqueness of elements.
 *
 * @param array - The array from which to remove duplicates.
 * @param comparator - A function that compares two elements for equality.
 * @returns array A new array with unique values based on the comparator.
**/
export const uniqWith = <T>(array: T[], comparator: Comparator<T>): T[] => array.reduce(
    (acc, curr) => {
        if (!acc.some(existingItem => comparator(existingItem, curr))) {
            acc.push(curr)
        }
        return acc
    },
    Array<T>(),
)

type UnaryFunction<T, R> = (arg: T) => R;
/**
 * Creates a new array with unique values based on the result of an iteratee function.
 * The iteratee function is used to extract a key or compute a value from each element to determine uniqueness.
 *
 * @param array - The array from which to remove duplicates.
 * @param iteratee - A function that extracts a key from each element to determine uniqueness.
 * 
 * @returns A new array with unique values based on the iteratee function.
 */
export const uniqBy = <T, R>(array: T[], iteratee: UnaryFunction<T, R>): T[] => {
    const seen = new Set<R>();
    return array.filter(item => {
        const key = iteratee(item);
        if (seen.has(key)) {
            return false;
        }
        seen.add(key);
        return true;
    });
}

export type RawFamilyMember = {
    id: string;
    data: {
        badges: {
            bgColor: string;
            label: string;
            textColor: string;
        }[];
        sex: "M" | "F";
        subtitles: string[];
        title: string;
        titleBgColor: string;
        titleTextColor: string;
        imageUrl?: string | null;
    };
};

export type RawFamilyRelation = {
    fromId: string;
    toId: string;
    relationType: RelationTypes;
    prettyType: string;
    isInnerFamily: boolean;
};

export function buildFamilyAndRelations(rawFamily: RawFamilyMember[], rawRelation: RawFamilyRelation[]) {
    const familyMembers: FamilyMembers = Object.fromEntries(
        rawFamily.map((rawMember) => {
            return [
                rawMember.id,
                {
                    id: rawMember.id,
                    data: {
                        badges: rawMember.data.badges,
                        sex: rawMember.data.sex,
                        imageUrl: rawMember.data.imageUrl,
                        subtitles: rawMember.data.subtitles,
                        title: rawMember.data.title,
                        titleBgColor: rawMember.data.titleBgColor,
                        titleTextColor: rawMember.data.titleTextColor
                    }
                }
            ] as [string, FamilyMember];
        })
    );

    const familyRelations: FamilyRelations = Object.fromEntries(
        rawRelation.map((rawMember) => {
            const id = `${rawMember.fromId}-${rawMember.toId}`;
            return [
                id,
                {
                    id,
                    to: rawMember.fromId,
                    from: rawMember.toId,
                    relationType: rawMember.relationType,
                    prettyType: rawMember.prettyType,
                    isInnerFamily: rawMember.isInnerFamily
                }
            ];
        })
    );

    return [familyMembers, familyRelations] as const;
}
export function nodeColorForMinimap(node: FamilyMemberNode) {
    return node.data.titleBgColor;
}
