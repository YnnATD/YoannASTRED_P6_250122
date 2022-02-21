// import des modules
const Sauce = require('../models/sauce')
const fs = require('fs');

/**********************************/
// routage de la ressource Sauce //

// GET /api/sauces == Renvoie un tableau de toutes les sauces de la base de données
exports.getAllSauces = (req, res) => {
    Sauce.find()
        .then(sauces => res.json(sauces))
        .catch(err => res.status(500).json({ message: 'Database error', error: err }))
}

// GET /api/sauces/:id == Renvoie la sauce avec l’_id fourni.
exports.getSauce = (req, res) => {
    // recupération d'une sauce avec le paramétre id
    Sauce.findOne({ _id: req.params.id })
        .then(sauces => res.json(sauces))
        .catch(err => res.status(500).json({ message: 'Database error', error: err }))
}

// POST /api/sauces == creation d'une sauce
exports.generateSauce = (req, res) => {
    // recuperation des paramètres de la sauce
    const sauceObject = JSON.parse(req.body.sauce)
    // Initialise les likes et dislikes de la sauce à 0 et les usersLiked et usersDisliked avec des tableaux vides.
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
        usersLiked: [' '],
        usersdisLiked: [' '],
    });
    //sauvegarde de la sauce
    sauce.save()
        .then(() => res.status(201).json({ message: "Sauce enregistrée" }))
        .catch((error) => res.status(400).json({ error }));
};

// PUT /api/sauces/:id == Met à jour la sauce avec l'_id fourni.
exports.updateSauce = (req, res) => {
    // téléchargement du fichier image
    const sauceObject = req.file ?
        {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : { ...req.body }
    // modification d'une sauce avec le paramétre id
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
        .then(res.status(200).json({ message: "Sauce modifiée" }))
        .catch(error => res.status(400).json({ error }))
}

//DELETE /api/sauces/:id == Supprime la sauce avec l'_id fourni.
exports.deleteSauce = (req, res) => {
    // recupération de la sauce avec le paramétre id
    Sauce.findOne({ _id: req.params.id })
        .then(Sauce => {
            // récupération du nom du fichier
            const filename = Sauce.imageUrl.split('/images/')[1];
            //  supprimer le fichier
            fs.unlink(`images/${filename}`, () => {
                // supprimer la sauce avec le paramétre id dabs la DB
                Sauce.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Sauce supprimée' }))
                    .catch(error => res.status(400).json({ error }));
            })
        })
}

// POST /api/sauces/:id/like == Like/dislike sauce
exports.rateSauce = (req, res, next) => {
    //(userId, like(1|0|-1))
    let like = req.body.like
    let userId = req.body.userId
    let sauceId = req.params.id

    // Like
    if (like == 1) {
        Sauce.findOne({ _id: sauceId }) // On retrouve la sauce
            .then((sauce) => {
                if (!sauce.usersLiked.includes(userId)) {
                    Sauce.updateOne(
                        { _id: sauceId }, //On récupère la sauce
                        {
                            $inc: { likes: 1 }, // on incrémente les likes de 1
                            $push: { usersLiked: userId } // On met le user dans le tableau des users ayant liké
                        }
                    )
                        .then(() => res.status(201).json({ message: 'Vous avez like cette sauce!' }))
                        .catch((error) => res.status(400).json({ error }));
                }
            })
            .catch((error) => res.status(400).json({ error }));
    }

    // Dislike
    if (like === -1) {
        Sauce.findOne({ _id: sauceId }) // On retrouve la sauce
            .then((sauce) => {
                if (!sauce.usersDisliked.includes(userId)) {
                    Sauce.updateOne(
                        { _id: sauceId }, //On récupère la sauce
                        {
                            $inc: { dislikes: 1 }, // on incrémente les dislikes de 1
                            $push: { usersDisliked: userId } // On met le user dans le tableau des users ayant disliké     
                        }
                    )
                        .then(() => res.status(201).json({ message: 'Vous avez dislike cette sauce!' }))
                        .catch((error) => res.status(400).json({ error }));
                }
            })
            .catch((error) => res.status(400).json({ error }));
    }

    // Annulation Like ou Dislike
    if (like === 0) {
        // On retrouve la sauce
        Sauce.findOne({ _id: sauceId })
            .then((sauce) => {
                // Si le user a déjà liké la sauce
                if (sauce.usersLiked.includes(userId)) {
                    Sauce.updateOne(
                        { _id: sauceId }, //On récupère la sauce
                        {
                            $inc: { likes: -1 }, //On incrémente les likes de -1 
                            $pull: { usersLiked: userId } // On retire le user du tableau des users ayant liké
                        }
                    )
                        .then(() => res.status(201).json({ message: 'Votre avez retiré votre Like' }))
                        .catch((error) => res.status(400).json({ error }));
                }

                // Si le user a déjà disliké la sauce
                if (sauce.usersDisliked.includes(userId)) {
                    Sauce.updateOne(
                        { _id: sauceId },
                        {
                            $inc: { dislikes: -1 },
                            $pull: { usersDisliked: userId }
                        }
                    )
                        .then(() => res.status(201).json({ message: 'Votre avez retiré votre Dislike' }))
                        .catch((error) => res.status(400).json({ error }));
                }
            })
            .catch((error) => res.status(400).json({ error }));
    }
};