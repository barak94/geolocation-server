const mongoose = require("mongoose");

let connected = false;

module.exports = {
    connect: () => {
        mongoose.connect("mongodb://127.0.0.1:27017/geolocation-db", {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }, (error) => {
            if(error){
                connected = false;
            }else{
                connected = true;
            }
        });
    },
    getConnected: () => {
        return connected;
    }
};

