import jsQR from "jsqr";

// ✅ Optimized QR decoder with performance improvements
export const decodeQR = (file: File): Promise<string | null> => {
  return new Promise(resolve => {
    const image = new Image();

    // ✅ Clean up URL when done
    const cleanup = () => {
      URL.revokeObjectURL(image.src);
    };

    image.onload = () => {
      try {
        // ✅ Use requestAnimationFrame to avoid blocking the main thread
        requestAnimationFrame(() => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          if (!ctx) {
            cleanup();
            resolve(null);
            return;
          }

          // ✅ Optimize image size for faster processing
          const maxSize = 1000; // Maximum width/height
          let { width, height } = image;

          // Scale down large images to improve performance
          if (width > maxSize || height > maxSize) {
            const ratio = Math.min(maxSize / width, maxSize / height);
            width = Math.floor(width * ratio);
            height = Math.floor(height * ratio);
          }

          canvas.width = width;
          canvas.height = height;

          // ✅ Draw image with optimized settings
          ctx.imageSmoothingEnabled = false; // Faster for QR codes
          ctx.drawImage(image, 0, 0, width, height);

          try {
            const imageData = ctx.getImageData(0, 0, width, height);

            // ✅ Use setTimeout to yield control back to browser
            setTimeout(() => {
              try {
                // ✅ Optimize jsQR options for better performance
                const code = jsQR(imageData.data, width, height, {
                  inversionAttempts: "dontInvert", // Skip inversion for speed
                });

                cleanup();
                resolve(code ? code.data : null);
              } catch (error) {
                console.error("QR decoding error:", error);
                cleanup();
                resolve(null);
              }
            }, 0);
          } catch (error) {
            console.error("Canvas error:", error);
            cleanup();
            resolve(null);
          }
        });
      } catch (error) {
        console.error("Image processing error:", error);
        cleanup();
        resolve(null);
      }
    };

    image.onerror = () => {
      cleanup();
      resolve(null);
    };

    // ✅ Add timeout to prevent hanging
    setTimeout(() => {
      if (image.complete === false) {
        cleanup();
        resolve(null);
      }
    }, 15000); // 10 second timeout

    image.src = URL.createObjectURL(file);
  });
};

// ✅ Alternative: Web Worker version for heavy processing (optional)
export const decodeQRWithWorker = (file: File): Promise<string | null> => {
  return new Promise(resolve => {
    // Check if Web Workers are supported
    if (typeof Worker === "undefined") {
      // Fallback to main thread
      return decodeQR(file).then(resolve);
    }

    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        URL.revokeObjectURL(image.src);
        resolve(null);
        return;
      }

      // Optimize size
      const maxSize = 800;
      let { width, height } = image;

      if (width > maxSize || height > maxSize) {
        const ratio = Math.min(maxSize / width, maxSize / height);
        width = Math.floor(width * ratio);
        height = Math.floor(height * ratio);
      }

      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(image, 0, 0, width, height);

      const imageData = ctx.getImageData(0, 0, width, height);

      // Create inline worker for QR processing
      const workerCode = `
        importScripts('https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.min.js');
        
        self.onmessage = function(e) {
          const { data, width, height } = e.data;
          try {
            const code = jsQR(data, width, height, {
              inversionAttempts: "dontInvert"
            });
            self.postMessage({ success: true, data: code ? code.data : null });
          } catch (error) {
            self.postMessage({ success: false, error: error.message });
          }
        };
      `;

      const blob = new Blob([workerCode], { type: "application/javascript" });
      const worker = new Worker(URL.createObjectURL(blob));

      worker.onmessage = e => {
        const { success, data, error } = e.data;
        worker.terminate();
        URL.revokeObjectURL(image.src);

        if (success) {
          resolve(data);
        } else {
          console.error("Worker QR decoding error:", error);
          resolve(null);
        }
      };

      worker.onerror = () => {
        worker.terminate();
        URL.revokeObjectURL(image.src);
        resolve(null);
      };

      // Send data to worker
      worker.postMessage({
        data: imageData.data,
        width: width,
        height: height,
      });
    };

    image.onerror = () => {
      URL.revokeObjectURL(image.src);
      resolve(null);
    };

    image.src = URL.createObjectURL(file);
  });
};

// ✅ Simple debounced version for frequent calls
let decodeTimeout: NodeJS.Timeout | null = null;

export const decodeQRDebounced = (
  file: File,
  delay: number = 300
): Promise<string | null> => {
  return new Promise(resolve => {
    if (decodeTimeout) {
      clearTimeout(decodeTimeout);
    }

    decodeTimeout = setTimeout(() => {
      decodeQR(file).then(resolve);
    }, delay);
  });
};
