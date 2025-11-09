import { BuildOrder, BuildOrderStep, DetailStep } from "../models";
import { Civilization, CivilizationNames, OverlayBuild } from "../types";

const PATH_REGEX = /src\s*=\s*"([^"]+)"/i;
const DOMAIN_PREFIX_REGEX = /^https?:\/\/(localhost:\d+|aoe4guides\.com)/;
const ASSET_PATH_PREFIX_REGEX = /^\/?assets\/pictures\//;
const IMAGE_TAG_REGEX = /<img(.*?)>/gs;
const HTML_BREAK_REGEX = /<br\s*\/?>/gi;
const CARRIAGE_RETURN_REGEX = /\r\n?/g;

export function toOverlayBuild(build: BuildOrder): OverlayBuild {
    const steps = build.steps[0]?.type
        ? convertSectionsToSteps(build.steps)
        : build.steps;
    const civ = build.civ as Civilization | undefined;

    return {
        description: build.description ?? "",
        civilization: civ ? CivilizationNames[civ] : "",
        name: build.title,
        author: build.author,
        source: "https://aoe4guides.com/builds/" + build.id,
        build_order: steps.map(convertStepToOverlayFormat),
        video: build.video,
        season: build.season || null,
        map: build.map || null,
        strategy: build.strategy || null,
    };
}

/**
 * Flattens build sections into a single array of steps.
 * 
 * Each step inherits its parent section's age if defined.
 *
 * @param sections - The list of build sections containing steps.
 * @returns A flat array of build steps.
 */
function convertSectionsToSteps(
    sections: BuildOrderStep[]
) {
    const steps: Array<{ age?: number }> = [];

    for (const section of sections) {
        for (const step of section.steps) {
            const newStep = { ...step };

            if (section.age && Number(section.age) > 0) {
                newStep.age = section.age;
            }

            steps.push(newStep);
        }
    }

    return steps;
}

/**
 * Extracts and normalizes the `src` path from an <img> HTML string.
 *
 * Removes known domains and the `/assets/pictures/` prefix,
 * then wraps the remaining path between `@` symbols.
 *
 * @param imageElement - HTML string containing an <img> tag.
 * @returns Normalized image token (e.g. "@builds/eco.png@") or `undefined` if no `src` is found.
 */
function convertImagePathToText(imageElement: string): string | undefined {
    // Extract the value of src="..."
    const srcMatch = PATH_REGEX.exec(imageElement);

    if (!srcMatch) return undefined;

    console.log(imageElement);

    let src = srcMatch[1]
        .replace(DOMAIN_PREFIX_REGEX, "")
        .replace(ASSET_PATH_PREFIX_REGEX, "");

    console.log(src);

    return `@${src}@`;
}

/**
 * Calculates the total number of villagers assigned to all resources.
 * 
 * @param step - The resource counts for a specific build step.
 * @returns The total villagers, or -1 if all values are missing/invalid.
 */
function aggregateVillagers(step: DetailStep): number {
    const resources = ["builders", "food", "wood", "gold", "stone"] as const;

    const total = resources.reduce((sum, key) => {
        const value = Number.parseInt(step[key] ?? "0", 10);

        return sum + (Number.isNaN(value) ? 0 : value);
    }, 0);

    return total > 0 ? total : -1;
}

/**
 * Converts a detailed build step into the overlay display format.
 *
 * Normalizes text, aggregates resource counts, and extracts relevant fields.
 *
 * @param step - The build step to convert.
 * @returns The overlay-compatible step object.
 */
function convertStepToOverlayFormat(step: DetailStep) {
    const notes = convertDescription(step.description ?? "");
    const time = step.time?.replaceAll("<br>", "");

    return {
        age: Number(step.age) > 0 ? Number(step.age) : -1,
        population_count: -1, // not supported
        ...(time && { time }),
        villager_count: aggregateVillagers(step),
        resources: {
            food: Number.parseInt(step.food ?? "0", 10) || 0,
            wood: Number.parseInt(step.wood ?? "0", 10) || 0,
            gold: Number.parseInt(step.gold ?? "0", 10) || 0,
            stone: Number.parseInt(step.stone ?? "0", 10) || 0,
            builder: Number.parseInt(step.builders ?? "-1", 10) || -1,
        },
        notes,
    };
}


/**
 * Normalizes a rich-text description and returns it as an array of lines.
 * Converts <img> tags to tokens and fixes common HTML entities.
 */
function convertDescription(description: string): string[] {
    console.log("oui")
    let normalized = description
        .replace("&amp;", "&")
        .replace("&nbsp;", " ")
        .replace("&gt;", ">")
        .replace("</img>", "")
        .replace(".png", ".webp")
        .replaceAll(IMAGE_TAG_REGEX, (match) => convertImagePathToText(match) ?? "")
        .replaceAll(HTML_BREAK_REGEX, "\n")
        .replaceAll(CARRIAGE_RETURN_REGEX, "\n");

    return normalized
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);
}