const express = require("express");

const app = express();


app.get("/hello", (req, res) => {
  res.status(200).send("hello");
})


app.get("/distance", (req, res) => {

  if (!req.query.source || !req.query.destination) {
    return res.send({
      error: "You must to provide a source and destination"
    })
  }


  res.send({
    source: req.query.source,
    destination: req.query.destination
  })

})

app.post("/distance", (req, res) => {

})


const port = process.env.PORT || 8080;

app.listen(port, () => {

  console.log("Listening on port :" + port);

});
