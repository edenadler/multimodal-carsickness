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
            console.log("hiii")
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
  
    // draw the video first
    ctx.drawImage(video, 0, 0, 300, 200);
  
    prediction.forEach((pred) => {
  
      // const strength = 10;
      // const amountOfSmoothingValues = 4;
      // let pastValues = Array(amountOfSmoothingValues).fill(0).map(val => [val, val]); 
      // const x = pred.topLeft[0];
      // const y = pred.topLeft[1];
      // const width = pred.bottomRight[0] - x;
      // const height = pred.bottomRight[1] - y;
      // // get coordinates ranging from 0 to 1, and flipped horizontally
      // const middle = [2 * (x + width / 2) / video.videoWidth - 1, -2 * (y + height / 2) / video.videoHeight + 1];
      // pastValues = [...pastValues.slice(1, amountOfSmoothingValues), middle];
      // const average = pastValues
      //     .reduce((sum, [x, y]) => [sum[0] + x, sum[1] + y], [0, 0])
      //     .map(v => v / amountOfSmoothingValues);
  
      // text.style.transform = `translate3D(${strength * average[0]}vw, ${strength * average[1]}vh, -45vw)`;
      // text.style.translateZ = '-45vw';
      // text.style.transformStyle = 'preserve-3d';
      // ^^^^
      
      // draw the rectangle enclosing the face
      ctx.beginPath();
      ctx.lineWidth = "4";
      ctx.strokeStyle = "blue";
      // the last two arguments are width and height
      // since blazeface returned only the coordinates, 
      // we can find the width and height by subtracting them.
      width = pred.bottomRight[0] - pred.topLeft[0];
      ctx.rect(
        pred.topLeft[0],
        pred.topLeft[1],
        width,
        pred.bottomRight[1] - pred.topLeft[1]
      );
      ctx.stroke();
      
      // drawing small rectangles for the face landmarks
      ctx.fillStyle = "red";
      pred.landmarks.forEach((landmark) => {
        ctx.fillRect(landmark[0], landmark[1], 5, 5);
      });
  
      const midpoint = (width)/2;
      const noseX = pred.landmarks[2][0];
  
      // perspectiveShift = (noseX-width - midpoint) < 20 ? 20 : (noseX-width - midpoint);
      perspectiveShift = (noseX-width)*10;
  
      // console.log(perspectiveShift)
      // console.log(pred);
      text.style.height = windowHeight + 'px';
      text.style.width = windowWidth*0.8 - 300 + 'px';
      text.style.right = pred.topLeft[0] + 'px';
      text.style.top = pred.topLeft[1] + 'px';
  
      if (document.getElementById("checkbox-toggle").checked) {
        text.style.transform = 'perspective(' + perspectiveShift + 'px) rotateY(' + 10 + 'deg)';
      } else {
        text.style.transform = 'perspective(0px) rotateY(0deg)';
      }
      
    });
  };
  
  setupCamera();
  video.addEventListener("loadeddata", async () => {
    model = await blazeface.load();
  
    // call detect faces every 100 milliseconds or 10 times every second
    setInterval(detectFaces, 100);
  });
    
