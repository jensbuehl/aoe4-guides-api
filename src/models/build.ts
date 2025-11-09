/**
 * Represents a complete build order.
 */
export interface BuildOrder {
    /**
     * The auto-generated ID of the build order.
     */
    id: string;

    /**
     * The title of the build order.
     */
    title: string;

    /**
     * A brief description of the build order.
     */
    description?: string;

    /**
     * The YouTube URL associated with this build order.
     */
    video?: string;

    /**
     * The display name of the author.
     */
    author?: string;

    /**
     * The unique identifier of the author.
     */
    authorUid: string;

    /**
     * The civilization this build order is designed for.
     */
    civ?: string;

    /**
     * The number of comments left by users.
     */
    comments?: number;

    /**
     * The number of likes this build order has received.
     */
    likes?: number;

    /**
     * The map targeted by this build order, if specified.
     */
    map?: string;

    /**
     * The ranked ladder season this build order was created for.
     */
    season?: string;

    /**
     * The current dynamic score assigned by the platform.
     */
    score: number;

    /**
     * The all-time cumulative score.
     */
    scoreAllTime: number;

    /**
     * A sortable title used for ranking or display order.
     */
    sortTitle: string;

    /**
     * The ordered sequence of build steps that compose this build.
     */
    steps: BuildOrderStep[];

    /**
     * The general strategic focus of the build order.
     */
    strategy?: string;

    /**
     * Timestamp when the build order was created (ISO string).
     */
    timeCreated: string;

    /**
     * Timestamp when the build order was last updated (ISO string).
     */
    timeUpdated: string;

    /**
     * The number of upvotes this build order has received.
     */
    upvotes?: number;

    /**
     * The total number of views for this build order.
     */
    views: number;

    /**
     * Whether the build order is a draft (unpublished).
     */
    isDraft?: boolean;
}

/**
 * Represents a major phase or stage of a build order.
 */
export interface BuildOrderStep {
    /**
     * A short description or label summarizing this step’s strategy.
     */
    gameplan?: string;

    /**
     * The age indicator (0 if unused, otherwise 1–4).
     */
    age?: number;

    /**
     * Age type: "in age" or "ageUp" when aging up.
     */
    type: string;

    /**
     * The list of detailed steps for this phase.
     */
    steps: DetailStep[];
}

export interface Timestamp {
    _seconds: number;
    _nanoseconds: number;
}

/**
 * Represents an individual detailed step within a build phase.
 */
export interface DetailStep {
    /**
     * The age indicator (0 if unused, otherwise 1–4).
     */
    age?: number;

    /**
     * Number of villagers.
     */
    villagers?: string;

    /**
     * Number of builders.
     */
    builders?: string;

    /**
     * Number of villagers assigned to food.
     */
    food?: string;

    /**
     * Number of villagers assigned to wood.
     */
    wood?: string;

    /**
     * Number of villagers assigned to stone.
     */
    stone?: string;

    /**
     * Number of villagers assigned to gold.
     */
    gold?: string;

    /**
     * The time marker for this step (textual timestamp).
     */
    time?: string;

    /**
     * A textual description of the build step, possibly including images.
     */
    description?: string;
}

/**
 * Represents a list of build orders.
 */
export type BuildOrders = BuildOrder[];