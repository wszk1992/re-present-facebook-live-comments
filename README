#HOW TO USE

Download the folder and drag it to chrome extension page
Enter a facebook live video page and click the extension button
Set parameters in popup page and open the bullet screen by cilck the button in popup page



Process:

1. background.js
  * Initialize Facebook API.
  * Add listener waiting for the message from popup.html
  * Add listener waiting for the message from content_script.js
  * Detect LOOP: (interval: 1000ms)
	If video_id not detected
	|| fb API initializeation havn't done
	|| comments_open havn't been checked
	  	continue;
        else 
  		Call fb api to get newest comments and send them and settings to content_script.js.

	
2. popup.html(setting interface)
  * Add listener waiting for the message from background.js
  * Display settings and checkbox status received from background.js
  * By clicking checkbox to send checkbox status to background.js
 
3. content_script.js
  * Get video_id from target page and send it to background.js
  * Add listener waiting for the comments and settings from background.js
  * Display the comments
