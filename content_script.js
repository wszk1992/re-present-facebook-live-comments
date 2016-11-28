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

function saveComments(comments, settings) {
  for(var i = 0; i < comments.length; i++) {
    var x = 0;
    var y = Math.floor((Math.random() * height / 2) + 1);
    queue[comments[i]["id"]] = {message: comments[i]["message"], settings: settings, x: x, y: y};
  }
}


var width = window.innerWidth
|| document.documentElement.clientWidth
|| document.body.clientWidth;

var height = window.innerHeight
|| document.documentElement.clientHeight
|| document.body.clientHeight;

if(!document.getElementById("bulletScreen")) {
    var canvas = document.createElement("canvas");
    canvas.id = "bulletScreen";
    canvas.width = width;
    canvas.height = height;
    canvas.style = "position: absolute; z-index: 1000"; 
    var node = document.body.childNodes[0];
    document.body.insertBefore(canvas, node);
  }

var canvas = document.getElementById("bulletScreen");
var ctx = canvas.getContext('2d');
ctx.font = "50px Arial";
var vx = 2;

setInterval(function(){ displayComments(queue); }, 1000/60);

function displayComments(queue) {
  refreshContext();
  for(var id in queue) {
    //onsole.log(comment);
    draw(id, queue[id]);
  }
}

function draw(id, comment) {
  var message = comment["message"];
  ctx.fillStyle = "#FF0000";
  var x = comment["x"];
  var y = comment["y"];
  ctx.fillText(message, x, y);
  comment["x"] += vx;
  if(comment["x"] > width) {
    delete queue[id];
  }
}

function refreshContext() {
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
  ctx.fillRect(0, 0, width, height); 
}

