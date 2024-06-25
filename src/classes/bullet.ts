
import { Position, Velocity } from "../types/types";

export class Bullet {
  position: Position;
  radius: number;
  velocity: Velocity
  range: number;
  distanceTravelled: number;

  constructor(
    position: { x: number; y: number },
    velocity: { x: number; y: number },
    radius: number
  ) {
    this.position = {
      x: position.x,
      y: position.y,
    };
    this.velocity = {
      x: velocity.x,
      y: velocity.y,
    };
    this.radius = radius;
    this.range = 500;
    this.distanceTravelled=0;
  }

  draw(c: CanvasRenderingContext2D) {
    c.beginPath();
    c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = "yellow";
    c.fill();
    c.closePath();
  }

  update(c: CanvasRenderingContext2D) {
    this.draw(c);
    this.position.x += this.velocity.x;
    this.distanceTravelled += this.velocity.x;
    this.position.y += this.velocity.y;
  }
}
