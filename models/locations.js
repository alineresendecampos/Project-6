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
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  comments: [{
    text: String,
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
  }],
  likes: {
    type: Number,
    required: false,
  },
});

let locations = (module.exports = mongoose.model("locations", locationsSchema));
