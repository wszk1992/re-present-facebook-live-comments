var settings = {};

var port = chrome.extension.connect({
      name: "Communication between backgound and popup"
  });

port.postMessage("request settings");
port.onMessage.addListener(function(msg) {
  console.log("message recieved: " + msg);
  console.log(typeof(msg));
  if(typeof(msg) === 'boolean') {
    document.getElementById("checkbox").checked = msg;
  } else if(typeof(msg) === 'object') {
    clone(msg);
  } else if(typeof(msg) === 'string') {
    console.log(msg);
  } else {
    console.log("cannot detect the message");
  }
});


// document.getElementById("button").addEventListener("click", function() {
// 	port.postMessage(settings);
// });

function clone(msg) {
  settings["fontsize"] = msg["fontsize"] || 50;
  settings["transparency"] = msg["transparency"] || 50;
  settings["speed"] = msg["speed"] || 50;
  settings["filterComments"] = msg["filterComments"] || 50;
  settings["fontstyle"] = msg["fontstyle"] || "Aril";
  settings["position"] = msg["position"] || "top";
}

$("#checkbox").change(function() {
  if ($(this).is(':checked')) {
    port.postMessage("open");
  } else {
    port.postMessage("close");
  }
});

$("#fontsizebar").change(function() {
  settings["fontsize"] = parseInt($(this).value);
});

$("#transparencybar").change(function() {
  settings["transparency"] = parseInt($(this).value);
});

$("#speedbar").change(function() {
  settings["speed"] = parseInt($(this).value);
});

$("#filtercommentsbar").change(function() {
  settings["filterComments"] = parseInt($(this).value);
});

$("#fontStyleSelector").change(function() {
  settings["fontstyle"] = parseInt($(this).value);
});

$("#fontStyleSelector").change(function() {
  settings["fontstyle"] = parseInt($(this).value);
});

setTimeout(updateSettings, 100);

function updateSettings() {
  port.postMessage(settings);
}


