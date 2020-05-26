const video = document.getElementById('video')

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('models'),
  faceapi.nets.faceExpressionNet.loadFromUri('models')
]).then(startVideo)

function startVideo() {
  navigator.getUserMedia(
    { video: {} },
    stream => video.srcObject = stream,
    err => console.error(err)
  )
}

video.addEventListener('play', () => {
  const canvas = faceapi.createCanvasFromMedia(video)
  document.body.append(canvas)
  const displaySize = { width: video.width, height: video.height }
  faceapi.matchDimensions(canvas, displaySize)
  setInterval(async () => {
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
    const resizedDetections = faceapi.resizeResults(detections, displaySize)
    //console.log(detections);
    //console.log(detections[0]['expressions']['happy']);
    if(typeof(detections[0])!=='undefined'){
		
		if(detections[0]['expressions']['happy']>0.75 && document.getElementById('estado').innerHTML!="Adelante"){
			
			document.getElementById('estado').innerHTML="Adelante";
			Reveal.next();

			console.log('Adelante');
			//await promise;
		}else if(detections[0]['expressions']['angry']>0.10 && document.getElementById('estado').innerHTML!="Atras"){
			document.getElementById('estado').innerHTML="Atras";
			Reveal.prev();

			console.log('Atras');
		}else{
			document.getElementById('estado').innerHTML="-";
		}
	}
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
    faceapi.draw.drawDetections(canvas, resizedDetections)
    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
    faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
  }, 750)
})
