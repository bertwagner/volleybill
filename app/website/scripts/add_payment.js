///
/// Variables
///

///
/// Methods
///

// Convert a date into a mm/dd/yyyy format
Date.prototype.toDateInputValue = (function () {
    var local = new Date(this);
    local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
    return local.toJSON().slice(0, 10);
});

function isNumeric(str) {
    if (typeof str != "string") return false 
    return !isNaN(str) && 
           !isNaN(parseFloat(str)) 
  }

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

// All page events
window.addEventListener('click', function (e) {

    if (e.target.id == "save") {
        // disable the save button
        e.target.disabled = true;
        //hide save button
        e.target.classList.add('hidden');
        //show spinner
        document.getElementById("loadingImage").classList.remove('hidden');

        // Get fields
        var paymentDate = document.querySelector("#PaymentDate").value;
        var payer = document.querySelector("#Payer").value;
        var payee = document.querySelector("#Payee").value;
        var amount = document.querySelector("#Amount").value;


        // Basic clientside validation
        if (payer == "" || payee == "" || amount == "") {
            alert('Payer, Payee, and Amount cannot be blank');
            e.target.disabled = false;
            e.target.classList.remove('hidden');
            document.getElementById("loadingImage").classList.add('hidden');
        }
        else if (!isNumeric(amount)) {
            alert('Amount must be numeric');
            e.target.disabled = false;
            e.target.classList.remove('hidden');
            document.getElementById("loadingImage").classList.add('hidden');
        }
        else if (getCookie('RefreshToken')=="") {
            alert('You must login first.');
            e.target.disabled = false;
            e.target.classList.remove('hidden');
            document.getElementById("loadingImage").classList.add('hidden');
        }
        else {
            // Reauth
            refreshToken = getCookie("RefreshToken");

            var authData = {
                "AuthParameters" : {
                    "REFRESH_TOKEN": refreshToken
                },
                "AuthFlow": "REFRESH_TOKEN_AUTH",
                "ClientId": "4r7kkii1u5ui5eij4pp9aj9knv"
            };

            var headers = new Headers();
            headers.append('X-Amz-Target','AWSCognitoIdentityProviderService.InitiateAuth');
            headers.append('Content-Type','application/x-amz-json-1.1');

            fetch('https://cognito-idp.us-east-1.amazonaws.com', {
                method: 'post',
                headers: headers,
                body: JSON.stringify(authData)
            })
            .then(function(response) {
                if (response.ok) {
                    return response.json();
                    }
            
                alert('Error while saving data.');
                return Promise.reject(response);

            })
            .then((data) => {
                //success.
                document.cookie = "AccessToken=" + data.AuthenticationResult.AccessToken + "; RefreshToken=" + data.AuthenticationResult.RefreshToken + "; path=/; SameSite=Strict";
            })
            .then(function() {
                var dataToSave = {
                    "League": 1,
                    "Season": 3,
                    "PaymentDate": paymentDate,
                    "Payer": payer,
                    "Payee": payee,
                    "Amount": amount
                };
                headers = new Headers();
                headers.append('Authorization','Bearer '+getCookie("AccessToken"));
                
                fetch('https://api.volleybill.com/insert-payment', {
                    method: 'post',
                    headers: headers,
                    body: JSON.stringify(dataToSave)
                })
                .then(function(response) {
                    if (response.ok) {
                        return response;
                        }
                
                    alert('Error while saving data.');
                    return Promise.reject(response);
    
                })
                .then((data) => {
                    //success. reset form
                    document.querySelector("#Payer").value='';
                    document.querySelector("#Payee").value='Force Sports';
                    document.querySelector("#Amount").value = '30';
                })
                .finally(function() {
                    e.target.disabled = false;
                    e.target.classList.remove('hidden');
                    document.getElementById("loadingImage").classList.add('hidden');
                });
            })
            
        }
    }

}, true);

///
/// Inits
///

// Set the default Payment Date
document.querySelector("#PaymentDate").value = new Date().toDateInputValue();

// Populate dropdowns 
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
    for (var i = 0; i < data.length; i++) {
        var player = data[i].Player;

        // Populate Payer and Payee
        var playerOption = document.createElement("option");
        playerOption.setAttribute("value", player);
        playerOption.innerHTML = player;
        
        playerOptionPayee = document.createElement("option");
        playerOptionPayee.setAttribute("value", player);
        playerOptionPayee.innerHTML = player;

        document.querySelector("#Payer").appendChild(playerOption);
        document.querySelector("#Payee").appendChild(playerOptionPayee);
    }


    document.getElementById("loadingImagePage").classList.add("hidden");
    document.getElementById("scoreForm").classList.remove("hidden");
})
