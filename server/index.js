const express = require("express");
const Distance = require("./modul/desmodul");
const mongoose = require("./db/mongoose");
const distanceMatrix = require("../external/distanceMatrix");

const app = express();
app.use(express.json());

//api1
app.get("/hello", (req, res) => {
  res.status(200).send({});
})


//api2
app.get("/distance", (req, res) => {

  if (!req.query.source || !req.query.destination) {
    return res.send({
      error: "You must to provide a search and destination term"
    })
  }

  distanceMatrix(req.query.source, req.query.destination, (error, distance) => {
    if (error) {
      res.status(400).send({ error });
      return;
    }
    res.status(200).send({
      distance
    })

    const dis = new Distance({
      source: [req.query.source, req.query.destination],
      distance,
      hits: 1
    })

    dis.save().then(() => {
      console.log("add");
    }).catch((error) => {
      console.log(error);
    })
  })
})



//api3
app.get("//health", (req, res) => {


})



//api4
app.get("/popularsearch", (req, res) => {


})


//api5
app.post("/distance", (req, res) => {

  res.status(201).send(req.body);
})

app.get("*", (req, res) => {

  res.status(404).send("404 not found");

})


const port = process.env.PORT || 8080;

app.listen(port, () => {

  console.log("Listening on port :" + port);

});