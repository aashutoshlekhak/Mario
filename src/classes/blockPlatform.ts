import { Platform } from "./Platform";

export class Block extends Platform {
  constructor(
    { x, y }: { x: number; y: number },
    img: string,
    width: number,
    height: number
  ) {
    super({ x, y }, img, width, height);
  }

  draw(context: CanvasRenderingContext2D) {
    context.drawImage(
      this.img,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }
}
