import { GRAVITY } from "../constants/constants";

export class Gem {
  position: {
    x: number;
    y: number;
  };
  img: HTMLImageElement;
  width: number;
  height: number;
  velocity: {
    x: number;
    y: number;
  };
  loaded!: boolean;

  constructor(
    position: { x: number; y: number },
    velocity: { x: number; y: number },
    imgSrc: string
  ) {
    this.position = {
      x: position.x,
      y: position.y,
    };
    (this.width = 50),
      (this.height = 50),
      (this.velocity = {
        x: velocity.x,
        y: velocity.y,
      });
    this.img = new Image();
    this.img.src = imgSrc;
    this.img.onload = () => {
      this.loaded = true;
    };
  }
  draw(c: CanvasRenderingContext2D) {
    if (this.loaded) {
      c.drawImage(
        this.img,
        this.position.x,
        this.position.y,
        this.width,
        this.height
      );
    }
  }

  update(c: CanvasRenderingContext2D) {
    this.draw(c);
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    if (this.position.y + this.height + this.velocity.y <= c.canvas.height) {
      this.velocity.y += GRAVITY;
    }
    
  }
}
