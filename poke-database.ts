import express from "express";

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

interface PokemonResponse {
  name: string;
  id: number;
}

app.get("/pokemon/:name", async (req, res) => {
    const name = req.params.name;

/*    if (!/^[a-z-]+$/i.test(name)) {
        return res.status(400).json({ error: "name required"});
    }*/

    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);

    if (!response.ok){ // ok is status 200~299.
        return res.status(404).json({ error: "pokemon not found"});
    }

    const data = await response.json() as PokemonResponse;


    res.json({ name: data.name, id: data.id }); //once
})