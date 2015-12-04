/**
 * Created by austinli on 11/10/15.
 */

function addHabit(image, day_freq){

    var title = getTitle();
    //var img = getBase64Image(image);
    var week_freq = getWeekFreq();

    var pweekly = [];
    for(var i=0; i<7; i++) {
        pweekly[i] = document.getElementById("date" + i).checked;
    }

    var other = document.getElementById('others');
    if(other.value != ""){
        day_freq = other.value;
    }
    
    var userID = window.localStorage.getItem("userID");

    var myFirebaseRef = new Firebase("https://torrid-fire-6209.firebaseio.com/");

    var random = makeid();
    var habitsRef = myFirebaseRef.child("users").child(userID).child("habits").child(random);


    var onComplete = function(error) {
        if (error) {
            console.log('Synchronization failed');
            sendRollbarError("Synchronization failed");
            document.getElementById('alert').innerHTML = '** error saving habit please try again **';

        } else {
            console.log('Synchronization succeeded');
            mixpanel.track("Habit Added", {
                title: title,
                //icon: img,
                weeklyfrequency: {
                    Sunday: pweekly[0],
                    Monday: pweekly[1],
                    Tuesday: pweekly[2],
                    Wednesday: pweekly[3],
                    Thursday: pweekly[4],
                    Friday: pweekly[5],
                    Saturday: pweekly[6]
                },
                dailyfrequency: day_freq,
                progress: 0
            });
            location.href="list.html";
        }
    };

    if(title == ""){
        document.getElementById('alert').innerHTML = '** Please provide a title **';
    }
    // TODO: Fill with habit values to add to firebase

    else if( week_freq.length == 0){
        document.getElementById('alert').innerHTML = '** Please provide a weekly frequency **';
    }

    else if( day_freq == null ){
        document.getElementById('alert').innerHTML = '** Please provide a daily frequency **';
    }
    else{
        habitsRef.set({
            title: title,
            //icon: img,
            weeklyfrequency: {
                Sunday: pweekly[0],
                Monday: pweekly[1],
                Tuesday: pweekly[2],
                Wednesday: pweekly[3],
                Thursday: pweekly[4],
                Friday: pweekly[5],
                Saturday: pweekly[6]
            },
            dailyfrequency: day_freq,
            progress: 0
        },onComplete);
    }
}

function makeid(){
    var text = "h";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=1; i < 25; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}


function getTitle(){
    return document.getElementById('title').value;
}

function getDayFreq(){
    day_freq =[];
    var collection = document.getElementById('daily-button').getElementsByTagName('input');
    for (var x=0; x<collection.length; x++) {
        if (collection[x].checked == true)
        day_freq.push(collection[x].text);
    }

    return day_freq;
}

function getWeekFreq(){
    week_freq =[];
    var collection = document.getElementById('ck-button').getElementsByTagName('input');
    for (var x=0; x<collection.length; x++) {
        if (collection[x].checked == true)
        week_freq.push(collection[x].value);
    }
    return week_freq;
}



function listHabits(){

    var userID = window.localStorage.getItem("userID");

    var myFirebaseRef = new Firebase("https://torrid-fire-6209.firebaseio.com");

    var habitsRef = myFirebaseRef.child("users").child(userID).child("habits");

    // TODO: retrieve habits and list them

    var element = document.getElementById("habit-list");

    mixpanel.track("Habits Viewed");

    habitsRef.once("value", function(snapshot) {
        snapshot.forEach(function(childSnapshot){
            console.log(childSnapshot.val());
            var newLi = document.createElement('li');
            newLi.id = childSnapshot.key();
            var progress = childSnapshot.val().progress;
            var goal = childSnapshot.val().dailyfrequency;
            var ratio = (progress / goal) * 200;
            newLi.innerHTML = "<ul class=\"habit-info\">" +
                "<li><div class=\"habit-name\">"+childSnapshot.val().title+"</div></li>" +
                "<li><img class=\"habit-icon\" src=\""+"add.png"/*childSnapshot.val().icon*/+"\" alt=\"habit icon\"></li> " +
                "</ul> " +
                "<div class=\"message\"> " +
                "<span class=\"message-total\"> " +
                "<strong>2</strong> days in a row! Best Record: <strong>5</strong><br> " +
                "<svg height=\"25\" width=\"200\">"+
                    "<line class=\"line1 \" x1=\"0\" y1=\"0\" x2=\""+ratio+"\" y2=\"0\" style=\"stroke:rgba(65, 131, 215, 0.8);stroke-width:25\" />"+
                    "<line class=\"line2 \" x1=\""+ratio+"\" y1=\"0\" x2=\"200\" y2=\"0\" style=\"stroke:rgba(171,171,171,0.6);stroke-width:25\" />"+
                "</svg>"+
                "</span><br> " +
                "<span class=\"message-today\">Completed <strong>1/1</strong> for today!</span>" +
                "</div>"+
                "<div class=\"habit-op\">"+
                    "<button type=\"button\" class=\"op op-done\" onclick=\"updateProgress(this);\" title=\"done\">"+
                        "<img src=\"done.svg\" alt=\"Done\">"+
                    "</button>"+
                    "<button type=\"button\" class=\"op op-edit\" onclick=\"goToHabit(this);\" title=\"edit habit\">"+
                        "<img src=\"edit.svg\" alt=\"Edit\">"+
                    "</button>"+
                    "<button type=\"button\" class=\"op op-del\" onclick=\"deleteHabit(this);\" title=\"delete habit\">"+
                        "<img src=\"delete.svg\" alt=\"Del\">"+
                    "</button>"+
                "</div>"+
                "</li>";

            var element = document.getElementById("habit-list");
            element.appendChild(newLi);

        });
    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
        sendRollbarError("The read failed: " + errorObject.code);
    });



}

