///
/// Variables
///


///
/// Methods
///


///
/// Event Listeners
///

///
/// Inits
///

// Populate player stats
fetch('https://api.volleybill.com/get-payment-stats?league=1&season=3', {
    method: 'get',
})
.then(function(response) {
    if (response.ok) {
        return response.json();
        }

    alert('Error while retrieving data.');
    return Promise.reject(response);

})
.then((data) => {
    
    
    // Sort
    data.sort(function(a,b){
        if (a.PaymentDate < b.PaymentDate) {
            return 1;
        }
        if (a.PaymentDate > b.PaymentDate) {
            return -1;
        } 
        return 0;
    });

    

    table = document.getElementById("statsBody")
    for (var i = 0; i < data.length; i++) {
        var row = document.createElement("tr");

        var tdPlayer= document.createElement("td")
        tdPlayer.innerHTML= data[i]['Payer']
        row.appendChild(tdPlayer)

        var tdGamesWon= document.createElement("td")
        tdGamesWon.innerHTML= data[i]['Payee']
        tdGamesWon.classList.add("text-muted")
        row.appendChild(tdGamesWon)

        var tdGamesLost= document.createElement("td")
        tdGamesLost.innerHTML= data[i]['Amount']
        tdGamesLost.classList.add("text-muted")
        row.appendChild(tdGamesLost)

        var tdGamesWinPercentage= document.createElement("td")
        tdGamesWinPercentage.innerHTML= data[i]['PaymentDate']
        tdGamesWinPercentage.classList.add("text-muted")
        row.appendChild(tdGamesWinPercentage)

        table.appendChild(row);
    }
    document.getElementById("loadingImage").classList.add("hidden");
    document.getElementById("statsTable").classList.remove("hidden");
});
