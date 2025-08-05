import jsQR from "jsqr";
import { useEffect, useRef, useState } from "react";

type CameraCaptureProps = {
  onScan: (qrcode: string) => void;
  enabled: boolean;
};

export default function CameraCapture({ onScan, enabled }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameId = useRef<number | null>(null);
  const scanned = useRef(false);
  const videoStream = useRef<MediaStream | null>(null);
  const isActive = useRef(false);
  const [error, setError] = useState<string | null>(null);

  // Cleanup and stop video immediately when `enabled` changes or on unmount
  useEffect(() => {
    if (!enabled) {
      stopVideoImmediate();
      return;
    }

    startVideo();

    return () => {
      stopVideoImmediate();
    };
  }, [enabled]);

  useEffect(() => {
    return () => {
      stopVideoImmediate();
    };
  }, []);

  const startVideo = async () => {
    try {
      if (isActive.current) return;

      isActive.current = true;
      scanned.current = false;
      setError(null);

      videoStream.current = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });

      if (videoRef.current && isActive.current && enabled) {
        videoRef.current.srcObject = videoStream.current;
        videoRef.current.setAttribute("playsinline", "true");
        videoRef.current.muted = true;

        const playVideo = () => {
          if (!isActive.current || !enabled) return;

          videoRef.current
            ?.play()
            .then(() => {
              if (isActive.current && enabled) {
                tick();
              }
            })
            .catch(err => {
              console.error("Video play failed", err);
              setError("Unable to start video stream");
              isActive.current = false;
            });
        };

        if (videoRef.current.readyState >= 1) {
          playVideo();
        } else {
          videoRef.current.onloadedmetadata = playVideo;
        }
      }
    } catch (err) {
      setError("Cannot access camera");
      console.error(err);
      isActive.current = false;
    }
  };

  const stopVideoImmediate = () => {
    isActive.current = false;

    if (animationFrameId.current !== null) {
      cancelAnimationFrame(animationFrameId.current);
      animationFrameId.current = null;
    }

    if (videoStream.current) {
      videoStream.current.getTracks().forEach(track => {
        track.stop();
        track.enabled = false;
      });
      videoStream.current = null;
    }

    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.srcObject = null;
      videoRef.current.load();

      videoRef.current.onloadedmetadata = null;
      videoRef.current.oncanplay = null;
      videoRef.current.onplay = null;
    }

    if (canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      if (context) {
        context.clearRect(
          0,
          0,
          canvasRef.current.width,
          canvasRef.current.height
        );

        canvasRef.current.width = 1;
        canvasRef.current.height = 1;

        context.clearRect(0, 0, 1, 1);
      }
    }
  };

  const tick = () => {
    if (!isActive.current || scanned.current || !enabled) {
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) {
      if (isActive.current && enabled) {
        animationFrameId.current = requestAnimationFrame(tick);
      }
      return;
    }

    const canvasContext = canvas.getContext("2d", {
      willReadFrequently: true,
    });

    if (
      video.readyState === video.HAVE_ENOUGH_DATA &&
      isActive.current &&
      enabled
    ) {
      try {
        if (
          canvas.width !== video.videoWidth ||
          canvas.height !== video.videoHeight
        ) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
        }

        canvasContext?.drawImage(video, 0, 0, canvas.width, canvas.height);

        const imageData = canvasContext?.getImageData(
          0,
          0,
          canvas.width,
          canvas.height
        );

        if (imageData && isActive.current && enabled) {
          const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: "dontInvert",
          });

          if (code && isActive.current && enabled) {
            scanned.current = true;
            stopVideoImmediate();
            onScan(code.data);
            return;
          }
        }
      } catch (err) {
        console.error("Canvas processing error:", err);
        return;
      }
    }

    if (isActive.current && enabled) {
      animationFrameId.current = requestAnimationFrame(tick);
    }
  };

  return (
    <div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <video ref={videoRef} muted style={{ width: "100%", maxWidth: 400 }} />
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
}
