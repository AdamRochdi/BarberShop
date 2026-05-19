import { MongoClient } from "mongodb";

const client = new MongoClient("mongodb://127.0.0.1:27017");

const DATA_URL =
    "https://raw.githubusercontent.com/AdamRochdi/BarberShop/main/data/products.json";

let db: any;
let productsCollection: any;

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