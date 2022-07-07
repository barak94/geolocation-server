const express = require("express");
const Distance = require("./modul/desmodul");
const mongoose = require("mongoose");
const func = require("./function");
const distanceMatrix = require("../external/distanceMatrix");
require("./db/mongoose");


const app = express();
app.use(express.json());

//api1
app.get("/hello", (req, res) => {
  res.status(200).send({});
})


//api2
app.get("/distance", (req, res) => {

  if (!req.query.source || !req.query.destination) {
    return res.status(400).send({
      error: "You must to provide a search and destination term"
    })
  }

  let id = func.inputCheck(req.query.source, req.query.destination);

  Distance.findOne({ _id: id }, (error, result) => {

    if (error || !result) {

      distanceMatrix(req.query.source, req.query.destination, (error, distance) => {
        if (error) {
          res.status(400).send({ error });
          return;
        }

        res.status(200).send({
          distance
        })

        const dis = new Distance({
          _id: id,
          source1: req.query.source,
          source2: req.query.destination,
          distance,
          hits: 1
        })

        dis.save().then(() => {
          console.log("add");
        }).catch(() => {
          console.log("error")
        })
      })
    } else {

      res.status(200).send({
        distance: result.distance
      })

      Distance.updateOne(result, {
        $inc: {
          hits: 1
        }
      }).then((res) => {
        console.log("Update");
      }).catch((error) => {
        console.log(error, "filed");
      })
    }
  })
})


//api3
app.get("/health", (req, res) => {

  if (mongoose.connection.readyState){
    res.status(200).send({});
  } else {
    res.status(500).send({ error: "problem connecting to the database" });
  }
})


//api4
app.get("/popularsearch", (req, res) => {

  Distance.findOne().sort({ hits: -1 }).exec((err, doc) => {

    if (err) {
      res.status(500).send({})
    } else if (!doc) {
      res.status(404).send({ error: "404 not found" })
    } else {
      res.status(200).send({
        source: doc.source1,
        destination: doc.source2,
        hits: doc.hits
      })
    }
  });
})


//api5
app.post("/distance", (req, res) => {

  let id = func.inputCheck(req.body.source, req.body.destination);

  Distance.findOneAndUpdate({ _id: id }, { distance: req.body.distance }, (error, result) => {
    if (error) {
      res.status(500).send({ error: "500 Internal Server Error" })
    } else if (!result) {
      res.status(400).send({ error: "400 Bad Request" })
    } else {
      res.status(201).send({ source: req.body.source, destination: req.body.destination, hits: result.hits })
    }
  })
})


app.get("*", (req, res) => {
  res.status(404).send("404 not found");
})


const port = process.env.PORT || 8080;

app.listen(port, () => {

  console.log("Listening on port :" + port);

});