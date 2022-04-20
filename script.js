let video = document.getElementById("video");
let model;
// declare a canvas variable and get its context
let canvas = document.getElementById("canvas");
let text = document.getElementById("static-text");
let windowHeight = window.innerHeight;
let windowWidth = window.innerWidth;
console.log(windowHeight, windowWidth);
let ctx = canvas.getContext("2d");
let px = 50; // Position x and y
let py = 50;
let vx = 0.0; // Velocity x and y
let vy = 0.0;
let updateRate = 1/60; // Sensor refresh rate

const setupCamera = () => {
  navigator.mediaDevices
    .getUserMedia({
      video: { width: 300, height: 200 },
      audio: false,
    })
    .then((stream) => {
      video.srcObject = stream;
    });
};

const handleOrientation = () => {
  console.log("hi!!!")
  window.addEventListener('deviceorientation',(event) => {
    // Expose each orientation angle in a more readable way
    rotation_degrees = event.alpha;
    frontToBack_degrees = event.beta;
    leftToRight_degrees = event.gamma;
    
    // Update velocity according to how tilted the phone is
    // Since phones are narrower than they are long, double the increase to the x velocity
    vx = vx + leftToRight_degrees * updateRate*2; 
    vy = vy + frontToBack_degrees * updateRate;
    
    // Update position and clip it to bounds
    px = px + vx*.5;
    if (px > 98 || px < 0){ 
        px = Math.max(0, Math.min(98, px)) // Clip px between 0-98
        vx = 0;
    }

    py = py + vy*.5;
    if (py > 98 || py < 0){
        py = Math.max(0, Math.min(98, py)) // Clip py between 0-98
        vy = 0;
    }
    
    dot = document.getElementsByClassName("indicatorDot")[0]
    dot.setAttribute('style', "left:" + (px) + "%;" +
                                  "top:" + (py) + "%;");
    
  });
};

const loadDeviceSensor = () => {
  if (typeof DeviceMotionEvent.requestPermission === 'function') {
    // Handle iOS 13+ devices.
    DeviceMotionEvent.requestPermission()
      .then((state) => {
        if (state === 'granted') {
          window.addEventListener('devicemotion', handleOrientation);
        } else {
          console.error('Request to access the orientation was rejected');
        }
      })
      .catch(console.error);
  } else {
    // Handle regular non iOS 13+ devices.
    window.addEventListener('devicemotion', handleOrientation);
  }
};

const detectFaces = async () => {
  const prediction = await model.estimateFaces(video, false);

  // console.log(prediction);

  // draw the video first
  ctx.drawImage(video, 0, 0, 300, 200);

  prediction.forEach((pred) => {
    
    // draw the rectangle enclosing the face
    ctx.beginPath();
    ctx.lineWidth = "4";
    ctx.strokeStyle = "blue";
    // the last two arguments are width and height
    // since blazeface returned only the coordinates, 
    // we can find the width and height by subtracting them.
    ctx.rect(
      pred.topLeft[0],
      pred.topLeft[1],
      pred.bottomRight[0] - pred.topLeft[0],
      pred.bottomRight[1] - pred.topLeft[1]
    );
    ctx.stroke();
    
    // drawing small rectangles for the face landmarks
    // ctx.fillStyle = "red";
    // pred.landmarks.forEach((landmark) => {
    //   ctx.fillRect(landmark[0], landmark[1], 5, 5);
    // });

    // console.log(pred.topLeft[0], pred.topLeft[1]);
    text.style.height = windowHeight + 'px';
    text.style.width = windowWidth*0.8 - 300 + 'px';
    text.style.right = pred.topLeft[0] + 'px';
    text.style.top = pred.topLeft[1] + 'px';
    
  });
};

loadDeviceSensor();
setupCamera();
video.addEventListener("loadeddata", async () => {
  model = await blazeface.load();
  // call detect faces every 100 milliseconds or 10 times every second
  setInterval(detectFaces, 100);
});

