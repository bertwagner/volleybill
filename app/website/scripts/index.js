///
/// Variables
///


///
/// Methods
///

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }


///
/// Event Listeners
///

///
/// Inits
///

// unhide add payment button if login cookie found
if (getCookie("AccessToken") != "") {
    document.querySelector("#AddGame").classList.remove("hidden");
}

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
        data[i]['GameWinPercentage'] = (data[i].GamesWon)/(data[i].TotalGamesPlayed);
    }


    // Custom sort - if more than 10 games played, sort on percentage, otherwise sort on game wins
    sort1=[]
    sort2=[]

    for (var i=0; i< data.length; i++){
        if (parseInt(data[i]['GamesWon'])+parseInt(data[i]['GamesLost']) > 10) {
            sort1.push(data[i])
        } else {
            sort2.push(data[i])
        }
    }

    // Sort
    sort1.sort(function(a,b){
        if (a.GameWinPercentage < b.GameWinPercentage) {
            return 1;
        }
        if (a.GameWinPercentage > b.GameWinPercentage) {
            return -1;
        } 
        return 0;
    });
    sort2.sort(function(a,b){
        if (parseInt(a.GamesWon) < parseInt(b.GamesWon)) {
            return 1;
        }
        if (parseInt(a.GamesWon) > parseInt(b.GamesWon)) {
            return -1;
        } 
        return 0;
    });

    // Combine
    data = sort1.concat(sort2)

    table = document.getElementById("statsBody")
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
        tdGamesLost.innerHTML= data[i]['GamesLost']
        tdGamesLost.classList.add("text-muted")
        row.appendChild(tdGamesLost)

        var tdGamesWinPercentage= document.createElement("td")
        tdGamesWinPercentage.innerHTML= (data[i]['GameWinPercentage']*100).toFixed(2) + '%'
        tdGamesWinPercentage.classList.add("text-muted")
        row.appendChild(tdGamesWinPercentage)

        var tdTotPointDiff= document.createElement("td")
        tdTotPointDiff.innerHTML= data[i]['TotalPointDifferential']
        tdTotPointDiff.classList.add("text-muted")
        row.appendChild(tdTotPointDiff)

        var tdAvgPointDiff= document.createElement("td")
        tdAvgPointDiff.innerHTML= ((data[i]['TotalPointDifferential']/data[i]['TotalGamesPlayed'])).toFixed(2)
        tdAvgPointDiff.classList.add("text-muted")
        row.appendChild(tdAvgPointDiff)

        table.appendChild(row);
    }
    document.getElementById("loadingImage").classList.add("hidden");
    document.getElementById("statsTable").classList.remove("hidden");
});
