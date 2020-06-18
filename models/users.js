let mongoose = require("mongoose");

//users schema
let usersSchema = mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  isAdmin: {
    type:Boolean,
    required:false,
  }
});

let users = (module.exports = mongoose.model("users", usersSchema));
