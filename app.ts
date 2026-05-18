import * as fs from "fs";
import * as readline from "readline";
import { Character } from "./interface";

const data: Character[] = JSON.parse(
    fs.readFileSync("./data/characters.json", "utf-8")
);

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function showMenu() {
    console.log("\nWelcome to the JSON data viewer!\n");
    console.log("1. View all data");
    console.log("2. Filter by ID");
    console.log("3. Exit");

    rl.question("\nPlease enter your choice: ", handleMenu);
}

function handleMenu(choice: string) {
    switch (choice) {
        case "1":
            viewAll();
            break;

        case "2":
            filterById();
            break;

        case "3":
            rl.close();
            break;

        default:
            console.log("Invalid choice.");
            showMenu();
    }
}

function viewAll() {
    data.forEach((character) => {
        console.log(`- ${character.name} (${character.id})`);
    });

    showMenu();
}

function filterById() {
    rl.question("Please enter the ID you want to filter by: ", (id) => {
        const character = data.find((c) => c.id === id);

        if (!character) {
            console.log("Character not found.");
            showMenu();
            return;
        }

        console.log(`\n- ${character.name} (${character.id})`);
        console.log(`  - Description: ${character.description}`);
        console.log(`  - Age: ${character.age}`);
        console.log(`  - Active: ${character.active}`);
        console.log(`  - Birthdate: ${character.birthdate}`);
        console.log(`  - Image: ${character.image}`);
        console.log(`  - Rarity: ${character.rarity}`);
        console.log(`  - Abilities: ${character.abilities.join(", ")}`);
        console.log(`  - Element: ${character.element}`);

        console.log(`  - Guild: ${character.guild.name}`);
        console.log(`    - Name: ${character.guild.name}`);
        console.log(`    - Guild Master: ${character.guild.guildMaster}`);
        console.log(`    - Emblem: ${character.guild.emblem}`);
        console.log(`    - Founded: ${character.guild.founded}`);
        console.log(`    - Motto: ${character.guild.motto}`);

        showMenu();
    });
}

showMenu();