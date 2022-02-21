/* Import des modules necessaires */

const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

/* Schema User */
const ModelUser = mongoose.Schema({
  email: { type: String, required: true, unique: true },// ● email : String — adresse e-mail de l'utilisateur [unique]
  password: { type: String, required: true },// ● password : String — mot de passe de l'utilisateur haché
});

/* Verification email unique */
ModelUser.plugin(uniqueValidator);

module.exports = mongoose.model("User", ModelUser);