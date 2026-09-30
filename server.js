const express = require("express");
const fs = require("fs/promises");
const path = require("path");

const app = express();

const dbpath = path.join(__dirname, "db.json");

async function readFile() {
    try {
        const data = await fs.readFile(dbpath, "utf-8");

        console.log(data);
    } catch (error) {
        console.log("error", error);
    }
}
// readFile();


app.listen(3000);