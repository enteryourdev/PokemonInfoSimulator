import express from "express";

const app = express();
const PORT = 3000; //listen port

//ROUTE

app.listen(PORT, () => console.log(`listening on ${PORT}`)); // starts the server and runs the callback as soon as its up.
//when the server is ready run this!


//ROUTE Registration

app.get("/health", (req, res) => {
    res.json({ status: "ok"});
});

