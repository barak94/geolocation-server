const express = require("express");

const app = express();


app.get("/hello", (req, res) => {
    res.status(200).send("hello");
})


const port = process.env.PORT || 8080;

app.listen(port, ()=>{

  console.log("Listening on port :" + port);

});