const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    source: {
        type: Array,
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

module.exports = mongoose.model("Distance", schema);