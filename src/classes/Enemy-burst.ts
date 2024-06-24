import { GRAVITY } from "../constants/constants";

export class Burst {
  position: {
    x: number;
    y: number;
  };
  radius: number;
  velocity: {
    x: number;
    y: number;
  };
  


  constructor(
    position: { x: number; y: number },
    velocity: { x: number; y: number },
    radius: number
  ) {
    this.position = {
      x: position.x,
      y: position.y,
    }
    this.velocity = {
      x: velocity.x,
      y: velocity.y,
    };
    this.radius = radius;  
  }

  draw(c: CanvasRenderingContext2D) {
    c.beginPath();
    c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = "red";
    c.fill();
    c.closePath();
  }

  update(c: CanvasRenderingContext2D) {
    this.draw(c);
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    if (this.position.y + this.radius + this.velocity.y <= c.canvas.height) {
      this.velocity.y += GRAVITY*0.1;
    }
  }
}
