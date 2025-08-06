import jsQR from "jsqr";

export const decodeQR = (file: File): Promise<string | null> => {
  return new Promise(async resolve => {
    try {
      const bitmap = await createImageBitmap(file);
      const maxSize = 1000;
      const { width, height } = resizeImage(
        bitmap.width,
        bitmap.height,
        maxSize
      );

      const canvas = new OffscreenCanvas(width, height);
      const ctx = canvas.getContext("2d");

      if (!ctx) return resolve(null);

      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(bitmap, 0, 0, width, height);

      const imageData = ctx.getImageData(0, 0, width, height);

      setTimeout(() => {
        try {
          const code = jsQR(imageData.data, width, height, {
            inversionAttempts: "dontInvert",
          });
          resolve(code?.data ?? null);
        } catch (error) {
          console.error("QR decode error:", error);
          resolve(null);
        }
      }, 0);
    } catch (err) {
      console.error("Image load error:", err);
      resolve(null);
    }
  });
};

const resizeImage = (width: number, height: number, max: number) => {
  if (width <= max && height <= max) return { width, height };
  const ratio = width > height ? max / width : max / height;
  return {
    width: Math.floor(width * ratio),
    height: Math.floor(height * ratio),
  };
};
