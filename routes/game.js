const express = require('express');
const router = express.Router();
const passports = require('passport');

const AuthRoutes = require('./../middlewares/AuthRoute');

const User = require('./../models/User.js');
const Game = require('./../models/Game.js');
const Score = require('./../models/Score.js');


// QU'on soit dans CreateGame ou dans JoinGame, on rajoute finalement l'id de la partie dans la BDD de chaque joueurs
// le statut original est : 'waiting'

// startGame passe le statut en 'started'

app.post('/createGame', AuthRoutes, function(req, res) {

    //crée une partie dans la BDD
    //Ajoute l'ID de la partie chez le créateur
    //Le QR Code devra contenir le gameID

    var hours = req.body.hours
    var drinks = req.body.drinks
    var mobileTime = req.body.mobileTime

    var id = req.decoded.id

    User.findOne({
      where: {
        id: id
      }
    }).then(
      function(user){
        if(user.gameId === null){
          Game.create({
              drinks: tools.createDrinks(drinks, hours)
          }).then(function(game) {

              User.update({
                  gameId: game.get('id'),
                  timeDecay: new Date().getTime() - mobileTime
              }, {
                  where: {
                      id: id
                  }
              })

              res.status(200)
              res.json({
                  gameId: game.get('id'),
                  drinks: game.get('drinks'),
                  message: 'Waiting for players'
              })

          }).catch(function(error) {
              res.status(500)
              res.json({
                  error: error
              })
          })
        } else {
          res.status(418)
          res.json({
            message: 'Vous êtes déja dans une partie'
          })
        }
    })


})

app.post('/joinGame', AuthRoutes, function(req, res) {

    //Je m'inscrit a la partie grace à l'ID que j'ai scanné sur le QR code du créateur
    //Je télécharge les drinks
    //J'envoi mon décalage de temps avec le téléphone du master

    //il faut revoyer l'ID du mec qui m'a intégré car peux être c'est pas le master
    //Dans ce cas la je renvoi un time decay en fonction du time decay déja subi par le mec qui me rajoute
    //Je dois rajouter le time decay du mec qui me rajoute, si c'est le master, c'est déja 0 en millisecondes

    // le téléphone va renvoyer l'écart entre l'arrivant et le joueur et déterminé si l'écart est positif ou négatif

    var id = req.decoded.id

    var idAdder = req.body.idAdder
    var gameId = req.body.gameId
    var mobileTime = req.body.timeDecay //ms + ou -

    User.findOne({
        where: {
            id: idAdder
        }
    }).then(function(user) {

        var totalDecay = user.get('timeDecay') - mobileTime

        if(totalDecay) {

        return Promise.all([User.update({
            gameId: gameId,
            timeDecay: totalDecay
        }, {
            where: {
                id: id
            }
        }), Game.findOne({
            where: {
                id: gameId
            }
        })])

        } else {

        res.status(300)
        res.json({
            error: 'Le décalage est trop grand, réglez votre heure...'
        })

        }



    }).then(function(game){

        var drinks = tools.decayDrinks(game[1].get('drinks'), timeDecay)

        res.status(200)
        res.json({
            message: 'Welcome to DRINKY',
            drinks: drinks
        })

    })/*.catch(function(error) {
        res.status(500)
        res.json({
            error: error
        })
    })*/
})

/*app.get('/startGame', AuthRoutes, function(req, res) {

    //Change le statut du jeu en started

    var id = req.decoded.id

    User.findOne({
        where: {
            id: id
        }
    }).then(function(user) {
        Game.update(
        {
            status: 'started'
        },
        {
            where: {
                id: user.get('gameId')
            }
        })

    }).then(function() {

        res.status(200)
        res.json({
            status: 'started',
            message: 'Jouons !'
        })

    }).catch(function(error) {
        res.status(500)
        res.json({
            error: error,
            stackError: error.stack
        })
    })
})*/

app.get('/leaveGame', AuthRoutes, function(req, res) {

    //Lorsqu'un joueur se déconnecte de la partie
    //Une partie n'est pas stoppable, pour arreter il faut abandonner
    //suppression du gameId de la bdd joueur

    var id = req.decoded.id

    User.update({
        gameId: null,
        timeDecay: 0
    }, {
        where: {
            id: id
        }
    }).then(function() {

        res.status(200)
        res.json({
            message: 'Au revoir !'
        })


    }).catch(function(error) {
        res.status(500)
        res.json({
            error: error,
            stackError: error.stack
        })
    })
})

app.get('/gameStatus', AuthRoutes, function(req, res) {

    //Tous les joueurs vont boucler sur cette page lister les joueurs qui se connectent

    var id = req.decoded.id

    User.findOne({
        where: {
            id: id
        }
    }).then(function(user){

        var timeDecay = user.get('timeDecay');
        var gameId = user.get('gameId');

        if(user.get('gameId') != null) {

        return Promise.all([User.findAll({ where: { gameId: user.get('gameId')}, attributes: ['id', 'username']}),
                            Game.findOne({ where: { id:     user.get('gameId')}})
            ])

        .then(function(data) {

        res.status(200)
        res.json({
            message: 'Voici tous les joueurs de la partie',
            gameId: gameId,
            players: data[0],
            drinks: tools.decayDrinks(data[1].get('drinks'), timeDecay)
        })

        })


    } else {

        res.status(300)
        res.json({
            message: 'Vous n\'appartenez à aucun jeu',
        })

    }
    }).catch(function(error) {
        res.status(500)
        res.json({
            error: error
        })
    })
})







app.post('/pushButton', AuthRoutes, function(req, res) {

    //Lorsqu'un joueur appui sur le bouton de jeu

    var id = req.decoded.id
    var pushtime = req.body.pushtime //heure du téléphone au moment du Push
    var drinkId = req.body.drinkid

     User.findOne({
        where: {
            id: id
        }
    }).then(function(user) {

        return Score.create({
            pushTime: pushtime + user.get('timeDecay'),
            drinkId: drinkId,
            fk_userId: id,
            fk_gameId: user.get('gameId')
        })

    }).then(function() {

        res.status(200)
        res.json({
            message: 'Score ajouté',
        })

    })

})

app.post('/whoDrink', function(req, res) {

    //Apres 10 secondes de Pub vidéo, on check qui va boire
    //Dans les scores, on récupere les drinks du jeu auquel joue l'Id

    var id = req.decoded.id
    var drinkId = req.body.drinkid

    User.findOne({
        where: {
            id: id
        }
    }).then(function(user){

       return Score.findAll({

            where: {

            fk_gameId: user.get('gameId'),
            drinkId: drinkId

            },
            raw: true
            ,
            order: [

                ['pushTime', 'ASC']

            ],
            attributes: [

                'fk_userId'

            ]
        }
    )

    }).then(function(score){

        console.log(score)

        return User.findOne({
            where: {
                id: score[0].fk_userId
            }
        })

    }).then(function(user) {

        res.status(200)
        res.json({
            message: 'Who Drink ??!!!',
            drinky: user.get('username')
        })

    })

})