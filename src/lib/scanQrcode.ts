import jsQR from "jsqr";

export const decodeQR = (file: File): Promise<string | null> => {
  return new Promise((resolve) => {
    const image = new Image();
    image.src = URL.createObjectURL(file);

    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = image.width;
      canvas.height = image.height;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        URL.revokeObjectURL(image.src);
        resolve(null);
        return;
      }
      ctx?.drawImage(image, 0, 0);

      const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height);

      if (!imageData) return;
      const code = jsQR(imageData.data, canvas.width, canvas.height);

      if (code) {
        resolve(code.data);
      } else {
        resolve(null);
      }
    };
    image.onerror = () => {
      URL.revokeObjectURL(image.src);
      resolve(null);
    };
  });
};
