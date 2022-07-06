const request = require('request');


const distanceMatrix = (source, destination, callback) => {

    const url = "https://maps.googleapis.com/maps/api/distancematrix/json?destinations=" + source + "&origins=" + destination + "&units=metric&key=AIzaSyDED3_IOsZbSPKGYXZjhpzB4vuL0ElsF4k";

    request({ url, json: true }, (error, res) => {
        if (error) {
            callback('Unable to connect to location services!', undefined)
        } else if(res.body.status !== "OK" || res.body.rows[0].elements[0].status !== "OK") {
            callback("INVALID_REQUEST", undefined)
        }else{   
            callback(undefined, res.body.rows[0].elements[0].distance.text);
        }
    })
}

module.exports = distanceMatrix;