const targetBody = document.body;
console.log(targetBody);
let windowHeight = window.innerHeight;
let windowWidth = window.innerWidth;
let SENSITIVITY_LEVEL = 11;


function moveBody(pred) {
    let width = pred.bottomRight[0] - pred.topLeft[0];

    // set new slider value if user changed its value
    chrome.storage.local.get('sliderValue', items => {
        if ('sliderValue' in items) {
            console.log('slider result', items.sliderValue)
            SENSITIVITY_LEVEL = items.sliderValue;
        }
    });
  
    const midpoint = (width)/2;
    const noseX = pred.landmarks[2][0];

    chrome.storage.local.get('recentPrediction', items => {
        const recentPrediction = items.recentPrediction;

        // if top left position different
        const leftDiff = Math.abs(pred.topLeft[0] - recentPrediction.topLeft[0]);

        // if bottom right position different
        const rightDiff = Math.abs(pred.bottomRight[0] - recentPrediction.bottomRight[0]);

        // if nose position different
        const noseDiff = Math.abs(pred.landmarks[2][0] - recentPrediction.landmarks[2][0]);
        
        console.log('leftDiff: ' + leftDiff + ' rightDiff: ' + rightDiff + ' noseDiff: ' + noseDiff)
        if (noseDiff < SENSITIVITY_LEVEL || rightDiff < SENSITIVITY_LEVEL || leftDiff < SENSITIVITY_LEVEL) {
            console.log('should NOT update coords');
            return;
        } else {
            console.log('should update coords');
            chrome.storage.local.set({'recentPrediction': pred});
        }
    });
  
    // perspectiveShift = (noseX-width - midpoint) < 20 ? 20 : (noseX-width - midpoint);
    // perspectiveShift = (noseX-width)*10;
    yRotation = (noseX-width)/20;
    console.log(yRotation)

    targetBody.style.position = 'absolute';
    targetBody.style.height = windowHeight + 'px';
    targetBody.style.width = windowWidth*0.9 + 'px';
    targetBody.style.right = pred.topLeft[0] + 'px';
    //   targetBody.style.top = pred.topLeft[1] + 'px';
    targetBody.style.transition = 'transform 0.1s linear';

    // allow user to show and remove 3d rotation animation
    chrome.storage.local.get('toggleChecked', items => {
        if ('toggleChecked' in items) {
            console.log('toggle result', items.toggleChecked)
            if (items.toggleChecked) {
                // removes 3d rotation
                targetBody.style.transform = 'perspective(0px) rotateY(0deg)';
            } else {
                targetBody.style.transform = 'perspective(' + windowWidth + 'px) rotateY(' + yRotation + 'deg)';
            }
        }
    });
};

// chrome.runtime.onMessage.addListener((request, sender) => {
//     if ('prediction' in request) {
//         console.log('PREDICTION RECEIVED', request.prediction);
//           const pred = request.prediction.newValue;
//           moveBody(pred);
//       }
// });


chrome.storage.onChanged.addListener((changes, namespace) => {
    if ('prediction' in changes) {
      console.log('prediction received', changes.prediction);
        const pred = changes.prediction.newValue;
        moveBody(pred);
    }
});