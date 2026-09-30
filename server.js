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

app.get("/product", async (req, res) => {
  const data = await fs.readFile(dbpath, "utf-8");

  const products = JSON.parse(data);

  // console.log(products);

  res.json(products);
});

app.listen(3000);
