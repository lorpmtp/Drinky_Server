module.exports = {

    checkEmail: function(myVar){

        var regEmail = new RegExp('^[0-9a-z._-]+@{1}[0-9a-z.-]{2,}[.]{1}[a-z]{2,5}$','i') 

        if(regEmail.test(myVar)) {
            return true 
        }
    },

    createDrinks: function(drinkByHour, duration){

        //duration set the first drink + 4min and the last one

        //return array

        // amélioration : le niveau de difficulté pourrai être un suivi de courbes avec des rushs

        function getRandomInt(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min 
        }

        var dateArray = []

        var amountOfDrinks = drinkByHour*duration 
        var durationInMinutes = duration*60 
        var averageMinutesBetweenDrinks = durationInMinutes/amountOfDrinks 

        var startGame = new Date.now()  
        var plusOrMinus = Math.random() < 0.5 ? -1 : 1 

        var ecartSuperieur = 50 
        var ecartInferieur = 5 

        var confortDebutSuperieur = 10
        var confortDebutInferieur = 5

        dateArray.push(new Date(startGame.add({
            minutes: getRandomInt(confortDebutInferieur,confortDebutSuperieur),
            seconds: getRandomInt(0,59)
        }))) //marge de confort de aléatoire de 3 à 5 minutes pour le premier verre

        for(i = 1;  i < amountOfDrinks;  i++) // pour chaque heure, on va distribuer équitablement le nombre de verre
        {
            
        dateArray.push(new Date(startGame.add({
            minutes: averageMinutesBetweenDrinks
        })))

        }

        for(i = 1; i < amountOfDrinks; i++) // pour chaque verre on aléatoirise l'écart entre 5 et 50 % de la valeur de l'écart moyen en minute
        {

            dateArray[i].add({
                minutes: plusOrMinus*getRandomInt(
                    Math.round(averageMinutesBetweenDrinks*(getRandomInt(ecartInferieur,25)/100)), 
                    Math.round(averageMinutesBetweenDrinks*(getRandomInt(25,ecartSuperieur)/100))
                    ),
                seconds: plusOrMinus*getRandomInt(0,59),
                milliseconds: plusOrMinus*getRandomInt(0,999)
            })
        }

        return dateArray

    },

    decayDrinks: function(drinksToDecay, receivedDecay) {

        //Décale les drinks et supprime les drinks qui sont passés

        var dateDecayArray = []

        for(i = 0; i < drinksToDecay.length;  i++) {

            var arrayToDate = new Date(drinksToDecay[i])

            dateDecayArray.push(arrayToDate)

            dateDecayArray[i].add({
                milliseconds: receivedDecay
            })

        }

        return dateDecayArray

    },

/*    addDecay: function(decay1, decay2) {

        //ajoute les deux decay et renvoi le string

        var decay1 = this.parseDecay(decay1)
        var decay2 = this.parseDecay(decay2)

        var resultDecayMinutes = decay1.Minutes + decay2.Minutes
        var resultDecaySeconds = decay1.Seconds + decay2.Seconds
        var resultDecayMilliseconds = decay1.Milliseconds + decay2.Milliseconds

        if(resultDecayMilliseconds > 999 || resultDecayMilliseconds < -999) {
            resultDecayMilliseconds = abs(decay1.Milliseconds + decay2.Milliseconds) - 1000
        }
        if(resultDecaySeconds > 59 || resultDecaySeconds < -59) {
            resultDecaySeconds = abs(decay1.Seconds + decay2.Seconds) - 60
        }
        if(resultDecayMinutes > 59 || resultDecayMinutes < -59) {
            return false
        }

        var totalDecay = resultDecayMinutes + ":" + resultDecaySeconds + ":" + resultDecayMilliseconds

        return totalDecay
    },*/

/*    parseDecay: function(decay) {

        //prend le string decay et retourne un object

        return Decay = {
            Minutes: parseInt(decay.split(":")[0]),
            Seconds: parseInt(decay.split(":")[1]),
            Milliseconds: parseInt(decay.split(":")[2])
        }

         
    },*/

    getLastTime: function (array) {

        var temp
        var tabToSort = array

        temp = tabToSort[0]

        for(var i = 1; i<=tabToSort.length; i++)
        {
            if(tabToSort[i] < temp)
            {
                
            }
        }

    },

    verifyPostVariables: function(array) {
    for(i = 0; i < array.length; i++) {
        if(array[i] === undefined) {
                res.status(300)
                res.json({
                    error: 'Invalid Request'
                })  
            }
        }
    }

} 