function updateProgress(element){
var child = element.parentNode.parentNode;
var userID = window.localStorage.getItem("userID");
var myFirebaseRef = new Firebase("https://torrid-fire-6209.firebaseio.com");
var habitsRef = myFirebaseRef.child("users").child(userID).child("habits");
    habitsRef.once("value", function(snapshot) {
        snapshot.forEach(function(childSnapshot){
                    var msgElement = (element.parentNode.parentNode.getElementsByClassName("message-today"))[0];
                    var progress = (childSnapshot.val().progress) + 1;
                    var goal = childSnapshot.val().dailyfrequency;
                    var ratio = (progress/goal) *200;
                    
                    console.log(goal);
                    console.log(progress);
                     if (progress <= goal){

                            var line1 = element.parentNode.parentNode.getElementsByClassName("line1")[0];
                            line1.setAttribute("x2", ratio);
                            var line2 = element.parentNode.parentNode.getElementsByClassName("line2")[0];
                            line2.setAttribute("x1", ratio);


                            
                            msgElement.innerHTML = "Completed <strong>"+progress+"/"+goal+"</strong> for today!";
                            msgElement.style.visibility="visible";

                            var onComplete = function(error) {
                                if (error) {
                                    console.log('Synchronization failed');
                                    sendRollbarError("Synchronization failed");
                                } else {
                                    console.log('Synchronization succeeded');
                                }
                            };

    
                           
                            

                            var updateRef = habitsRef.child(child.id);

                            updateRef.update(
                                {
                                    progress: progress
                                },onComplete);
                        }

                    else{
                        msgElement.innerHTML = "Completed for today!";
                        msgElement.style.visibility="visible";
                    }

                    });
    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
        sendRollbarError("The read failed: " + errorObject.code)
    });
}

function removeHabit(key){

    console.log(key);
    var userID = window.localStorage.getItem("userID");

    var myFirebaseRef = new Firebase("https://torrid-fire-6209.firebaseio.com");

    var habitsRef = myFirebaseRef.child("users").child(userID).child("habits");

    // TODO: Insert unique ID of habit object here for deletion
    var deleteRef = habitsRef.child(key);

    var onComplete = function(error) {
        if (error) {
            console.log('Synchronization failed');
            sendRollbarError("Synchronization failed");
        } else {
            console.log('Synchronization succeeded');
            mixpanel.track("Habit Deleted");
        }
    };
    deleteRef.remove(onComplete);

}

function goToHabit(element){

    var child = element.parentNode.parentNode;

    window.localStorage.setItem("habitKey", child.id);

    location.href="edit.html";

    console.log(key);
}

function updateHabit(image){
    var pkey = window.localStorage.getItem("habitKey");
    console.log(pkey);

    var ptitle = document.getElementById("title-top").value;

    var img = getBase64Image(image);
    
    var pdaily;
    for(var i=1; i<=3; i++) {
        if(document.getElementById("day" + i).checked == true){
            pdaily = i;
        }
    }

    var other = document.getElementById("others").value;
    if(  other != ""){
        pdaily = other; 
    }

    var pweekly = [];
    for(var i=0; i<7; i++) {
        pweekly[i] = document.getElementById("date" + i).checked;
    }

    var userID = window.localStorage.getItem("userID");
    var myFirebaseRef = new Firebase("https://torrid-fire-6209.firebaseio.com");
    var habitsRef = myFirebaseRef.child("users").child(userID).child("habits");
    var updateRef = habitsRef.child(pkey);

    var onComplete = function(error) {
        if (error) {
            console.log('Synchronization failed');
            sendRollbarError("Synchronization failed");
        } else {
            console.log('Synchronization succeeded');
            mixpanel.track("Habit Updated", {
                title: ptitle,
                icon: img,
                weeklyfrequency: {
                    Sunday: pweekly[0],
                    Monday: pweekly[1],
                    Tuesday: pweekly[2],
                    Wednesday: pweekly[3],
                    Thursday: pweekly[4],
                    Friday: pweekly[5],
                    Saturday: pweekly[6]
                },
                dailyfrequency: pdaily
            });
        }
    };

    updateRef.update(
        {
            title: ptitle,
            icon: img,
            weeklyfrequency: {
                Sunday: pweekly[0],
                Monday: pweekly[1],
                Tuesday: pweekly[2],
                Wednesday: pweekly[3],
                Thursday: pweekly[4],
                Friday: pweekly[5],
                Saturday: pweekly[6]
            },
            dailyfrequency: pdaily
        }
        ,onComplete);

    location.href="list.html";
}


function getBase64Image(img) {

  if(img == null){
    var alert = document.getElementById('alert').innerHTML = '** Please select an icon **';
  }  
  else{
      var canvas = document.createElement("canvas");
      canvas.width = img.clientWidth;
      canvas.height = img.clientHeight;
      var ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0,img.clientWidth, img.clientHeight);
      var dataURL = canvas.toDataURL("image/png");
      return dataURL;
    }
}

