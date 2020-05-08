<template>
  <v-container fill-height class="d-flex justiy-center">
    <div id="container">
      <video id="video" width="720" height="560" autoplay muted></video>
    </div>
  </v-container>
</template>

<script>
import * as faceapi from "face-api.js";

export default {
  name: "FacialRecognitionLogin",
  async mounted() {
    const video = document.getElementById("video");

    Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
      faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
      faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
      faceapi.nets.faceExpressionNet.loadFromUri("/models")
    ]).then(startVideo);

    function startVideo() {
      navigator.getUserMedia(
        { video: {} },
        stream => (video.srcObject = stream),
        err => console.error(err)
      );
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
  }
};
</script>

<style scoped>
#container {
  margin: auto;
  position: relative;
}
</style>