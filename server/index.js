const express = require("express");
const fs = require("fs").promises;
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3030;

const dataFile = path.join(__dirname, "data.json");
const reginettaFile = path.join(__dirname, "reginetta.json");

// Support POSTing form data with URL encoded
app.use(express.urlencoded({ extended: true }));

// Enable CORS
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");

    next();
});

app.get("/poll", async (req, res) => {
    getManager(req, res, dataFile,false);
});

app.listen(PORT, () => console.log("Server is running..."));


async function getManager(req, res, file, percentuale){
    let data = JSON.parse(await fs.readFile(file, "utf-8"));
    
    res.json(data);
}