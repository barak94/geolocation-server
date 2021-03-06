const mongoose = require("mongoose");

const schema = new mongoose.Schema({

    _id: {
        type: String,
        required: true
    },
    source1: {
        type: String,
        required: true
    },
    source2: {
        type: String,
        required: true
    },
    distance: {
        type: String,
        required: true
    },
    hits: {
        type: Number,
        required: true
    }
})

module.exports = mongoose.model("Distance2", schema);