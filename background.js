let video = document.getElementById("video");
let model;
let windowHeight = window.innerHeight;
let windowWidth = window.innerWidth;

// Get webcam permission
chrome.runtime.onInstalled.addListener((details) => {
    // if (details.reason.search(/install/g) === -1) {
    //     console.log("not needed")
    //   return;
    // }
    chrome.tabs.create({
      url: chrome.extension.getURL('welcome.html'),
      active: true
    });
});

function setupCamera() {
    navigator.mediaDevices
        .getUserMedia({
            video: true,
            audio: false,
        })
        .then((stream) => {
            console.log("webcam streaming working")
            video.srcObject = stream;
        }).catch((error) => {
            console.warn(error);
        });
};

// If cam acecss has already been granted to this extension, setup webcam.
chrome.storage.local.get('camAccess', items => {
    if (!!items['camAccess']) {
      console.log('cam access already exists');
      setupCamera();
    }
});
  
  // If cam acecss gets granted to this extension, setup webcam.
chrome.storage.onChanged.addListener((changes, namespace) => {
    if ('camAccess' in changes) {
        console.log('cam access granted');
        setupCamera();
    }
});

const detectFaces = async () => {
    const prediction = await model.estimateFaces(video, false);
    let tabId = -1;

    // only change for active tab
    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, (tabs) => {
        // Find the active tab in the browser.
        if (tabs.length == 0) {
          console.log('no active tab');
          return;
        }
        tabId = tabs[0].id;
    
        prediction.forEach((pred) => {
            // initialize prediction values if not yet set - used for reference to prevent jitteriness
            chrome.storage.local.get('recentPrediction', items => {
                if (!'recentPrediction' in items) {
                    chrome.storage.local.set({'recentPrediction': pred});
                }
            });

            chrome.storage.local.set({
                'prediction': pred
            });

            // Send a message to the active tab with the prediction
            chrome.tabs.sendMessage(tabId, {'prediction': pred});
        });
    });
};
  
setupCamera();
video.addEventListener("loadeddata", async () => {
    model = await blazeface.load();

    // call detect faces every 100 milliseconds or 10 times every second
    setInterval(detectFaces, 100);
});

