if (localStorage.getItem('loggedIn') === 'yes') {
  $('.loginButtons').hide();
}else{
  $('.loginButtons').show();
}

(function(){

  //Initialize Firebase
  var config = {
    apiKey: "AIzaSyD2DB5hsGPQoyKWzQUREEVZLX38xDvRF44",
    authDomain: "mydjapp-2b450.firebaseapp.com",
    databaseURL: "https://mydjapp-2b450.firebaseio.com",
    projectId: "mydjapp-2b450",
    storageBucket: "mydjapp-2b450.appspot.com"
  };
  firebase.initializeApp(config);

  //Get elements
  const txtEmail          = document.getElementById('txtEmail');
  const signUptxtPassword = document.getElementById('signUptxtPassword');
  const signUptxtEmail    = document.getElementById('signUptxtEmail');
  const txtPassword       = document.getElementById('txtPassword');
  const txtPhone          = document.getElementById('txtPhone');
  const txtUserName       = document.getElementById('txtUserName');
  const txtProvider       = document.getElementById('txtProvider');
  const btnLogin          = document.getElementById('btnLogin');
  const btnSignUp         = document.getElementById('btnSignUp');
  const btnLogout         = document.getElementById('btnLogout');

  //Add login event
  btnLogin.addEventListener('click', e =>{
    //Get email and password
    const email     = txtEmail.value;
    const password  = txtPassword.value;
    const auth      = firebase.auth();
    //Sign in
    auth.signInWithEmailAndPassword(email,password);
  });

  //Add signup event
  btnSignUp.addEventListener('click', e =>{
    //Get email and password
    const signUpemail       = signUptxtEmail.value;
    const signUpPassword    = signUptxtPassword.value;
    const userName          = txtUserName.value;
    const phone             = txtPhone.value;
    const provider          = txtProvider.value;
    const auth              = firebase.auth();

    //Sign in
    const promise = auth.createUserWithEmailAndPassword(signUpemail,signUpPassword);

      $.ajax({
       type: 'POST',
       beforeSend: function(request) {
         request.setRequestHeader("Access-Control-Allow-Origin" , "*");
       },
       url: `https://us-central1-mydjapp-2b450.cloudfunctions.net/addUser?email=${signUpemail}&displayName=${userName}&password=${signUpPassword}&phone=${phone}&provider=${provider}`,
       dataType: 'json',
       success: function(result) {
         if(response.status === "success") {
                   // do something with response.message or whatever other data on success
               } else if(response.status === "error") {
                   // do something with response.message or whatever other data on error
                   alert('Ran into an error!');
               }
           }
      });
});


  btnLogout.addEventListener('click', e => {
    firebase.auth().signOut();
    localStorage.setItem('loggedIn', null);
    $('.nav-item').removeClass('active');
    $('.navbar-sidenav li[0]').addClass('active');
    $('.container-fluid').hide(),2000;
    $('.loginBG').show(),2000;
    $('.loginButtons').show(),2000;
    $('.loginForm').hide(),2000;
    $('.signUpForm').hide(),2000;
    $('#btnLogout').hide(),2000;
  })

  //Add a realtime listener
  firebase.auth().onAuthStateChanged(firebaseUser => {
    if(firebaseUser) {
      //User is logged in
      localStorage.setItem('loggedIn', 'yes');
      $('.loginButtons').hide(),2000;
      $('.nav-item.active').removeClass('active');
      $('.nav-item[title="Song List"]').addClass('active');
          if (firebaseUser.photoURL === null){
            $('.card-img-top').attr('src', 'http://jnashdev.com/myDJApp/img/noImage.png');
          }else{
            $('.card-img-top').attr('src', firebaseUser.photoURL);
          }
          if (firebaseUser.displayName === null){
            $('.card-title a').html('Name not found.');
          }else{
            $('.card-title a').html(firebaseUser.displayName);
          }
          $('.fixed-top').show();
          $('.loginBG').hide(),2000;
          $('.loginForm').hide(),2000;
          $('.signUpForm').hide(),2000;
          $('.container-fluid.songRequestList').show(),2000;
          $('#btnLogout').show(),2000;

          $('.songRequestsLink').click(function () {
            $('.songRequestList').show(),2000;
            $('.profileSection').hide(),2000;
          });

          $('.myProfileLink').click(function () {
            $('.songRequestList').hide(),2000;
            $('.profileSection').show(),2000;
          });

          $('.requestSearchToggle').click(function(){
              $('#searchForm').toggle();
          });

    }else{
      console.log(firebaseUser);
      $('.container-fluid').hide();
      $('.fixed-top').hide();

      $( ".showLogin" ).click(function() {
          $('.loginButtons').hide(),2000;
          $('.loginForm').show(),2000;
        });
      $('.showSignUp').click(function() {
          $('.loginButtons').hide(),2000;
          $('.signUpForm').show(),2000;
        });
      $('.showLoginButtons').click(function() {
          $('.loginButtons').show(),2000;
          $('.loginForm').hide(),2000;
          $('.signUpForm').hide(),2000;
        });
    }
  });

}());

