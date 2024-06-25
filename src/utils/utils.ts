import { Enemy } from "../classes/Enemy";
import { Platform } from "../classes/Platform";
import { Player } from "../classes/Player";
import { WaterEnemy } from "../classes/WaterEnemy";
import { Block } from "../classes/blockPlatform";
import { Bullet } from "../classes/bullet";

export function getImage(img: string) {
  const image = new Image();
  image.src = img;
  return image;
}

export function getImageAsync(img: string): Promise<HTMLImageElement> {
  return new Promise((resolve) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.src = img;
  });
}

//rectangular platform collision detection with object. to place the object on top of platform
export function isObjectAbovePlatform(obj: any, platform: Platform) {
  return (
    obj.position.y + obj.height <= platform.position.y &&
    obj.position.y + obj.height + obj.velocity.y >= platform.position.y &&
    obj.position.x + obj.width >= platform.position.x &&
    obj.position.x <= platform.position.x + platform.width
  );
}

//circular collision detection with platform
export function isCircleAbovePlatform(obj: any, platform: Platform) {
  return (
    obj.position.y + obj.radius <= platform.position.y &&
    obj.position.y + obj.radius + obj.velocity.y >= platform.position.y &&
    obj.position.x + obj.radius >= platform.position.x &&
    obj.position.x <= platform.position.x + platform.width
  );
}

export function playerOnTopEnemy(player: Player, enemy: Enemy) {
  return (
    player.position.y + player.height <= enemy.position.y &&
    player.position.y + player.height + player.velocity.y >= enemy.position.y &&
    player.position.x + player.width >= enemy.position.x &&
    player.position.x <= enemy.position.x + enemy.width
  );
}

export function playerOnSideEnemy(player: Player, enemy: Enemy|WaterEnemy) {
  return (
    player.position.x + player.width >= enemy.position.x &&
    player.position.x <= enemy.position.x + enemy.width &&
    player.position.y + player.height > enemy.position.y &&
    player.position.y < enemy.position.y + enemy.height
  );
}

export function hittintBlockBottom(player: Player, platform: Block): boolean {
  const playerLeft = player.position.x;
  const playerRight = player.position.x + player.width;
  const playerTop = player.position.y;
  const playerNextTop = player.position.y + player.velocity.y;

  const platformLeft = platform.position.x;
  const platformRight = platform.position.x + platform.width;
  const platformBottom = platform.position.y + platform.height;
  const platformTop = platform.position.y;

  const isHorizontallyAligned =
    playerLeft < platformRight && playerRight > platformLeft;

  return (
    isHorizontallyAligned &&
    playerNextTop <= platformBottom &&
    player.velocity.y < 0 &&
    !(playerTop < platformTop)
  );
}

export function hittingBlockSides(player: Player, platform: Block): boolean {
  const playerTop = player.position.y;
  const playerBottom = player.position.y + player.height;
  const playerNextLeft = player.position.x + player.velocity.x;
  const playerNextRight = player.position.x + player.width + player.velocity.x;
  const platformTop = platform.position.y;
  const platformLeft = platform.position.x;
  const platformRight = platform.position.x + platform.width;
  const platformBottom = platform.position.y + platform.height;

  const isVerticallyAligned =
    playerBottom > platformTop && playerTop < platformBottom;

  return (
    isVerticallyAligned &&
    playerNextRight > platformLeft &&
    playerNextLeft < platformRight
  );
}

export function rectangularCollisionDetection(obj1: any, obj2: any) {
  return (
    obj1.position.x < obj2.position.x + obj2.width &&
    obj1.position.x + obj1.width > obj2.position.x &&
    obj1.position.y < obj2.position.y + obj2.height &&
    obj1.position.y + obj1.height > obj2.position.y
  );
}

export function bulletEnemyCollision(bullet: Bullet, enemy: Enemy) {
  const bulletNextLeft = bullet.position.x - bullet.radius + bullet.velocity.x;
  const bulletNextRight = bullet.position.x + bullet.radius + bullet.velocity.x;
  const bulletTop = bullet.position.y - bullet.radius;
  const bulletBottom = bullet.position.y + bullet.radius;

  const enemyNextLeft = enemy.position.x + enemy.velocity.x;
  const enemyNextRight = enemy.position.x + enemy.width + enemy.velocity.x;
  const enemyTop = enemy.position.y;
  const enemyBottom = enemy.position.y + enemy.height;

  const isVerticallyAligned =
    bulletBottom > enemyTop && bulletTop < enemyBottom;

  const isHorizontallyAligned =
    bulletNextLeft < enemyNextRight && bulletNextRight > enemyNextLeft;

  return isHorizontallyAligned && isVerticallyAligned;
}
