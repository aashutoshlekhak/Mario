import { GRAVITY } from "../constants/constants";

export default class Player {
  position: {
    x: number;
    y: number;
  };
  width: number;
  height: number;
  velocity: {
    x: number;
    y: number;
  };
  constructor() {
    this.position = {
      x: 200,
      y: 100,
    };
    this.velocity = {
      x: 0,
      y: 1,
    };
    this.width = 32;
    this.height = 32;
  }
  draw(c: CanvasRenderingContext2D) {
    c.fillStyle = "red";
    c.fillRect(this.position.x, this.position.y, this.width, this.height);
  }

  update(c: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
    this.draw(c);
    this.position.y += this.velocity.y;
    this.position.x += this.velocity.x;

    if (this.position.y + this.height + this.velocity.y <= canvas.height) {
      this.velocity.y += GRAVITY;
    } else this.velocity.y = 0;
  }
}
