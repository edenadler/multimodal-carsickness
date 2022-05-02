let video = document.getElementById("video");
let model;
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let windowHeight = window.innerHeight;
let windowWidth = window.innerWidth;
let text = video;

// Gain permission to webcam
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
    // console.log('detectFaces called');
    const prediction = await model.estimateFaces(video, false);

    // initialize prediction values if not yet set
    chrome.storage.local.get('recentPrediction', items => {
        if (!'recentPrediction' in items) {
            chrome.storage.local.set({'recentPrediction': pred});
        }
    });
    
    // draw the video first
    // ctx.drawImage(video, 0, 0, 300, 200);
  
    prediction.forEach((pred) => {

        chrome.storage.local.set({
            'prediction': pred
        });
    });
  };
  
  setupCamera();
  video.addEventListener("loadeddata", async () => {
    model = await blazeface.load();
  
    // call detect faces every 100 milliseconds or 10 times every second
    setInterval(detectFaces, 100);
  });
    
