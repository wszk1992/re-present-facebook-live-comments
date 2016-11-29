var settings = {fontsize:50, transparency:50, speed:50, filterComments:50,
 fontstyle:"initial", position:"fullscreen"};

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
  settings["fontstyle"] = msg["fontstyle"] ? msg["fontstyle"] : "initial";
  settings["position"] = msg["position"] ? msg["position"] : "fullscreen";
  settings["status"] = msg["status"] ? msg["status"] : false;
  $("#fontsizebar")[0].value = settings["fontsize"];
  $("#transparencybar")[0].value = settings["transparency"];
  $("#speedbar")[0].value = settings["speed"];
  $("#filtercommentsbar")[0].value = settings["filterComments"];
  $("#fontStyleSelector")[0].value = settings["fontstyle"];
  $("#img_" + settings["position"]).addClass('selected');
  $("#checkbox")[0].checked = settings["status"];
  document.getElementById("FontsizeValue").innerText ="Font Size: " + settings["fontsize"];
  document.getElementById("TransparencyValue").innerText ="Transparency: " + settings["transparency"];
  document.getElementById("SpeedValue").innerText ="Speed: " + settings["speed"];
  document.getElementById("filterCommentsValue").innerText ="Filter Comments: " + settings["filterComments"];

}

$("#checkbox").change(function() {
  settings["status"] = $(this).is(':checked');
  if ($(this).is(':checked')) {
    port.postMessage("open");
  } else {
    port.postMessage("close");
  }
});

$("#fontsizebar").change(function() {
  settings["fontsize"] = parseInt($(this)[0].value);
  document.getElementById("FontsizeValue").innerText ="Font Size: " + settings["fontsize"];
});

$("#transparencybar").change(function() {
  settings["transparency"] = parseInt($(this)[0].value);
  document.getElementById("TransparencyValue").innerText ="Transparency: " + settings["transparency"];
});

$("#speedbar").change(function() {
  settings["speed"] = parseInt($(this)[0].value);
  document.getElementById("SpeedValue").innerText ="Speed: " + settings["speed"];
});

$("#filtercommentsbar").change(function() {
  settings["filterComments"] = parseInt($(this)[0].value);
  document.getElementById("filterCommentsValue").innerText ="Filter Comments: " + settings["filterComments"];
});

$("#fontStyleSelector").change(function() {
  settings["fontstyle"] = $(this)[0].value;
});

$('img').click(function(){
  $('.selected').removeClass('selected');
  $(this).addClass('selected');
  settings["position"] = $(this)[0].id.slice(4);
})


setInterval(updateSettings, 100);

function updateSettings() {
  port.postMessage(settings);
}


