import { MongoClient, Collection } from "mongodb";
import { Character } from "./interface";
import dotenv from "dotenv";
dotenv.config();

const client = new MongoClient(process.env.MONGODB_URI as string);

const DATA_URL =
    "https://raw.githubusercontent.com/AdamRochdi/BarberShop/refs/heads/main/public/data/products.json";

let db: any;
let productsCollection: Collection<Character>;

export async function initDatabase() {
    await client.connect();

    db = client.db("barbershop");
    productsCollection = db.collection("products");

    const count = await productsCollection.countDocuments();

    if (count === 0) {
        const res = await fetch(DATA_URL);
        const data = await res.json();

        await productsCollection.insertMany(data);

        console.log("Database seeded");
    }

    return productsCollection;
}

export function getProductsCollection() {
    return productsCollection;
}
