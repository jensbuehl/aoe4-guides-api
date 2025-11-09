/**
 * Represents a complete build order formatted for overlay display.
 * 
 * Includes general build metadata, civilization info,
 * and the ordered list of build steps.

     */
export interface OverlayBuildOrder {
    /**
     * The display name or title of the build order.
     */
    name: string;

    /**
     * The name of the author who created the build order.
     */
    author?: string;

    /**
     * A brief description or overview of the build.
     */
    description: string;

    /**
     * The canonical source URL for this build.
     */
    source: string;

    /**
     * The civilization associated with this build order.
     */
    civilization: string;

    /**
     * Optional YouTube or media URL associated with the build.
     */
    video?: string;

    /**
     * The ranked ladder season when the build was created or relevant.
     */
    season?: string | null;

    /**
     * The map targeted or recommended for this build.
     */
    map?: string | null;

    /**
     * The general strategic focus or style of the build.
     */
    strategy?: string | null;

    /**
     * The ordered sequence of steps in this build.
     */
    build_order: OverlayBuildOrderStep[];
}

/**
 * Represents a single step in an overlay build order.
 * 
 * Each step corresponds to a point in time within the build,
 * containing resource allocations, population info, and notes.

     */
export interface OverlayBuildOrderStep {
    /**
     * The current age during this step (e.g., 1–4).
     */
    age: number;

    /**
     * The total population count at this step.
     */
    population_count: number;

    /**
     * Optional timestamp indicating when this step occurs (e.g., "05:30").
     */
    time?: string;

    /**
     * The total number of active villagers.
     */
    villager_count: number;

    /**
     * The distribution of villagers across resources.
     */
    resources: OverlayBuildOrderStepDetail;

    /**
     * Descriptive notes or actions taken at this step.
     */
    notes: string[];
}

export interface OverlayBuildOrderStep {
    age: number;
    population_count: number;
    time?: string;
    villager_count: number;
    resources: OverlayBuildOrderStepDetail;
    notes: string[];
}

/**
 * Represents the distribution of villagers or workers
 * across various resources at a given build step.

     */
export interface OverlayBuildOrderStepDetail {
    /**
     * Number of villagers assigned to food gathering.
     */
    food: number;

    /**
     * Number of villagers assigned to wood gathering.
     */
    wood: number;

    /**
     * Number of villagers assigned to gold gathering.
     */
    gold: number;

    /**
     * Number of villagers assigned to stone gathering.
     */
    stone: number;

    /**
     * Number of villagers acting as builders.
     */
    builder: number;
}

export type OverlayBuildOrderOrders = Array<OverlayBuildOrder>;