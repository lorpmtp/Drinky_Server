console.log("Starting Drinky Server...");
const debut = new Date();

const http = require('https');
const express = require('express');
const app = express();

//var os = require('os')
const bodyParser = require('body-parser');
// to support JSON-encoded bodies
const passport = require('passport');

const config = require('./config.js');
const tools = require('./libs/tools.js');
const date = require('./libs/date.js');

app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,authorization');
    res.setHeader('Content-Type', 'application/json');
    next()
});

app.use(bodyParser.json());

app.use(passport.initialize());
app.use(passport.session());

app.set('superSecret', config.secret);

app.listen(8080);

let fin = new Date();

let ecart = new Date(fin - debut);
let executionTimeSeconds = ecart.getSeconds();
let executionTimeMilliseconds = ecart.getMilliseconds();

console.log('Started on ' + debut.toString("dd/MM/yyyy") + ' at ' + debut.toString("hh:mm:ss") + " in " +  + executionTimeSeconds + "." + executionTimeMilliseconds + " seconds" + "\n")
console.log('Waiting on 8080...');


//Idées pour la suite : Une version Inifite du jeu -> quand le tableau des verre est vide, on en rajoute
//                      Des difficultés differentes determinées par la des courbes de fonctions
//                      Un DeadTime (temps ou le mec a pas cliqué mais ou tout le monde oui) est à 10s ce qui
// permettra aux gens de voir une pub qui durera 10secondes
// Des message et des systemes de Votes :-) du genre : unTel été hors ligne ou n'a pas répondu, doit-il boire?


// COTE CLIENT //

// CreateGame //
// envoi le temps de jeu et le nombre de verre désiré

//Le temps envoyé par l'utilisateur lors d'un pushTime est en millisecond depuis 1/01/1970
//Le QR Code codera l'heure du téléphone en millisecondes aussi

//pense bete :
// pour l'authetification penser a proteger contre le flood d'inscription -> reverse proxy apache
// vérifier toutes les variables passées en post pour voir si elles sont définies sinon -> Invalid Request
// rajouter un support de langues
// rajouter le TLS
// créer un systeme de LOG en production