//Smooth scrollTo onClick
$(document).on('click', 'a', function(event){
    event.preventDefault();
    $('.navbar-nav li').removeClass('active');
      $(this).parent().addClass('active');

      $('html, body').animate({
          scrollTop: $( $.attr(this, 'href') ).offset().top
      }, 500);
});

//getInfo
function getInfo() {
  "use strict";
    $.ajax({
    type: 'GET',
    url: 'https://mydjapp-2b450.firebaseio.com/events.json',
    dataType: 'json',
    success: function(gotInfo) {

      $('#songList').empty();
      console.log('Emptied #songList')

        var eventInfo 			= 	gotInfo.testEvent2.songList,
            songArray       =   [],
                    i       =   1;

                    if (event != null) {
                      $('p').remove(':contains("No requests yet!")');
                    }

            $.each(eventInfo, function(index, value) {
              var songName        = 	value.title,
                  songArtist      =   value.artist,
                  songImg         =   value.img_url,
                  songRequestor   =   value.user,
                  requestTotal    =   parseInt(value.requestTotal),
                  number          =   i++;

              songArray.push(songName + ' by ' + songArtist + '   (' + requestTotal + ' Requests)');


                    if  (requestTotal === 1) {
                        $('#songList').append('<div id="requestedSong ' + songName + '" data-requests="' + requestTotal + '" class="col-xl-12 col-sm-6 mb-3"><div class="card text-white o-hidden h-100"><div class="songBG" style="width: 100%; height: 100%; position:absolute; display:block; background-image:url(' + songImg + ');background-size:cover;filter:blur(2px) grayscale(100%) brightness(70%);opacity:0.25;"></div><div class="card-footer text-white clearfix small z-1"><span class="songInfo" style="float-left;font-weight:100;"><img style="margin-left: -10px;margin-right: 10px; width: 100px; height: 100px; border-radius: 60px;float:left;" src="' + songImg + '"/><div style="float:left;margin-top: 20px;"><span class="songName">' + songName + '</span><br><strong class="artistName">' + songArtist + '</strong></div></span><span class="float-right requests"><span class="requestNumber">1</span> Request</span></div></div></div>');
                    }else{
                      $('#songList').append('<div id="requestedSong ' + songName + '" data-requests="' + requestTotal + '" class="col-xl-12 col-sm-6 mb-3"><div class="card text-white o-hidden h-100"><div class="songBG" style="width: 100%; height: 100%; position:absolute; display:block; background-image:url(' + songImg + ');background-size:cover;filter:blur(2px) grayscale(100%) brightness(70%);opacity:0.25;"></div><div class="card-footer text-white clearfix small z-1"><span class="songInfo" style="float-left;font-weight:100;"><img style="margin-left: -10px;margin-right: 10px; width: 100px; height: 100px; border-radius: 60px;float:left;" src="' + songImg + '"/><div style="float:left;margin-top: 20px;"><span class="songName">' + songName + '</span><br><strong class="artistName">' + songArtist + '</strong></div></span><span class="float-right requests"><span class="requestNumber">' + requestTotal + '</span>Requests</span></div></div></div>');
                    }

                    /*if (songName.length > 17){
                      $('.songName').addClass('long');
                    }*/

              });

              var $songList = $('#songList'),
                	$songListDiv = $songList.children('div');

                $songListDiv.sort(function(a,b){
                	var an = parseInt(a.getAttribute('data-requests')),
                		  bn = parseInt(b.getAttribute('data-requests'));
                	if(an > bn) {
                    return -1;
                  }
                	if(an < bn) {
                    return 1;
                  }
                });

                $songListDiv.detach().appendTo($songList);

            var availableTags = songArray;

            //Autocomplete for searchSongs
            $('#trackSearch').autocomplete(
              { source: availableTags,
                select: function(event, ui) {
                    if(ui.item){
                        var foundTrack  = ui.item.value,
                            titleTrack  = foundTrack.split(' by ');

                            $.map(eventInfo,function (track) {
                                if (track.title == titleTrack[0]) {
                                  var songName        = 	track.title,
                                      artistName      =   track.artist,
                                      img_url         =   track.img_url,
                                      songRequestor   =   track.user,
                                      requestTotal    =   parseInt(track.requestTotal) + 1;

                              $.ajax({
                                 type: 'POST',
                                 url: 'https://us-central1-mydjapp-2b450.cloudfunctions.net/songRequest?songName=' + songName + '&artistName=' + artistName + '&image=' + img_url + '&requestTotal=' + requestTotal + '&userName=testUser1&eventName=testEvent2',
                                 dataType: 'json',
                                 success: function(result) {
                                   if(response.status === "success") {
                                             // do something with response.message or whatever other data on success
                                         } else if(response.status === "error") {
                                             // do something with response.message or whatever other data on error
                                             alert('Ran into an error!');
                                         }
                                     }
                               });

                                 $('#searchResult').empty();
                                 $('.fixed-top').append('<div class="alert alert-success"><strong>Nice!</strong> "' + songName + '" has been requested again!</div>');
                                 $('.alert.alert-success').delay(3000).fadeOut(3000, function() {
                                   $(this).remove();
                                 });
                                } else {
                                  return null
                                }
                          });
                      }
                      $(this).val(''); return false;
                  }
              });
          }
      })
  };

  var delay = 2000;
  getInfo();
  setInterval(getInfo, delay);

