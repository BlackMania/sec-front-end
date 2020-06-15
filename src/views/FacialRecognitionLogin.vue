<template>
  <v-container fill-height class="d-flex justiy-center">
    <div id="container">
      <video id="video" width="720" height="560" autoplay muted></video>
    </div>
  </v-container>
</template>

<script>
import * as faceapi from "face-api.js";
import axios from 'axios';

export default {
  name: "FacialRecognitionLogin",
  data() {
    return {
      api: null
    }
  },
  created() {
    this.api = axios.create({
      url: 'http://172.16.1.2:8080'
    })
  },
  async mounted() {
    const self = this;
    const video = document.getElementById("video");

    Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
      faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
      faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
      faceapi.nets.faceExpressionNet.loadFromUri("/models")
    ]).then(startVideo);

    function startVideo() {
      var facingMode = "user"; // Can be 'user' or 'environment' to access back or front camera (NEAT!)
      var constraints = {
        audio: false,
        video: {
        facingMode: facingMode
        }
      };
      
        navigator.mediaDevices.getUserMedia(constraints).then(function success(stream) {
        video.srcObject = stream;
      });
    }

    video.addEventListener("play", () => {
      const canvas = faceapi.createCanvasFromMedia(video);
      const container = document.getElementById("container");
      canvas.style.position = "absolute";
      canvas.style.top = 0;
      canvas.style.left = 0;

      container.append(canvas);
      const displaySize = { width: video.width, height: video.height };
      faceapi.matchDimensions(canvas, displaySize);
      setInterval(async () => {
        const detections = await faceapi
          .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks();
        const resizedDetections = faceapi.resizeResults(
          detections,
          displaySize
        );
        canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
        faceapi.draw.drawDetections(canvas, resizedDetections);
        faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
      }, 5);
    });

    setTimeout(function() {
      const imgCanvas = document.createElement("canvas");
      imgCanvas.width = video.videoWidth;
      imgCanvas.height = video.videoHeight;
      imgCanvas.getContext('2d').drawImage(video, 0, 0, imgCanvas.width, imgCanvas.height);
      const dataURL = imgCanvas.toDataURL('image/jpeg', 0.5);
      window.console.log(self.dataURItoBlob(dataURL))
      var fd = new FormData(document.forms[0]);
      fd.append("file", self.dataURItoBlob(dataURL), "photo.jpg");
      self.api.post("https://192.168.33.13:8082/auth/login", fd, {
        headers: {
          'Content-Type': "multipart/form-data"
        }
      })
      .then(response => {
        document.getElementById("container").removeChild(document.getElementById("video"));
        document.getElementById("container").removeChild(document.getElementsByTagName("canvas")[0]);
        let div = document.createElement("div");
        div.innerHTML = "Welcome " + response.data;
        alert(div);
        document.getElementById("container").append(div);

        console.log(response)
      })
      .catch(error => {
        console.log(error);
      })
    }, 15000)
  },
  methods: {
    dataURItoBlob: function(dataURI) {
        var byteString;
        if (dataURI.split(',')[0].indexOf('base64') >= 0)
            byteString = atob(dataURI.split(',')[1]);
        else
            byteString = unescape(dataURI.split(',')[1]);
        var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
        var ia = new Uint8Array(byteString.length);
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }

        return new Blob([ia], {type:mimeString});
    }
  }
};
</script>

<style scoped>
#container {
  margin: auto;
  position: relative;
}
</style>