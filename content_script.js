console.log("entering content_script");
var video_story_id = document.getElementsByClassName("_1kfp")[0].getAttribute("data-story-id");
console.log(video_story_id);
var video_id = video_story_id.substring(video_story_id.indexOf("VK") + 3);
console.log(video_id);
chrome.runtime.sendMessage({video_id: video_id}, function(res) {
	console.log(res.farewell);
});

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
    if (request.comments && request.settings) {
      sendResponse({farewell: "comments received"});
    	saveComments(request.comments, request.settings);
  	}
  });

var queue = {};

var width = window.innerWidth
|| document.documentElement.clientWidth
|| document.body.clientWidth;

var height = window.innerHeight
|| document.documentElement.clientHeight
|| document.body.clientHeight;


function saveComments(comments, settings) {
  for(var i = 0; i < comments.length; i++) {
    var x = width;
    if(Math.random() * 100 < settings["filterComments"]) {
      queue[comments[i]["id"]] = {message: comments[i]["message"], settings: settings, x: x};
    }
  }
}


if(!document.getElementById("bulletScreen")) {
    let div = document.createElement("div");
    div.id = "bulletScreen"; 
    div.style.position = "absolute";
    div["style"]["z-index"] = 1000;
    document.body.insertBefore(div, null);
    //let videoParent = document.querySelector("._1kfp video").parentElement;
    //videoParent.insertBefore(div, videoParent.childNodes[2]);
}

var bulletScreen = document.getElementById("bulletScreen");
bulletScreen.innerHTML = "";

// /mozfullscreenchange fullscreenchange

document.querySelector("._1kfp ._53j5").addEventListener('webkitfullscreenchange', function(e) {
  var state = document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen;
  console.log("webkitfullscreenchange");
  var bullet = document.getElementById("bulletScreen");
  if (state){
  //do something when fullscreen on
    document.querySelector("._1kfp ._53j5").appendChild(bullet);
  } else {
    document.body.appendChild(bullet)
  }
});


function move() {
  for(var id in queue) {
    if(!document.getElementById(id)) {
      var div = document.createElement("div");
      div.id = id;
      div.style.position = "absolute";
      div.style.color = "white";
      div.style.fontSize = queue[id]["settings"]["fontsize"] + "px";
      div.style.fontFamily = queue[id]["settings"]["fontstyle"];
      div.style.opacity = queue[id]["settings"]["transparency"] / 100.0;
      div.style["white-space"] = "nowrap";
      div.style.color = queue[id]["settings"]["color"];
      if(queue[id]["settings"]["position"] === "fullscreen") {
        div.style.top = Math.floor(Math.random() * height - div["style"]["line-height"]) + "px";
      } else if(queue[id]["settings"]["position"] === "top") {
        div.style.top = Math.floor(Math.random() / 4 * height) + "px";
      } else {
        div.style.top = Math.floor((Math.random() / 4 + 0.75) * height - div.offsetHeight) + "px";
      }
      div.innerText = queue[id]["message"];
      bulletScreen.insertBefore(div, null);
    }

    var div = document.getElementById(id);
    div.style.left = queue[id]["x"] + "px"; 
    queue[id]["x"] -= queue[id]["settings"]["speed"] / 20;
    if(queue[id]["x"] < -width) {
      delete queue[id];
      div.remove();
    }
  }
}


var interval = setInterval(move, 30);
