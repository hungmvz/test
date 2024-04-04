import { useCallback, useEffect, useState } from "react";
import OTPInput from "./OTPInput/OTPInput";

var vendors = ["ms", "moz", "webkit", "o"];

// const requestAnimation = window.requestAnimationFrame ||
//   window.mozRequestAnimationFrame ||
//   window.webkitRequestAnimationFrame ||
//   window.msRequestAnimationFrame;

const requestAnimation = (cb) => {
  return setTimeout(() => {
    cb();
  }, 1000 / 60);
};

const cancelAnimation =
  window.cancelAnimationFrame || window.mozCancelAnimationFrame;

const App = () => {
  const [otp, setOTP] = useState("");

  const createFrame = useCallback(async () => {
    // get media devices
    const mediaStream = await navigator.mediaDevices.getUserMedia({
      video: {
        width: 600,
        height: 600,
        facingMode: "environment",
        aspectRatio: 1,
      },
      audio: false,
    });

    const video = document.createElement("video");
    video.autoplay = true;
    video.srcObject = mediaStream;
    
    const tick = () => {
      const canvas = document.getElementById("main-canvas");
      canvas.width = 600;
      canvas.height = 600;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, 600, 600);
      requestAnimation(tick);
    };
    requestAnimation(tick);
  }, []);

  useEffect(() => {
    createFrame();
  }, []);

  return (
    <div>
      <canvas width={'100%'} height={'100%'} id="main-canvas" />
      <div>Version 22</div>
      <div>Request animation: {requestAnimation ? 'available' : 'unavailable'}</div>
    </div>
  );
};

export default App;
