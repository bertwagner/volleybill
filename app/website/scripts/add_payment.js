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
        else {
            var dataToSave = {
                "League": 1,
                "Season": 3,
                "PaymentDate": paymentDate,
                "Payer": payer,
                "Payee": payee,
                "Amount": amount
            };
            
            fetch('https://api.volleybill.com/insert-payment', {
                method: 'post',
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
