# See-sick Reader

## How to install as a Chrome Extension

1. Clone this repo
2. Open Google Chrome and go to the Extension Management page by navigating to: `chrome://extensions`
The Extension Management page can also be opened by clicking on the Chrome menu, hovering over More Tools then selecting Extensions
3. Enable Developer Mode by clicking the toggle switch next to **Developer Mode**
4. Click the **LOAD UNPACKED** button and select the extension directory

![Help with adding chrome extension](/assets/installing.png)

## Using Chrome Extension

1. To enable the extension, locate it in the Extension Management page and toggle it on in the bottom right corner of the extension you want to enable (See-sick Reader).
2. Your webcam should start. If it doesn't, try clicking the reload button to the left of the toggle
3. If this is your first time enabling, it should open a new tab instructing you to enable your webcam
4. Navigate to your desired webpage in the browser or refresh an existing active tab
5. Move your head around and see that it's working properly (the webpage should move along with your head movements)
6. If you'd like to play around with the available settings, click the puzzle extension button in the top right corner of your browser and select See-sick reader in the dropdown. The settings menu should appear for you.


## Code breakdown

manifest.json - starting point for all Chrome extensions containing all of the information and permissions needed to run the extension

lib/ - contains the minified packages of Tensorflow and Blazeface for use in the extension. For security reasons, Chrome doesn't allow accessing remote scripts in extensions

css/ - contains the stylesheets for the project

assets/ - contains media assets for the project

welcome.[html/js] - Launches when you first initialize the extension in your browser. Requests webcam access for the extension

popup.[html/js] - This is what appears when you click on the extension puzzle icon in the browser and select "See-sick Reader." It contains the user setting controls

background.[html/js] - Sets up the webcam, loads Blazeface face detection model, launches the welcome page to initialize the webcam, receives new face estimate predictions and saves them in local storage to be used by content.js

content.js - Script that runs on the webpages that are loaded in Chrome. Controls registering and manipulating the settings, processes the face prediction values and manipulates the DOM with CSS animation according to the user's face movement