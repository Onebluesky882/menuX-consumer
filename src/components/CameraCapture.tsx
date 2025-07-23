import React, { useEffect, useRef, useState } from "react";
import jsQR from "jsqr";

export default function JsQRScanner({
  onScan,
}: {
  onScan: (qrcode: string) => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string | null>(null);
  const animationFrameId = useRef<number | null>(null);
  const scanned = useRef(false); // Track if scanning is done
  const videoStream = useRef<MediaStream | null>(null);

  useEffect(() => {
    async function startVideo() {
      try {
        videoStream.current = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });
        if (videoRef.current) {
          videoRef.current.srcObject = videoStream.current;
          videoRef.current.setAttribute("playsinline", "true"); // iOS
          videoRef.current.muted = true; // Help autoplay policy

          const playVideo = () => {
            videoRef.current
              ?.play()
              .then(() => {
                animationFrameId.current = requestAnimationFrame(tick);
              })
              .catch((err) => {
                console.error("video play failed", err);
                setError("Unable to start video stream");
              });
          };

          if (videoRef.current.readyState >= 1) {
            // Metadata already loaded
            playVideo();
          } else {
            videoRef.current.onloadedmetadata = playVideo;
          }
        }
      } catch (err) {
        setError("Cannot access camera");
        console.error(err);
      }
    }

    const tick = () => {
      if (scanned.current) {
        // Stop scanning if already scanned
        if (animationFrameId.current !== null) {
          cancelAnimationFrame(animationFrameId.current);
          animationFrameId.current = null;
        }
        if (videoStream.current) {
          videoStream.current.getTracks().forEach((track) => track.stop());
          videoStream.current = null;
        }
        return;
      }

      if (!videoRef.current || !canvasRef.current) {
        animationFrameId.current = requestAnimationFrame(tick);
        return;
      }

      const video = videoRef.current;
      const canvas = canvasRef.current;
      const canvasContext = canvas.getContext("2d", {
        willReadFrequently: true,
      });

      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        canvasContext?.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = canvasContext?.getImageData(
          0,
          0,
          canvas.width,
          canvas.height
        );

        if (imageData) {
          const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: "dontInvert",
          });

          if (code) {
            scanned.current = true; // Mark as scanned
            onScan(code.data);
            return; // Stop ticking and scanning
          }
        }
      }

      animationFrameId.current = requestAnimationFrame(tick);
    };

    startVideo();

    return () => {
      if (animationFrameId.current !== null) {
        cancelAnimationFrame(animationFrameId.current);
      }
      if (videoStream.current) {
        videoStream.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [onScan]);

  return (
    <div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <video ref={videoRef} muted style={{ width: "100%", maxWidth: 400 }} />
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
}
