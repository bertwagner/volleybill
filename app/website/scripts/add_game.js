///
/// Variables
///
var gameId;

///
/// Methods
///

// Convert a date into a mm/dd/yyyy format
Date.prototype.toDateInputValue = (function () {
    var local = new Date(this);
    local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
    return local.toJSON().slice(0, 10);
});

var serializeTeams = function () {
    var team1 = document.getElementById("team-grouping-1").getElementsByClassName("player-name");
    var team2 = document.getElementById("team-grouping-2").getElementsByClassName("player-name");
    var teams = { "Team1Players": Array.from(team1).map(x => x.id), "Team2Players": Array.from(team2).map(x => x.id) };
    document.querySelector("#SerializedTeams").value = JSON.stringify(teams);
}

var generateUUID = function() {
    return self.crypto.randomUUID();
}

function isNumeric(str) {
    if (typeof str != "string") return false 
    return !isNaN(str) && 
           !isNaN(parseFloat(str)) 
  }

// Define drag and drop actions
var handleDragStart = function (e) {
    e.dataTransfer.setData("text", e.target.id);

}
var handleDragOver = function (e) {
    e.preventDefault();
}
var handleDrop = function (e) {
    e.preventDefault();
    var data = e.dataTransfer.getData("text");
    var closestTeamGrouping = e.target.closest(".team-grouping");
    closestTeamGrouping.appendChild(document.getElementById(data));

    // Serialize the teams - make this better
    serializeTeams();
}




///
/// Event Listeners
///

// All page events
// window.addEventListener('change', function(e) {
//     // Sync Team1/2 Wins/Losses
//     if (e.target.classList.contains('score-selector')) {
//         document.querySelector("#Team2Wins").value = document.querySelector("#Team1Losses").value;
//         document.querySelector("#Team2Losses").value = document.querySelector("#Team1Wins").value;
//     }
// }, true);

