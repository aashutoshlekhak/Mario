import { GRAVITY } from "../constants/constants";
import scorpioWalkLeft from "../../public/mySprites/scorpioWalkLeft.png";
import { getImage } from "../utils/utils";

export class WaterEnemy {
  position: {
    x: number;
    y: number;
  };
  velocity: {
    x: number;
    y: number;
  };
  width: number;
  height: number;
  velocityY: number;
  sprite: HTMLImageElement;
  currentSprite: HTMLImageElement;
  currentFrameIndex: number;
  frameCounter: number;
  totalFrames: number;
  bottomLimit: number;

  constructor(
    {
      position,
      velocity,
    }: {
      position: { x: number; y: number };
      velocity: { x: number; y: number };
    },
    velocityY: number,
    bottomLimit: number
  ) {
    this.position = {
      x: position.x,
      y: position.y,
    };
    this.velocity = {
      x: velocity.x,
      y: velocity.y,
    };
    this.velocityY = velocityY;
    this.width = 70;
    this.height = 50;
    this.bottomLimit = bottomLimit;
    this.sprite = getImage(scorpioWalkLeft);
    this.currentSprite = this.sprite;
    this.currentFrameIndex = 0;
    this.frameCounter = 0;
    this.totalFrames = 4;
  }

  draw(c: CanvasRenderingContext2D) {
    const frameX = 4.4 + 48 * this.currentFrameIndex;
    c.drawImage(
      this.currentSprite,
      frameX,
      17,
      40,
      30,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }

  update(c: CanvasRenderingContext2D) {
    this.frameCounter++;
    if (this.frameCounter % 5 === 0) {
      this.currentFrameIndex++;

      if (this.currentFrameIndex >= this.totalFrames) {
        this.currentFrameIndex = 0;
      }
    }
    this.draw(c);
    this.velocity.y += GRAVITY*0.5;
    this.position.y += this.velocity.y;

    if (this.position.y + this.height - c.canvas.height >= this.bottomLimit) {
      setTimeout(() => {
        this.velocity.y = this.velocityY;
      }, 500);
    }
  }
}
