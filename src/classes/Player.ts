import { GRAVITY, PLAYER_SPEED } from "../constants/constants";
import { getImage } from "../utils/utils";
import spriteRunLeft from "../../public/mySprites/playerRunLeft.png";
import spriteRunRight from "../../public/mySprites/playerRunRight.png";
import spriteStandLeft from "../../public/mySprites/playerStandLeft.png";
import spriteStandRight from "../../public/mySprites/playerStandRight.png";

export class Player {
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
  speed: number;
  frames: number;
  frameCounter: number; // Counter to control animation speed

  sprites: {
    stand: {
      cropWidth: number;
      left: HTMLImageElement;
      right: HTMLImageElement;
      frames: number;
      width: number;
    };
    run: {
      cropWidth: number;
      left: HTMLImageElement;
      right: HTMLImageElement;
      frames: number;
      width: number;
    };
  };
  currentSprite: HTMLImageElement;
  currentCropWidth: number;
  life: number;
  respawningPeriod: boolean;
  opacity: number = 1;

  constructor() {
    this.position = {
      x: 200,
      y: 100,
    };
    this.velocity = {
      x: 0,
      y: 1,
    };
    this.width = 80.125; // Player width in sprite 641 divided by 10
    this.height = 67.75;
    this.speed = PLAYER_SPEED;
    this.frames = 0;
    this.frameCounter = 0; // Initialize the frame counter
    this.sprites = {
      stand: {
        cropWidth: 641,
        left: getImage(spriteStandLeft),
        right: getImage(spriteStandRight),
        frames: 10,
        width: 66,
      },
      run: {
        cropWidth: 641,
        left: getImage(spriteRunLeft),
        right: getImage(spriteRunRight),
        frames: 8,
        width: 66,
      },
    };
    this.currentSprite = this.sprites.stand.right;
    this.currentCropWidth = this.sprites.stand.cropWidth;
    this.life = 100;
    this.respawningPeriod = false;
  }

  draw(c: CanvasRenderingContext2D) {
    const gap = 80;
    const frameX = this.frames * (this.currentCropWidth + gap);
    if (this.respawningPeriod) {
      this.opacity == 1 ? (this.opacity = 0) : (this.opacity = 1);
      c.globalAlpha = this.opacity;
    } else {
      this.opacity = 1;
      c.globalAlpha = this.opacity;
    }
    c.drawImage(
      this.currentSprite,
      frameX,
      0,
      this.currentCropWidth,
      500,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
    c.globalAlpha = 1;
  }

  update(c: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
    this.frameCounter++; // Increment the frame counter

    if (this.frameCounter % 3 === 0) {
      // Update the frame every 6th call
      this.frames++;
      if (
        this.frames >= this.sprites.stand.frames &&
        (this.currentSprite === this.sprites.stand.right ||
          this.currentSprite === this.sprites.stand.left)
      ) {
        this.frames = 0;
      } else if (
        this.frames >= this.sprites.run.frames &&
        (this.currentSprite === this.sprites.run.right ||
          this.currentSprite === this.sprites.run.left)
      ) {
        this.frames = 0;
      }
    }

    this.draw(c);
    this.position.y += this.velocity.y;
    this.position.x += this.velocity.x;

    if (this.position.y + this.height + this.velocity.y <= canvas.height) {
      this.velocity.y += GRAVITY;
    }
  }
}
