///
/// Variables
///

///
/// Methods
///

///
/// Event Listeners
///

// All page events
window.addEventListener('click', function (e) {

    if (e.target.id == "login") {
        // disable the button
        e.target.disabled = true;
        //hide button
        e.target.classList.add('hidden');
        //show spinner
        document.getElementById("loadingImage").classList.remove('hidden');

        // Get fields
        var email = document.querySelector("#Email").value;
        var password = document.querySelector("#Password").value;

        // Basic clientside validation
        if (email == "" || password == "") {
            alert('Email, Password cannot be blank');
            e.target.disabled = false;
            e.target.classList.remove('hidden');
            document.getElementById("loadingImage").classList.add('hidden');
        }
        else {
            var authData = {
                "AuthParameters" : {
                    "USERNAME": email,
                    "PASSWORD": password
                },
                "AuthFlow": "USER_PASSWORD_AUTH",
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


                //hide form and display success
                document.querySelector("#loginForm").classList.add("hidden");
                document.querySelector("#success").classList.remove("hidden");
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
