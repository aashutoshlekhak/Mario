import { GRAVITY, PLAYER_SPEED } from "../constants/constants";
import { getImage } from "../utils/utils";
import spriteRunLeft from "../../public/Sprites/playerWalkLeft.png";
import spriteRunRight from "../../public/Sprites/playerWalkRight.png";
import spriteStandLeft from "../../public/Sprites/playerStandLeft.png";
import spriteStandRight from "../../public/Sprites/playerStandRight.png";

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
    this.width = 66 * 1.5;
    this.height = 65 * 1.5;
    this.speed = PLAYER_SPEED;
    this.frames = 0;
    this.sprites = {
      stand: {
        cropWidth: 51,
        left: getImage(spriteStandLeft),
        right: getImage(spriteStandRight),
        frames: 9,
        width: 51,
      },
      run: {
        cropWidth: 51,
        left: getImage(spriteRunLeft),
        right: getImage(spriteRunRight),
        frames: 9,
        width: 71,
      },
    };
    this.currentSprite = this.sprites.stand.right;
    this.currentCropWidth = this.sprites.stand.cropWidth;
    this.life = 3;
    this.respawningPeriod = false;
  }

  draw(c: CanvasRenderingContext2D) {
    const gap = 22;
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
      58,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
    c.globalAlpha = 1;
  }

  update(c: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
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
    this.draw(c);
    this.position.y += this.velocity.y;
    this.position.x += this.velocity.x;

    if (this.position.y + this.height + this.velocity.y <= canvas.height) {
      this.velocity.y += GRAVITY;
    }
  }
}
