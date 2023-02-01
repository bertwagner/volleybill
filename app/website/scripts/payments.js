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
    
    
    // Sort
    data.sort(function(a,b){
        if (a.AmountPaid < b.AmountPaid) {
            return 1;
        }
        if (a.AmountPaid > b.AmountPaid) {
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
        tdGamesWon.innerHTML= data[i]['AmountPaid']
        tdGamesWon.classList.add("text-muted")
        row.appendChild(tdGamesWon)

        table.appendChild(row);
    }
    document.getElementById("loadingImage").classList.add("hidden");
    document.getElementById("statsTable").classList.remove("hidden");
});


