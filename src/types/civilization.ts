/**
 * Represents all supported civilizations in the game.
 * 
 * Each key corresponds to a civilization code used internally,
 * while the value is its string identifier. Use the companion
 * {@link CivilizationNames} map to display human-readable labels.
 */
export enum Civilization {
    ANY = "ANY",
    ENG = "ENG",
    FRE = "FRE",
    RUS = "RUS",
    MAL = "MAL",
    DEL = "DEL",
    HRE = "HRE",
    ABB = "ABB",
    OTT = "OTT",
    CHI = "CHI",
    MON = "MON",
    BYZ = "BYZ",
    JAP = "JAP",
    AYY = "AYY",
    JDA = "JDA",
    ZXL = "ZXL",
    DRA = "DRA",
    HOL = "HOL",
    KTE = "KTE",
    GOH = "GOH",
    SEN = "SEN",
    MAC = "MAC",
    TUG = "TUG",
}

/**
 * A mapping of {@link Civilization} enum values to their
 * human-readable names for UI display and documentation.
 */
export const CivilizationNames: Record<Civilization, string> = {
    [Civilization.ANY]: "Any Civilization",
    [Civilization.ENG]: "English",
    [Civilization.FRE]: "French",
    [Civilization.RUS]: "Rus",
    [Civilization.MAL]: "Malians",
    [Civilization.DEL]: "Delhi Sultanate",
    [Civilization.HRE]: "Holy Roman Empire",
    [Civilization.ABB]: "Abbasid Dynasty",
    [Civilization.OTT]: "Ottomans",
    [Civilization.CHI]: "Chinese",
    [Civilization.MON]: "Mongols",
    [Civilization.BYZ]: "Byzantines",
    [Civilization.JAP]: "Japanese",
    [Civilization.AYY]: "Ayyubids",
    [Civilization.JDA]: "Jeanne d'Arc",
    [Civilization.ZXL]: "Zhu Xi's Legacy",
    [Civilization.DRA]: "Order of the Dragon",
    [Civilization.HOL]: "House of Lancaster",
    [Civilization.KTE]: "Knights Templar",
    [Civilization.GOH]: "Golden Horde",
    [Civilization.SEN]: "Sengoku Daimyo",
    [Civilization.MAC]: "Macedonian Dynasty",
    [Civilization.TUG]: "Tughlaq Dynasty",
};