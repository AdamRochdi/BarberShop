import { MongoClient, Collection } from "mongodb";
import { Character } from "./interface";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
dotenv.config();

const client = new MongoClient(process.env.MONGODB_URI as string);

const DATA_URL =
    "https://raw.githubusercontent.com/AdamRochdi/BarberShop/refs/heads/main/public/data/products.json";

let db: any;
let productsCollection: Collection<Character>;
let usersCollection: any;

export async function initDatabase() {
    await client.connect();

    db = client.db("barbershop");
    productsCollection = db.collection("products");
    usersCollection = db.collection("users");

    const count = await productsCollection.countDocuments();

    if (count === 0) {
        const res = await fetch(DATA_URL);
        const data = await res.json();

        await productsCollection.insertMany(data);

        console.log("Database seeded (products)");
    }

    const userCount = await usersCollection.countDocuments();

    if (userCount === 0) {
        const adminPassword = await bcrypt.hash("admin123", 10);
        const userPassword = await bcrypt.hash("user123", 10);

        await usersCollection.insertMany([
            {
                username: "admin",
                password: adminPassword,
                role: "ADMIN"
            },
            {
                username: "user",
                password: userPassword,
                role: "USER"
            }
        ]);

        console.log("Default users created");
    }

    return productsCollection;
}

export function getProductsCollection() {

    return productsCollection;
}

export function getUsersCollection() {
    return usersCollection;
}
