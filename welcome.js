navigator.mediaDevices.getUserMedia({
    video: true
}).then(stream => {
  let status = document.getElementById('status');
  status.innerHTML = 'Webcam access granted for this extension, feel free to close this tab';
  status.style.color = '#579E81';
  
  chrome.storage.local.set({
    'camAccess': true
  }, () => {});
  
}).catch(err => {
  let status = document.getElementById('status');
  status.innerHTML = 'Error getting webcam access for this extension: ' + err.toString();
  status.style.color = 'red';

  console.error(err);
});