//searchSongs
$('#searchForm').submit(function(){
  "use strict";
  event.preventDefault();

    $('#searchResult').empty();

      var trackSearch	  = 	$('#searchForm #trackSearch').val();

      $.ajax({
      type: 'GET',
      url: 'https://ws.audioscrobbler.com/2.0?method=track.search&track=' + trackSearch +'&api_key=c0ecfd45992caa2309d902c828f38280&format=json&limit=20',
      dataType: 'json',
      success: function(output) {

        var searchResponse 			= 	output.results.trackmatches.track;

            $.each(searchResponse, function(index, value) {
                var trackName   = value.name,
                    artistName  = value.artist,
                    imagePath   = value.image[3]['#text'],
                    image       = '<img src="' + imagePath + '"/>';

              if(!imagePath){
                var image = '<img src="http://jnashdev.com/myDJApp/img/noImage.png" />'
              }

        $('#searchResult').append('<li>' + image + '<p>' + trackName + ' by ' + artistName + '</p></li>' )

          $('#searchResult li').off('click').on('click',function (){
            var str         = $(this).text(),
                song        = str.split(' by '),
                songName    = song[0],
                artistName  = song[1],
                img_url     = $(this).find("img").attr("src");

               $.ajax({
                type: 'POST',
                url: 'https://us-central1-mydjapp-2b450.cloudfunctions.net/songRequest.json?songName=' + songName + '&artistName=' + artistName + '&image=' + img_url + '&requestTotal=1&userName=testUser1&eventName=testEvent2',
                dataType: 'json',
                success: function(result) {
                  if(response.status === "success") {
                            // do something with response.message or whatever other data on success
                        } else if(response.status === "error") {
                            // do something with response.message or whatever other data on error
                            alert('Ran into an error!');
                        }
                    }
              });
              $('#searchResult').empty();
              $('.fixed-top').append('<div class="alert alert-success"><strong>Thanks!</strong>  "' + songName + '" has been requested.</div>');
              $('.alert.alert-success').delay(3000).fadeOut(3000, function() {
                $(this).remove();
              });
            })
          })
        }
    })
});
