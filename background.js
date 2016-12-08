var settings = {};
var comments_open = false;
//Initialize Facebook API.
window.fbAsyncInit = function() {
	FB.init({
	  appId      : '772166019588214',
	  xfbml      : true,
	  version    : 'v2.8'
	});

	fbInitDone = 1;

};

//Waiting for receiving video_id from content_script.js.
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
    if (request.video_id) {
      video_id = request.video_id;
    	console.log("video_id: " + request.video_id);
      	sendResponse({farewell: "goodbye"});
  	} else {
  		sendResponse({farewell: "kiss off"});
  	}
  }
);

//Execute content_script.js on the page.
chrome.tabs.onActivated.addListener(function() {
  chrome.tabs.executeScript(null, {file: "content_script.js", runAt: "document_end"});
});


chrome.extension.onConnect.addListener(function(port) {
	console.log("Connected with popup");
	port.onMessage.addListener(function(msg) {
		console.log("message recieved: " + msg);
		if(msg === "request settings") {
			port.postMessage(settings);
      port.postMessage(comments_open);
		} else if(msg === "open") {
      comments_open = true;
      //execute content script every time receiving settings from popup
      chrome.tabs.executeScript(null, {file: "content_script.js", runAt: "document_end"});
    } else if(msg === "close") {
      comments_open = false;
    } else if(typeof(msg) === 'object') {
			clone(msg);
			console.log("settings updated");
			port.postMessage("settings received");
		} else {
			console.log("receive error message");
			port.postMessage("error");
		}
	});
});



function clone(msg) {
  settings["fontsize"] = msg["fontsize"] ? msg["fontsize"] : 50;
  settings["transparency"] = msg["transparency"] ? msg["transparency"] : 100;
  settings["speed"] = msg["speed"] ? msg["speed"] : 50;
  settings["filterComments"] = msg["filterComments"] ? msg["filterComments"] : 100;
  settings["fontstyle"] = msg["fontstyle"] ? msg["fontstyle"] : "initial";
  settings["position"] = msg["position"] ? msg["position"] : "fullscreen";
  settings["status"] = msg["status"] ? msg["status"] : false;
  settings["color"] = msg["color"] ? msg["color"] : "#ffffff";
}


var maxCount = 20;
var curDate = Date();
var counter = 0;
//get newest comments every 1s
var myTimer = setInterval(detect, 1000);


function detect() {
  if (typeof video_id === 'undefined' || typeof fbInitDone === 'undefined' || comments_open === false) {
    return;
  } else {
    FB.api("/" + video_id, {fields: 'comments.order(reverse_chronological)'}, function(response) {
        var data = response.comments.data;
        var length = data.length < maxCount ? data.length : maxCount;
        var comments = [];
        for(var i = 0; i < length; i++) {
          var d = new Date(data[i].created_time);
          //only record new comments
          if (d > curDate) {
            comments.push({message: data[i].message.toString(), id: data[i].id});
          } else {
            break;
          }
        }
        //send comments to content script
        if(comments.length > 0) {
          chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {comments: comments, settings: settings}, function(response) {
              console.log(response.farewell);
            });
          });
        }
        curDate = new Date(data[0].created_time);
        counter++;
      });
  }
}
