import { Position, Velocity } from "../types/types";

export class Base {
  position: Position;
  width: number;
  height: number;
  velocity?: Velocity;
  img?: HTMLImageElement;

  constructor(
    position: Position,
    width: number,
    height: number,
    velocity?: Velocity,
    imgSrc?: string
  ) {
    this.position = position;
    this.width = width;
    this.height = height;
    if (velocity) {
      this.velocity = velocity;
    }
    if (imgSrc) {
      this.img = new Image();
      this.img.src = imgSrc;
      this.img.onload = () => {
        this.width = this.img!.width;
        this.height = this.img!.height;
      };
    }
  }

  draw(context: CanvasRenderingContext2D) {
    if (this.img) {
      context.drawImage(
        this.img,
        this.position.x,
        this.position.y,
        this.width,
        this.height
      );
    }
  }

  update(
    context: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    gravity: number
  ) {
    this.draw(context);
    if (this.velocity) {
      this.position.x += this.velocity.x;
      this.position.y += this.velocity.y;

      if (this.position.y + this.height + this.velocity.y <= canvas.height) {
        this.velocity.y += gravity;
      }
    }
  }
}