window.addEventListener('click', function (e) {

    // Return player to pool on click 
    if (e.target.classList.contains('delete-player')) {
        var playerButton = e.target.closest("button");
        document.querySelector("#PlayerPool").append(playerButton);
    }

    // Show Add Player form
    if (e.target.id == "AddPlayer") {
        document.querySelector("#AddPlayerForm").classList.remove("d-none");
    }

    // Add a new player via form
    if (e.target.id == "AddPlayerToPool") {
        // Should add validation here to make sure player doesn't already exist

        var name = document.querySelector("#AddPlayerName");
        if (name != "") {
            // Create the new player button
            var newPlayer = document.createElement("button");
            newPlayer.setAttribute("class", "player-name btn btn-sm btn-primary m-1");
            newPlayer.setAttribute("draggable", "true");
            newPlayer.setAttribute("id", name.value);
            newPlayer.setAttribute("type", "button");
            newPlayer.innerHTML += name.value + ' <span aria-hidden="true" class="delete-player">&times;</span>';

            // Add the player to the bench
            document.querySelector("#PlayerPool").prepend(newPlayer);
            newPlayer.addEventListener('dragstart', handleDragStart, false);

            // // Add the player to the payer/payee dropdowns
            // var newOption = function(name) {
            //     var opt = document.createElement("option");
            //     opt.setAttribute("value",name.value);
            //     opt.innerHTML = name;
            //     return opt;
            // }

            // document.querySelector("#Payer").append(new newOption(name.value));
            // document.querySelector("#Payee").append(new newOption(name.value));

            // Clear and hide the form
            document.querySelector("#AddPlayerForm").classList.add("d-none");
            document.querySelector("#AddPlayerName").value = "";
        }
    }

    if (e.target.id == "save") {
        serializeTeams();
        // disable the save button
        e.target.disabled = true;
        //hide save button
        e.target.classList.add('hidden');
        //show spinner
        document.getElementById("loadingImage").classList.remove('hidden');

        // Get fields
        var gameDate = document.querySelector("#GameDate").value;
        var team1Score = document.querySelector("#Team1Score").value;
        var team2Score = document.querySelector("#Team2Score").value;
        var team1Players = JSON.parse(document.querySelector("#SerializedTeams").value).Team1Players;
        var team2Players = JSON.parse(document.querySelector("#SerializedTeams").value).Team2Players;

        // Basic clientside validation
        if (team1Score == "" || team2Score == "" || !isNumeric(team1Score) || !isNumeric(team2Score)) {
            alert('Must have non-blank numeric scores');
            e.target.disabled = false;
            e.target.classList.remove('hidden');
            document.getElementById("loadingImage").classList.add('hidden');
        }
        else if (team1Players.length == 0 || team2Players.length==0) {
            alert('Must have at least 1 player selected for each team.');
            e.target.disabled = false;
            e.target.classList.remove('hidden');
            document.getElementById("loadingImage").classList.add('hidden');
        }
        else {
            var dataToSave = {
                "League": 1,
                "Season": 3,
                "Date": gameDate,
                "Game": gameId,
                "Teams": [team1Players,team2Players],
                "Scores": [team1Score,team2Score],
            };
            
            fetch('https://api.volleybill.com/insert-game', {
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
                gameId=generateUUID();
                document.querySelector("#Team1Score").value='';
                document.querySelector("#Team2Score").value='';
                document.querySelector("#SerializedTeams").value = '';
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

// Set the default Game Date
document.querySelector("#GameDate").value = new Date().toDateInputValue();

// Set a unique id for this game
gameId = generateUUID();

// Populate dropdowns and the bench
// ajax()
//     .get('https://clbivolleyballinteractions.azurewebsites.net/api/GetDistinctPlayers?code=99R46uptkGih4U8YJESBsfzAKh9nLhDi/oaXtoBP121eJZHNl24uaA==')
//     .then(function(response){
var response = [{ "Player": "Chris", "GameCount": 103 }, { "Player": "Bert", "GameCount": 95 }, { "Player": "Keith", "GameCount": 94 }, { "Player": "Mehmet", "GameCount": 93 }, { "Player": "J.T.", "GameCount": 92 }, { "Player": "Tony", "GameCount": 89 }, { "Player": "David", "GameCount": 35 }, { "Player": "Jake", "GameCount": 34 }, { "Player": "Tad", "GameCount": 32 }, { "Player": "Josh", "GameCount": 30 }, { "Player": "Ray", "GameCount": 23 }, { "Player": "Charles", "GameCount": 22 }, { "Player": "Eric", "GameCount": 17 }, { "Player": "PK", "GameCount": 14 }, { "Player": "Jeff", "GameCount": 11 }, { "Player": "Elson", "GameCount": 10 }, { "Player": "Nick", "GameCount": 9 }, { "Player": "Justin", "GameCount": 7 }, { "Player": "Paul", "GameCount": 7 }, { "Player": "Bill", "GameCount": 5 }, { "Player": "Mako", "GameCount": 2 }, { "Player": "Jim", "GameCount": 2 }, { "Player": "Kishore", "GameCount": 2 }, { "Player": "Jacob", "GameCount": 2 }, { "Player": "CC", "GameCount": 1 }, { "Player": "Brett", "GameCount": 1 }, { "Player": "Tony L", "GameCount": 1 }, { "Player": "Jenn", "GameCount": 1 }];
for (var i = 0; i < response.length; i++) {
    var player = response[i].Player;

    // Populate bench
    var playerButton = document.createElement("button");
    playerButton.classList.add("player-name");
    playerButton.classList.add("btn");
    playerButton.classList.add("btn-sm");
    playerButton.classList.add("btn-primary");
    playerButton.classList.add("m-1");
    playerButton.setAttribute("draggable", "true");
    playerButton.setAttribute("id", player);
    playerButton.setAttribute("type", "button");

    var buttonSpan = document.createElement("span");
    buttonSpan.setAttribute("aria-hidden", "true");
    buttonSpan.classList.add("delete-player");
    buttonSpan.innerHTML = "&times;";

    playerButton.innerHTML = player.toString() + ' ';
    playerButton.appendChild(buttonSpan);
    document.querySelector("#PlayerPool").appendChild(playerButton);
}

// Add drag/drop events to player buttons
var playerButtons = document.querySelectorAll('.player-name');
[].forEach.call(playerButtons, function (player) {
    player.addEventListener('dragstart', handleDragStart, false);
});
var teamGroupings = document.querySelectorAll('.team-grouping');
[].forEach.call(teamGroupings, function (teamGrouping) {
    teamGrouping.addEventListener('dragover', handleDragOver, false);
    teamGrouping.addEventListener('drop', handleDrop, false);
});
// })
// .catch(function (error) {
//     console.log('ajax failure', error);
// });



// Populate the default serialized teams
serializeTeams();