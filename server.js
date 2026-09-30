const express = require("express");
const fs = require("fs/promises");
const path = require("path");

const app = express();

const dbpath = path.join(__dirname, "db.json");

const cache = {};

app.get("/product", async (req, res) => {

    if (cache.products) {
        res.setHeader("X-Cache", "HIT");
        return res.json(cache.products);
    }

    const data = await fs.readFile(dbpath, "utf-8");
    const products = JSON.parse(data);

    cache.products = products;

    res.setHeader("X-Cache", "MISS");
    res.json(products);
});


async function readFile() {
    try {
        const data = await fs.readFile(dbpath, "utf-8");

        return JSON.parse(data);

    } catch (error) {
        console.log("error", error);
    }
}


// readFile();


async function readFileWithDelay() {

    await new Promise((resolve, reject) => {
        setTimeout(resolve, 1500);
    });

    let products = await readFile();

    return products;
}


app.get("/product/:id", (req, res) => {

    const id = parseInt(req.params.id);

    if (cache[id]) {
        res.setHeader("X-Cache", "HIT");
        return res.json(cache[id]);
    }

    const data = fs.readFileSync(dbpath, "utf-8");

    const products = JSON.parse(data);

    const product = products.find((p) => p.id === id);

    if (!product) {
        return res.status(404).json({
            message: "not found"
        });
    }

    cache[id] = product;

    res.setHeader("X-Cache", "MISS");
    res.json(product);
});


app.listen(3000, () => {
    console.log("Server running on port 3000");
});
