var settings = [0,0,0];

var port = chrome.extension.connect({
      name: "Communication between backgound and popup"
  });

port.postMessage("request settings");
port.onMessage.addListener(function(msg) {
  console.log("message recieved: " + msg);
  if(typeof(msg) === "boolean") {
    document.getElementById("checkbox").checked = msg;
  }
  if(Array.isArray(msg) && msg.length === settings.length) {
    settings = msg.slice();
  } else {
    console.log("cannot detect the message");
  }
});


document.getElementById("button").addEventListener("click", function() {
	port.postMessage(settings);
});



document.getElementById("checkbox").addEventListener("click", function() {
	var checkbox = document.getElementById("checkbox");
	if(checkbox.checked) {
		port.postMessage("open");
	} else {
		port.postMessage("close");
	}
});

setTimeout(displaySettings, 20);

function displaySettings() {
  console.log(settings);
  settings = [2,2,2];
}


