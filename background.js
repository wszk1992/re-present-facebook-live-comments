chrome.browserAction.onClicked.addListener(function(tab) {
  console.log("onClicked");
  chrome.tabs.executeScript(null, {file: "./content_script.js"});
});