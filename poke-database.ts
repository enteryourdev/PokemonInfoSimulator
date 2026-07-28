import express from "express";
import { fetchPokemon, Pokemon } from "./pokemon";

const app = express();
const PORT = 3000; //listen port

//ROUTE

app.listen(PORT, () => console.log(`listening on ${PORT}`)); // starts the server and runs the callback as soon as its up.
//when the server is ready run this!


//ROUTE Registration

app.get("/health", (req, res) => {
    res.json({ status: "ok"}); //once per request
    test();
});

function test() {
    console.log("WORKED");
}

export interface PokemonStruct {
  name: string;
  id: number;
}

app.get("/pokemon/:name", async (req, res) => {
    const name = req.params.name;

    try {
    //const response = await fetch(`https://pokeapi.invalid/`);
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);

    if (!response.ok){ // ok is status 200~299.
        return res.status(404).json({ error: "pokemon not found"});
    }

    const data = await response.json() as PokemonStruct;


    res.json({ name: data.name, id: data.id }); //once
    } catch (err) {
        console.error(err);
        return res.status(502).json({ error: "upstream service unavailable" }) // bad gateway
    }
})

app.get("/pokemon/:name", async (req, res) => {
    try {
        const response = await fetchPokemon(req.params.name);

        if (response === null){
            return res.status(404).json({ error: "Pokemon not found"});
        }
        res.json(response);
    }catch (err){
            console.error(err);
            return res.status(502).json({ error: "upstream service unavailable" })
    }

});