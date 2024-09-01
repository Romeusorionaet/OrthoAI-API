import sharp from "sharp";

export function preprocessImage(fileBuffer: Buffer): Promise<Buffer> {
  return sharp(fileBuffer)
    .resize(1200)
    .grayscale()
    .normalize()
    .threshold(128)
    .modulate({ brightness: 1.2, saturation: 1.0, lightness: 0.9 })
    .toBuffer();
}
