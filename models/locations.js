let mongoose = require("mongoose");

//users schema
let locationsSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  locationImage: { 
    data: Buffer, 
    contentType: String,
    required: false,
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
    required: false,
  },
  likes: {
    type: Number,
    required: false,
  },
});

let locations = (module.exports = mongoose.model("locations", locationsSchema));
