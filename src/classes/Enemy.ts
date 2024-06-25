import { GRAVITY } from "../constants/constants";
import scorpioWalkLeft from "../../public/mySprites/scorpioWalkLeft.png";
import scorpioWalkRight from "../../public/mySprites/scorpioWalkRight.png";
import { getImage } from "../utils/utils";

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

  sprites: {
    left: HTMLImageElement;
    right: HTMLImageElement;
  };

  currentSprite: HTMLImageElement;
  currentFrameIndex: number;
  frameCounter: number;
  totalFrames: number;

  constructor(
    {
      position,
      velocity,
    }: {
      position: { x: number; y: number }; 
      velocity: { x: number; y: number };
    },
    distance = {
      limit: 150,
      travelled: 0,
    }
  ) {
    this.position = {
      x: position.x,
      y: position.y,
    };
    (this.width = 70),
      (this.height = 50),
      (this.velocity = {
        x: velocity.x,
        y: velocity.y,
      });

    this.sprites = {
      left: getImage(scorpioWalkLeft),
      right: getImage(scorpioWalkRight),
    };
    this.currentSprite = this.sprites.left;
    this.currentFrameIndex = 0; //0,1,2,3
    this.frameCounter = 0; //increasing continuously
    this.totalFrames = 4;
    this.distance = distance;
    this.bulletLimit = 10;
  }
  draw(c: CanvasRenderingContext2D) {
    //top left position on the sprite sheet
    const frameX = 4.4 + 48 * this.currentFrameIndex;
    c.drawImage(
      this.currentSprite,
      frameX,
      17,
      40, // Width of each frame
      30, // Height of sprite sheet
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
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    if (this.position.y + this.height + this.velocity.y <= c.canvas.height) {
      this.velocity.y += GRAVITY;
    }

    if (this.distance.travelled > this.distance.limit) {
      this.velocity.x *= -1;
      this.currentSprite =
        this.velocity.x < 0 ? this.sprites.left : this.sprites.right;
      this.distance.travelled = 0;
    } else {
      this.distance.travelled += Math.abs(this.velocity.x);
    }
  }
}
