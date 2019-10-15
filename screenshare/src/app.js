// Modified by hokein
//
// Copyright 2014 Intel Inc.
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//   http://www.apache.org/licenses/LICENSE-2.0
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
// Author: Dongseong Hwang (dongseong.hwang@intel.com)

const {desktopCapturer} = require('electron');

let desktopSharing = false;
let localStream;

function refresh() {
  $('select').imagepicker({
    hide_select : true
  });
}

function addSource(source) {
  $('select').append($('<option>', {
    value: source.id.replace(":", ""),
    text: source.name
  }));
  $('select option[value="' + source.id.replace(":", "") + '"]').attr('data-img-src', source.thumbnail.toDataURL());
  refresh();
}

function showSources() {
  desktopCapturer.getSources({ types:['window', 'screen'] }, function(error, sources) {
    for (let source of sources) {
      console.log("Name: " + source.name);
      addSource(source);
    }
  });
}

function toggle() {
  console.log("toggle picked")
  if (!desktopSharing) {
    document.querySelector('button').innerHTML = "Stop Screenshare";
    var id = ($('select').val()).replace(/window|screen/g, function(match) { return match + ":"; });
    onAccessApproved(id);
  } else {
    desktopSharing = false;

    if (localStream)
      localStream.getTracks()[0].stop();
    localStream = null;

    document.querySelector('button').innerHTML = "Start Screenshare";
    stopTokBoxPublisher();
    $('select').empty();
    showSources();
    refresh();
  }
}

function onAccessApproved(desktop_id) {
  if (!desktop_id) {
    console.log('Desktop Capture access rejected.');
    return;
  }
  desktopSharing = true;
  console.log("Desktop sharing started.. desktop_id:" + desktop_id);
  navigator.webkitGetUserMedia({
    audio: false,
    video: {
      mandatory: {
        chromeMediaSource: 'desktop',
        chromeMediaSourceId: desktop_id,
        minWidth: 1280,
        maxWidth: 1280,
        minHeight: 720,
        maxHeight: 720
      }
    }
  }, gotStream, getUserMediaError);

  function gotStream(stream) {
    localStream = stream;
    startTokboxPublisher(localStream);

    // document.querySelector('video').src = URL.createObjectURL(stream);
    stream.onended = function() {
      if (desktopSharing) {
        toggle();
      }
    };
  }

  function getUserMediaError(e) {
    console.log('getUserMediaError: ' + JSON.stringify(e, null, '---'));
  }
}

$(document).ready(function() {
  showSources();
  refresh();
});

document.querySelector('button').addEventListener('click', function(e) {
  toggle();
});



/* global OT API_KEY TOKEN SESSION_ID SAMPLE_SERVER_BASE_URL */

// Helpers
function handleError(error) {
    if (error) {
      console.error(error);
    }
  }

// Tokbox
  var apiKey;
  var sessionId;
  var token;


  var session;

  function initializeTokboxSession() {
    console.log("\n\n\n\n #$######\n TRYING TO START SESSION")
    session = OT.initSession(apiKey, sessionId);
    console.log(JSON.stringify(session));
    // Subscribe to a newly created stream
    session.on('streamCreated', function streamCreated(event) {
      if(event.stream.id === sessionId)
      console.log("EVENT FROM STREAM CREATED", JSON.stringify(event))
      var subscriberOptions = {
        insertMode: 'append',
        width: '100%',
        height: '100%'
      };
      session.subscribe(event.stream, 'subscriber', subscriberOptions, handleError);
    });

    session.on('sessionDisconnected', function sessionDisconnected(event) {
      console.log('You were disconnected from the session.', event.reason);
    });

    // Connect to the session
    session.connect(token, function callback(error) {
      if (error) {
        handleError(error);
      }
    });
  }
  
  var publisherVideo = document.createElement("video");
  publisherVideo.id = "publisherVideo";

  function startTokboxPublisher(stream){
    console.log("publisher pushed")
    var publisherOptions = {
      videoSource: stream.getVideoTracks()[0],
      audioSource: null,
      insertMode: 'append',
      width: 1280,
      height: 720
    };

    publisher = OT.initPublisher('publisherVideo', publisherOptions, function(error){
      if (error) {
        console.log("ERROR: " + error);
      } else {
        session.publish(publisher, function(error) {
          console.log("ERROR FROM Session.publish: " + error);
        })
      }
    });
  }

  function stopTokBoxPublisher(){
    console.log("TOK BOX STOPED!")
    publisher.destroy();
  }

// main
  function startup(){
    console.log("\n\n IN STARTUP \n\n") 
    // Make an Ajax request to get the OpenTok API key, session ID, and token from the server
    fetch("https://hifi-test.herokuapp.com" + '/room/test')
    .then(function(res) {
      return res.json();
    })
    .then(function fetchJson(json) {
      apiKey = json.apiKey;
      sessionId = json.sessionId;
      token = json.token;

      initializeTokboxSession();
    })
    .catch(function catchErr(error) {
      handleError(error);
      alert('Failed to get opentok sessionId and token. Make sure you have updated the config.js file.');
    });
  }
  startup();