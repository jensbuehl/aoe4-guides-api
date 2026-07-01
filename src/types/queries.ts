import { Civilization } from "./civilization";

/**
 * Fields the build results can be sorted by (always descending).
 */
export type BuildOrderByField = "score" | "timeCreated" | "views" | "likes";

export class BuildQuery {
    /** Filter by civilization (3-letter code). */
    civ?: Civilization;
    /** Filter by author user id. */
    author?: string;
    /** Field to sort by, descending. Defaults to most recent. */
    orderBy?: BuildOrderByField;
    /** Return the compact overlay format used by build-order tools. */
    overlay: boolean = false;
}
