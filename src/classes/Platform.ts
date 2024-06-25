import { getImage } from "../utils/utils";

export class Platform {
  position: {
    x: number;
    y: number;
  };
  width: number;
  height: number;
  img: HTMLImageElement;
  distance?: number;

  constructor(
    { x, y }: { x: number; y: number },
    img: string,
    width?: number,
    height?: number,
    distance?: number
  ) {
    this.position = {
      x: x,
      y: y,
    };

    this.img = getImage(img);
    this.width = width || 200;
    this.height = height || 20;
    this.distance = distance;
    this.img.onload = () => {
      if (!width) this.width = this.img.width;
      if (!height) this.height = this.img.height;
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

    if (this.distance !== undefined) {
      c.font = "30px serif";
      c.fillStyle = "red";
      c.fillText(`${this.distance}`, this.position.x, this.position.y - 10); // Adjusted position for better visibility
    }
  }
}
