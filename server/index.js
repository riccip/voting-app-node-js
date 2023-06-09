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

app.get("/reginetta", async (req, res) => {
    getManager(req, res, reginettaFile,false);
});

app.post("/poll", async (req, res) => {
    postManager(req, res, dataFile);
});

app.post("/reginetta", async (req, res) => {
    postManager(req, res, reginettaFile);
});

app.get("/pollRisultato", async (req, res) => {
    getManager(req, res, dataFile,true);
});

app.get("/reginettaRisultato", async (req, res) => {
    getManager(req, res, reginettaFile,true);
});

app.listen(PORT, () => console.log("Server is running..."));





async function postManager(req, res, file){
    const data = JSON.parse(await fs.readFile(file, "utf-8"));

    data[req.body.add]++;

    await fs.writeFile(file, JSON.stringify(data));

    res.end();
}

async function getManager(req, res, file, percentuale){
    let data = JSON.parse(await fs.readFile(file, "utf-8"));
    const totalVotes = Object.values(data).reduce((total, n) => total += n, 0);

    data = Object.entries(data).map(([label, votes]) => {
        if (percentuale){
            return {
                label,
                percentage: (((100 * votes) / totalVotes) || 0).toFixed(0)
            }
        }else{
            return {
                label,
                percentage: totalVotes
            }
        }

    });

    res.json(data);
}