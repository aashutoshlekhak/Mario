import { getImage } from "../utils/utils";

export class GenericObject {
  position: {
    x: number;
    y: number;
  };
  width: number;
  height: number;
  img: HTMLImageElement;

  constructor({ x, y }: { x: number; y: number }, img: string) {
    this.position = {
      x: x,
      y: y,
    };

    this.img = getImage(img);
    this.width = 200;
    this.height = 20;
    this.img.onload = () => {
      this.width = this.img.width;
      this.height = this.img.height;
    };
  }

  draw(c: CanvasRenderingContext2D) {
    c.drawImage(
      this.img,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }
}
