export async function compressImage(file: File, maxWidth = 1080, quality = 0.75): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const scale = Math.min(1, maxWidth / img.width);
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(
        blob => (blob ? resolve(blob) : reject(new Error("compression failed"))),
        "image/jpeg",
        quality
      );
    };
    img.onerror = reject;
    img.src = url;
  });
}
