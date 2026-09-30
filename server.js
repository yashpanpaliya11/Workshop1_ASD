const express = require("express");
const fs = require("fs/promises");
const path = require("path");

const app = express();

const dbpath = path.join(__dirname, "db.json");

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
        setTimeout(resolve, 1500);});
        
        let products = await readFile();
        return products;
}


app.get("/product", async (req, res) => {
  const data = await fs.readFile(dbpath, "utf-8");

  const products = JSON.parse(data);

  // console.log(products);

  res.json(products);
});

app.get("/product/:id", (req, res) => {
    const data = fs.readFileSync("db.json", "utf-8");
    const products = JSON.parse(data);
    const id = parseInt(req.params.id);

    const product = products.find((p) => p.id === id);
    if (!product) {

        return res.status(404).json({
            message: "not found"

        });
    }

    res.json(product);
});

app.listen(3000);
