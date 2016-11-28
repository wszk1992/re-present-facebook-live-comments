var settings = [1,1,1];
var comments_open = false;
//Initialize Facebook API.
window.fbAsyncInit = function() {
	FB.init({
	  appId      : '140090773130358',
	  xfbml      : true,
	  version    : 'v2.8'
	});

	fbInitDone = 1;

};

//Execute content_script.js on the page.
// chrome.browserAction.onClicked.addListener(function(tab) {
//   chrome.tabs.executeScript(null, {file: "content_script.js", runAt: "document_end"});
// });

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
    } else if(Array.isArray(msg) && msg.length === settings.length) {
			settings = msg.slice();
			console.log("settings updated");
			port.postMessage("settings received");
		} else {
			console.log("receive error message");
			port.postMessage("error");
		}
	});
});


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
