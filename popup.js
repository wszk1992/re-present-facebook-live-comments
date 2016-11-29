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
  settings["fontsize"] = msg["fontsize"] ? msg["fontsize"] : 50;
  settings["transparency"] = msg["transparency"] ? msg["transparency"] : 50;
  settings["speed"] = msg["speed"] ? msg["speed"] : 50;
  settings["filterComments"] = msg["filterComments"] ? msg["filterComments"] : 50;
  settings["fontstyle"] = msg["fontstyle"] ? msg["fontstyle"] : "Aril";
  settings["position"] = msg["position"] ? msg["position"] : "top";
}
// function clone(msg) {
//   settings["fontsize"] = msg["fontsize"];
//   settings["transparency"] = msg["transparency"];
//   settings["speed"] = msg["speed"];
//   settings["filterComments"] = msg["filterComments"];
//   settings["fontstyle"] = msg["fontstyle"];
//   settings["position"] = msg["position"];
// }
$("#checkbox").change(function() {
  if ($(this).is(':checked')) {
    port.postMessage("open");
  } else {
    port.postMessage("close");
  }
});

$("#fontsizebar").change(function() {
  settings["fontsize"] = parseInt($(this)[0].value);
});

$("#transparencybar").change(function() {
  settings["transparency"] = parseInt($(this)[0].value);
});

$("#speedbar").change(function() {
  settings["speed"] = parseInt($(this)[0].value);
});

$("#filtercommentsbar").change(function() {
  settings["filterComments"] = parseInt($(this)[0].value);
});

$("#fontStyleSelector").change(function() {
  settings["fontstyle"] = $(this)[0].value;
});


setInterval(updateSettings, 100);

function updateSettings() {
  port.postMessage(settings);
}


