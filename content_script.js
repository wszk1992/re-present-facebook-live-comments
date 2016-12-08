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
var path = [];
var pathNum = 10;
for(var i = 0; i < pathNum; i++) {
  path.push(0);
}


var width = window.innerWidth
|| document.documentElement.clientWidth
|| document.body.clientWidth;

var height = window.innerHeight
|| document.documentElement.clientHeight
|| document.body.clientHeight;


function saveComments(comments, settings) {
  for(var i = 0; i < comments.length; i++) {
    var x = width;
    var y;
    if(settings["position"] == "fullscreen") {
      y = firstAvailablePath(0, pathNum);
    } else if(settings["position" == "top"]) {
      y = firstAvailablePath(0, pathNum / 2 - 1);
    } else {
      y = firstAvailablePath(pathNum / 2 + 1, pathNum);
    }
    if(y != -1 && Math.random() * 100 < settings["filterComments"]) {
      path[y] = 1;
      queue[comments[i]["id"]] = {message: comments[i]["message"], settings: settings, x: x, y: y};
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
      div.style.color = queue[id]["settings"]["color"] == "0" ? getRandomColor() : queue[id]["settings"]["color"];
      div.style.top = (queue[id]["y"] * height / pathNum) + "px";
      div.innerText = queue[id]["message"];
      bulletScreen.insertBefore(div, null);
    }
    var div = document.getElementById(id);
    div.style.left = queue[id]["x"] + "px"; 
    queue[id]["x"] -= queue[id]["settings"]["speed"] / 20;
    if(queue[id]["x"] < -width) {
      path[queue[id]["y"]] = 0;
      delete queue[id];
      div.remove();
    }
  }
}

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function firstAvailablePath(start, end) {
  for(var i = start; i < end; i++) {
    if(path[i] == 0) {
      return i;
    }
  }
  return -1;
}


var interval = setInterval(move, 30);
