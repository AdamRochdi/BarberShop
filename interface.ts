export interface Guild {
    name: string;
    guildMaster: string;
    emblem: string;
    founded: number;
    motto: string;
}

export interface Character {
    id: string;
    name: string;
    description: string;
    age: number;
    active: boolean;
    birthdate: string;
    image: string;
    rarity: string;
    abilities: string[];
    element: string;
    guild: Guild;
}