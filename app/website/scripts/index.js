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
fetch('https://api.volleybill.com/get-player-stats?league=1&season=3', {
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
    // Generate Games Win %
    for (var i = 0; i < data.length; i++) {
        data[i]['GameWinPercentage'] = (data[i].GamesWon)/(data[i].GamesWon + data[i].GamesLost);
    }

    // Sort
    data.sort(function(a,b) {
        return b.GamesWon - a.GamesWon;
    });

    table = document.getElementById("stats")
    for (var i = 0; i < data.length; i++) {
        var row = document.createElement("tr");

        var tdPlayer= document.createElement("td")
        tdPlayer.innerHTML= data[i]['Player']
        row.appendChild(tdPlayer)

        var tdGamesWon= document.createElement("td")
        tdGamesWon.innerHTML= data[i]['GamesWon']
        tdGamesWon.classList.add("text-muted")
        row.appendChild(tdGamesWon)

        var tdGamesLost= document.createElement("td")
        tdGamesLost.innerHTML= data[i]['GamesWon']
        tdGamesLost.classList.add("text-muted")
        row.appendChild(tdGamesLost)

        var tdGamesWinPercentage= document.createElement("td")
        tdGamesWinPercentage.innerHTML= data[i]['GamesWon']
        tdGamesWinPercentage.classList.add("text-muted")
        row.appendChild(tdGamesWinPercentage)

        table.appendChild(row);
    }
});
