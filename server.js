const express = require("express");
const fs = require("fs/promises");
const path = require("path");

const app = express();
const dbpath = path.join(__dirname, "db.json");

const cache = {};
const TTL = 60 * 1000;

app.get("/product", async (req, res) => {

    if (cache.products) {
        const age = Date.now() - cache.products.createdAt;
         if (age < TTL) {
            res.setHeader("X-Cache", "HIT");
            return res.json(cache.products.data);
        }

        delete cache.products;
    }

    const data = await fs.readFile(dbpath, "utf-8");
    const products = JSON.parse(data);
    cache.products = {
        data: products,
        createdAt: Date.now()
    };

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
        const age = Date.now() - cache[id].createdAt;

        if (age < TTL) {
            res.setHeader("X-Cache", "HIT");
            return res.json(cache[id].data);
        }
        delete cache[id];
    }

    const data = fs.readFileSync(dbpath, "utf-8");
    const products = JSON.parse(data);
    const product = products.find((p) => p.id === id);

    if (!product) {
        return res.status(404).json({
            message: "not found"
        });
    }



    cache[id] = {
        data: product,
        createdAt: Date.now()
    };

    res.setHeader("X-Cache", "MISS");
    res.json(product);
});

app.listen(3000);