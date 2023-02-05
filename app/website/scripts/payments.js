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
    document.querySelector("#AddPayment").classList.remove("hidden");
}

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
    



    table = document.getElementById("statsBody")
    computed_data = []

    for (var [key,item] of Object.entries(data['players'])) {
        row = {}
        row['Player'] = item['Player']
        row['AmountPaid'] = (item['AmountPaid'] == undefined ? 0 : item['AmountPaid'])
        row['DaysPlayed'] = item['PlayDates'].length
        row['Credit'] = ((item['AmountPaid'] == undefined ? 0 : item['AmountPaid']) - (data['avg_cost_per_game']*item['PlayDates'].length)).toFixed(2);
        computed_data.push(row);
    }

    // Sort
    computed_data.sort(function(a,b){
        if (a.Credit < b.Credit) {
            return -1;
        }
        if (a.Credit > b.Credit) {
            return 1;
        } 
        return 0;
    });

    computed_data.forEach(function (item, index) {
        var row = document.createElement("tr");

        var tdPlayer= document.createElement("td")
        tdPlayer.innerHTML= item['Player']
        row.appendChild(tdPlayer)

        var tdGamesWon= document.createElement("td")
        tdGamesWon.innerHTML= item['AmountPaid']
        tdGamesWon.classList.add("text-muted")
        row.appendChild(tdGamesWon)

        var tdDaysPlayed = document.createElement("td")
        tdDaysPlayed.innerHTML = item['DaysPlayed']
        row.appendChild(tdDaysPlayed)

        var tdBalance = document.createElement("td")
        tdBalance.innerHTML = item['Credit'];
        if (item['Credit'] >= 0) {
            tdBalance.style.color='green'
        }
        else {
            tdBalance.style.color='red'
        }
        row.appendChild(tdBalance)

        table.appendChild(row);
    });


    document.getElementById("costPerGame").innerHTML = "Current cost per game: $" + data['avg_cost_per_game'].toFixed(2)
    document.getElementById("loadingImage").classList.add("hidden");
    document.getElementById("statsTable").classList.remove("hidden");
});

