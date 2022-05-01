const targetBody = document.body;
console.log(targetBody);
let windowHeight = window.innerHeight;
let windowWidth = window.innerWidth;

function moveBody(pred) {
      
    console.log('pred', pred)
    //   // draw the rectangle enclosing the face
    //   ctx.beginPath();
    //   ctx.lineWidth = "4";
    //   ctx.strokeStyle = "blue";
    //   // the last two arguments are width and height
    //   // since blazeface returned only the coordinates, 
    //   // we can find the width and height by subtracting them.
      width = pred.bottomRight[0] - pred.topLeft[0];
    //   ctx.rect(
    //     pred.topLeft[0],
    //     pred.topLeft[1],
    //     width,
    //     pred.bottomRight[1] - pred.topLeft[1]
    //   );
    //   ctx.stroke();
      
    //   // drawing small rectangles for the face landmarks
    //   ctx.fillStyle = "red";
    //   pred.landmarks.forEach((landmark) => {
    //     ctx.fillRect(landmark[0], landmark[1], 5, 5);
    //   });
  
      const midpoint = (width)/2;
      const noseX = pred.landmarks[2][0];
  
      // perspectiveShift = (noseX-width - midpoint) < 20 ? 20 : (noseX-width - midpoint);
      perspectiveShift = (noseX-width)*10;
  
      // console.log(perspectiveShift)
      // console.log(pred);
      targetBody.style.height = windowHeight + 'px';
      targetBody.style.width = windowWidth*0.8 - 300 + 'px';
      targetBody.style.right = pred.topLeft[0] + 'px';
      targetBody.style.top = pred.topLeft[1] + 'px';
  
      if (true) {
        targetBody.style.transform = 'perspective(' + perspectiveShift + 'px) rotateY(' + 10 + 'deg)';
      } else {
        targetBody.style.transform = 'perspective(0px) rotateY(0deg)';
      }

};


chrome.storage.onChanged.addListener((changes, namespace) => {
    
    if ('prediction' in changes) {
    //   console.log('prediction received', changes);
        const pred = changes.prediction.newValue;
        moveBody(pred);
    }
});