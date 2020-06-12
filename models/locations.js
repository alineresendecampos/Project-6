let mongoose = require("mongoose");

//users schema
let locationsSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  locationImage: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  isValidated: {
    type: Boolean,
    required: true,
  },
  comments: {
    type: String,
    required: true,
  },
  likes: {
    type: Number,
    required: true,
  },
});

let locations = (module.exports = mongoose.model("locations", locationsSchema));
