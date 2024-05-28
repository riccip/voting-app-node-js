const { Pool } = require('pg');
 
const pool = new Pool({
  connectionString: 'postgres://adminipc:xrcFXoyNSzYMxFu19eewvhwDZvPCfzr0@dpg-cparbtkf7o1s73alhec0-a.frankfurt-postgres.render.com/voting2024?ssl=true',
  max: 20,
  idleTimeoutMillis: 10000,
  connectionTimeoutMillis: 10000,
})
//const { Client } = require('pg');
//const client = new Client(
//    { 
//        connectionString: 'postgres://adminipc:xrcFXoyNSzYMxFu19eewvhwDZvPCfzr0@dpg-cparbtkf7o1s73alhec0-a.frankfurt-postgres.render.com/voting2024?ssl=true'
//    });
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
    getManager(req, res, 'M',false);
});

app.get("/reginetta", async (req, res) => {
    getManager(req, res, 'F',false);
});

app.post("/poll", async (req, res) => {
    postManager(req, res, 'M');
});

app.post("/reginetta", async (req, res) => {
    postManager(req, res, 'F');
});

app.get("/pollRisultato", async (req, res) => {
    getManager(req, res, 'M',true);
});

app.get("/reginettaRisultato", async (req, res) => {
    getManager(req, res, 'F',true);
});

app.listen(PORT, () => console.log("Server is running..."));

async function postManager(req, res, file){
    await pool.query(`INSERT into VOTI (id_studente, gender, orario) values (${req.body.id},'${req.body.gender}',${new Date().getTime()}) `); 
    console.log('Row Inserted'); 

    res.end();
}

async function getManager(req, res, genderFilter, percentuale){
 
    var queryRes;
    if (percentuale){
        queryRes = await pool.query(`SELECT s.nome, s.cognome, s.gender, s.classe, s.id_studente, Count(v.orario) as votes FROM STUDENTI as s LEFT OUTER JOIN voti as v on s.id_studente = v.id_studente where s.gender='${genderFilter}' group by s.nome, s.cognome, s.classe, s.gender, S.id_studente order by votes DESC`); 
    }else{
        queryRes = await pool.query(`SELECT s.nome, s.cognome, s.gender, s.classe, s.id_studente, Count(v.orario) as votes FROM STUDENTI as s LEFT OUTER JOIN voti as v on s.id_studente = v.id_studente where s.gender='${genderFilter}' group by s.nome, s.cognome, s.classe, s.gender, S.id_studente order by s.classe,s.nome`); 
    }
    console.log(queryRes.rows); 

    var queryRes2 = await pool.query(`SELECT Count(*) as totalVotes FROM voti as v WHERE gender='${genderFilter}'`); 

    let data = queryRes.rows;
    let totalVotes=queryRes2.rows[0].totalvotes;

    console.log(queryRes2.rows[0]); 

    data = data.map(obj => {
        if (percentuale){
            return {
                classe: obj.classe,
                gender: obj.gender,
                nome: obj.nome + " " + obj.cognome,
                label: obj.id_studente + " " + obj.nome + " " + obj.cognome,
                id: obj.id_studente,
                percentage: (((100 * obj.votes) / totalVotes) || 0).toFixed(0)
            }
        }else{
            return {
                classe: obj.classe,
                gender: obj.gender,
                nome: obj.nome + " " + obj.cognome,
                label: obj.id_studente + " " + obj.nome + " " + obj.cognome,
                id: obj.id_studente,
                percentage: obj.votes
            }
        }

    });

    res.json(data);
    
}