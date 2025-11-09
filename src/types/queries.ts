import { Civilization } from "./civilization";

export class BuildQuery {
    civ?: Civilization;
    author?: string;
    orderBy?: string;
    overlay: boolean = false;
}
