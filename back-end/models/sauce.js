/* Import des modules necessaires */
const mongoose = require("mongoose");

/* Schema Sauce */
const ModelSauce = mongoose.Schema({
  userId: { type: String, required: true },// ● userId : String — l'identifiant MongoDB unique de l'utilisateur qui a créé la sauce
  name: { type: String, required: true },// ● name : String — nom de la sauce
  manufacturer: { type: String, required: true },// ● manufacturer : String — fabricant de la sauce
  description: { type: String, required: true },// ● description : String — description de la sauce
  mainPepper: { type: String, required: true },// ● mainPepper : String — le principal ingrédient épicé de la sauce
  imageUrl: { type: String, required: true },// ● imageUrl : String — l'URL de l'image de la sauce téléchargée par l'utilisateur
  heat: { type: Number, required: true },// ● heat : Number — nombre entre 1 et 10 décrivant la sauce
  likes: { type: Number, required: true },// ● likes : Number — nombre d'utilisateurs qui aiment (= likent) la sauce
  dislikes: { type: Number, required: true },// ● dislikes : Number — nombre d'utilisateurs qui n'aiment pas (= dislike) la sauce
  usersLiked: { type: ["String <userId>"], required: true },// ● usersLiked : [ "String <userId>" ] — tableau des identifiants des utilisateurs qui ont aimé (= liked) la sauce
  usersDisliked: { type: ["String <userId>"], required: true },// ● usersDisliked : [ "String <userId>" ] — tableau des identifiants des utilisateurs qui n'ont pas aimé (= disliked) la sauce
});

module.exports = mongoose.model("Sauce", ModelSauce);

