import express from "express";
import { fetchPokemon, Pokemon, getPokemon } from "./pokemon";
import { runBattle } from "./battle";

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

/*app.get("/pokemon/:name", async (req, res) => {
    const name = req.params.name;

    try {
    //const response = await fetch(`https://pokeapi.invalid/`);//
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
})*/

app.get("/pokemon/random{/:mode}", async (req, res) => {
    try{
        const mode = req.params.mode ?? "normal";

        const rdm: number[] = []
        for (let i = 0; i < 3; i++){
        rdm.push(Math.floor(Math.random() * 1025) + 1);
        }

        const team = await Promise.all(rdm.map(id => fetchPokemon(id)));

        if (team.some(x => x === null)){
            return res.status(404).json({ error: "One or more pokemon not found, this probably impossible to reach"});
        }
        return res.json(team); 
    }catch (err){
        console.error(err);
        return res.status(502).json({error: " unvailable service. "});
    }
    
} )



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

app.get("/team", async (req, res) => {
    try{
        const team = await Promise.all([
            fetchPokemon("pikachu"),
            fetchPokemon("charizard"),
            fetchPokemon("bulbasaur")
        ]);

        if ( team.some(x => x === null) ){
            return res.status(404).json({ error: "One or more pokemon not found"});
        }

        res.json(team);
    }catch (err) {
        console.error(err);
        return res.status(502).json({ error: " unavailable service. "})
    }
})

app.get("/battle/:a/vs/:b{/:mode}", async (req, res) => {
    const moode = req.params.mode ?? "normal";

    try{
        const [a, b] = await Promise.all([ // change back to fetchPokemon(req.params.a)
            getPokemon(req.params.a), 
            fetchPokemon(req.params.b)
        ])
        
        if (a === null || b === null){
            return res.status(404).json({ error: "One or more pokemon not found"});
        }
        const result = runBattle(a, b);
        res.json(result);
    }catch (err){
        console.error(err);
        return res.status(502).json({ error: " unavailable service "})
    }
});