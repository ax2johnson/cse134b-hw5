function onClickSignUp() {

  var myFirebaseRef = new Firebase("https://torrid-fire-6209.firebaseio.com/");
  myFirebaseRef.createUser({
  email    : document.getElementById('usermail').value,
  password : document.getElementById('password').value
}, function(error, userData) {
  if (error) {
    console.log("Error creating user:", error);
    sendRollbarError("Error creating user: " + error);
    var signUpFailed = document.getElementById("signInFailed");
    signUpFailed.innerHTML = "Login Failed! <br>" + error;
    signUpFailed.style.display = "block";
  } 
  else {
   // myFirebaseRef.onAuth(function(authData) {
      //if (authData) {
        // save the user's profile into the database so we can list users,
        // use them in Security and Firebase Rules, and show profiles
        myFirebaseRef.child("users").child(userData.uid).set({
          name: document.getElementById('usermail').value.replace(/@.*/, ''),
          email: document.getElementById('usermail').value
        });
      //}
      //myFirebaseRef.unauth();
    //});
    console.log("Successfully created user account with uid:", userData.uid);
    var signUpText = document.getElementById("signInMessage");
    mixpanel.track("User Registered", {
      "email": document.getElementById('usermail').value
    });
     var hide = document.getElementById("signInFailed");
     hide.style.display = "none";
    signUpText.style.display = "block";
  }
});
}

function onClickLogin(){
  var myFirebaseRef = new Firebase("https://torrid-fire-6209.firebaseio.com/");
  myFirebaseRef.authWithPassword({
    email    : document.getElementById('usermail').value,
    password : document.getElementById('password').value
  }, function(error, authData) {
    if (error) {
      console.log("Login Failed!", error);
      sendRollbarError("Login Failed: "+error);
      var signUpFailed = document.getElementById("signInFailed");
      signUpFailed.innerHTML = "Login Failed! <br>" + error;
      signUpFailed.style.display = "block";
    } 
    else {
      console.log("Authenticated successfully with payload:", authData);
      mixpanel.track("User Login", {
        "email": document.getElementById('usermail').value
      });
      //window.location.href = "welcome.html";
      myFirebaseRef.onAuth(function(authData) {
        if (authData) {
          // save the user's profile into the database so we can list users,
          // use them in Security and Firebase Rules, and show profiles
          var username = authData.password.email.replace(/@.*/, '');
          console.log(username);
          window.localStorage.setItem("theUser", username);
          window.localStorage.setItem("userID", authData.uid);
          location.href = "welcome.html";
        }
      });
    }
  });
}
