
import * as readline from "readline-sync";
fetch("/data/products.json")
import { Character } from "./interface";

let data: Character[] = [];
async function loadData() {
    const response = await fetch("http://localhost:3000/data/products.json");
    data = await response.json();
}
function showMenu() {
    console.log("\nWelcome to the JSON data viewer!\n");
    console.log("1. View all data");
    console.log("2. Filter by ID");
    console.log("3. Exit");

    return readline.question("Please enter your choice: ");
}

function handleMenu(choice: string) {
    switch (choice) {
        case "1":
            console.log("View all data");
            viewData();
            break;

        case "2":
            console.log("Filter by ID");
            filterById();
            break;

        case "3":
            console.log("Exit");
            return false;

        default:
            console.log("Invalid choice.");
    }

    return true;
}

function viewData() {
    data.forEach((character) => {
        console.log(`- ${character.name} (${character.id})`);
    });

    showMenu();
}

function filterById() {
    const id = readline.question("Please enter the ID you want to filter by: ");
    const product = data.find((p) => p.id === id);
    if (!product) {
        console.log("Character not found.");
        showMenu();
        return;
    }

    console.log(`\n- ${product.name} (${product.id})`);
    console.log(`  Description: ${product.description}`);
    console.log(`  Age: ${product.age}`);
    console.log(`  Active: ${product.isActive}`);
    console.log(`  Birthdate: ${product.birthDate}`);
    console.log(`  Category: ${product.category}`);
    console.log(`  Features: ${product.features.join(", ")}`);

    console.log(`  Brand: ${product.brand.name}`);
    console.log(`    - Founded: ${product.brand.foundedYear}`);
    console.log(`    - Premium: ${product.brand.isPremium}`);

    showMenu();
}


async function main() {
    await loadData();

    let running = true;

    while (running) {
        const choice = showMenu();
        running = handleMenu(choice);
    }
}

main();
