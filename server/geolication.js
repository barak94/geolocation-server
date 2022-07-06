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

  Distance.findOne({
    $or: [{ source1: req.query.source, source2: req.query.destination }, { source1: req.query.destination, source2: req.query.source }]
  },
    (error, result) => {

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
            source1: req.query.source,
            source2: req.query.destination,
            distance,
            hits: 1
          })

          dis.save().then(() => {
            console.log("add");
          }).catch((error) => {
            console.log("error");
          })
        })
      } else {

        Distance.updateOne(result, {
          $inc: {
            hits: 1
          }
        }).then((res) => {
          console.log("Update");
        }).catch((error) => {
          console.log(error, "filed");
        })

        res.status(200).send({
          distance: result.distance
        })

      }
    })
})


//api3
app.get("/health", (req, res) => {

  if (mongoose.getConnected()) {
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
      res.status(400).send({ error: "400 Bad Request" })
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

  Distance.findOne({
    $or: [{ source1: req.body.source, source2: req.body.destination }, { source1: req.body.destination, source2: req.body.source }]
  }, (error, result) => {

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

  mongoose.connect();
  console.log("Listening on port :" + port);

});
