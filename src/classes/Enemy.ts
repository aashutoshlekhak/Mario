import { GRAVITY } from "../constants/constants";

export class Enemy {
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
  distance: {
    limit: number;
    travelled: number;
  };
  bulletLimit: number;

  constructor({
    position,
    velocity,
  }: {
    position: { x: number; y: number }; //yo position ko
    velocity: { x: number; y: number };
  }, distance = {
    limit: 150,
    travelled: 0,
  }) {
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

    this.distance = distance;
    this.bulletLimit = 10;
  }
  draw(c: CanvasRenderingContext2D) {
    c.fillStyle = "red";
    c.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
  update(c: CanvasRenderingContext2D) {
    this.draw(c);
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    if (this.position.y + this.height + this.velocity.y <= c.canvas.height) {
      this.velocity.y += GRAVITY;
    }

    //to move back and forth the enemy

    if (this.distance.travelled > this.distance.limit) {
      this.velocity.x *= -1;
      this.distance.travelled = 0;
    } else {
      this.distance.travelled += Math.abs(this.velocity.x);
    }
  }
}
