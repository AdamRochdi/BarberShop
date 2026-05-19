export interface Brand {
    id: string;
    name: string;
    logoUrl: string;
    foundedYear: number;
    isPremium: boolean;

}

export interface Character {
    id: string;
    name: string;
    description: string;
    age: number;
    isActive: boolean;
    birthDate: string;
    imageUrl: string;
    category: string;
    features: string[];
    brand: Brand;
}