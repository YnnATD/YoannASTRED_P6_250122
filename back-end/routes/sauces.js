// import des modules
const express = require('express')

const checkTokenMiddleware = require('../jsonwebtoken/check')
const multer = require('../middleware/multer-config')

const sauceCtrl = require('../controllers/sauce')


// recupération du routeur express
let router = express.Router()

//middleware pour logger dates de requete

router.use((req, res, next) => {
    const event = new Date()
    console.log('Sauce Time:',event.toString())
    next();
})

//     GET /api/sauces == recuperation de toute les sauces
router.get("/", sauceCtrl.getAllSauces);

//     GET /api/sauces/:id  == recuperation d'une sauce
router.get('/:id', sauceCtrl.getSauce);

//     POST /api/sauces  == creation d'une sauce
router.post("/", checkTokenMiddleware, multer, sauceCtrl.generateSauce);

//     PUT /api/sauces/:id  == modification d'une sauce
router.put("/:id",checkTokenMiddleware, multer, sauceCtrl.updateSauce)

//     DELETE /api/sauces/:id == supression d'une sauce
router.delete("/:id",checkTokenMiddleware, sauceCtrl.deleteSauce)

//     POST /api/sauces/:id/like == Like/dislike sauce
router.post("/:id/like",checkTokenMiddleware, sauceCtrl.rateSauce)

module.exports= router

//Sauce.sync()
//Sauce.sync({ alter: true })