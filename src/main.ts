import {
  BACKGROUND_PARALLAX_RATIO,
  CLOUDS_PARALLAX_RATIO,
  HILLS_HEIGHT,
  LARGE_GAP,
  PLATFORM_LARGE_DIMENSION,
  PLATFORM_LARGE_TALL_DIMENSION,
  PLATFORM_MEDIUM_DIMENSION,
  PLATFORM_SMALL_DIMENSION,
  PLATFORM_SMALL_TALL_DIMENSION,
  SMALL_GAP,
} from "./constants/constants";
import platform from "../public/Sprites/platform.png";
import platformSmall from "../public/Sprites/platformS.png";
import platformMedium from "../public/Sprites/platformM.png";
import platformLarge from "../public/Sprites/platformL.png";
import platformSmallTall from "../public/Sprites/platformSmallTall.png";
import platformLargeTall from "../public/Sprites/platformLargeTall.png";

import hills from "../public/Sprites/hills1.png";
import clouds1 from "../public/Sprites/clouds1.png";
import background from "../public/Sprites/backgroundYellow.png";
import block from "../public/mySprites/singleBlock.png";
import block3 from "../public/mySprites/trioBlock.png";
import gem from "../public/mySprites/gemFlower.png";
import flag from "../public/mySprites/flag.png";

import {
  bulletEnemyCollision,
  getImage,
  hittingBlockSides,
  hittintBlockBottom,
  isCircleAbovePlatform,
  isObjectAbovePlatform,
  playerOnSideEnemy,
  playerOnTopEnemy,
  rectangularCollisionDetection,
} from "./utils/utils";
// import { GenericObject } from "./classes/Generic-object";
import { Player } from "./classes/Player";
import { Platform } from "./classes/Platform";
import { Enemy } from "./classes/Enemy";
import { GenericObject } from "./classes/generic-object";
import { Burst } from "./classes/Enemy-burst";
import { Block } from "./classes/blockPlatform";
import { Gem } from "./classes/Gem";
import { Bullet } from "./classes/bullet";
import { DisplayElement } from "./classes/Stats";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const c = canvas.getContext("2d") as CanvasRenderingContext2D;
canvas.width = 1024;
canvas.height = 576;

let genericObjects: GenericObject[] = [];

let player = new Player();
let platforms: Platform[] = [];
let ememies: Enemy[] = [];
let enemyBursts: Burst[] = [];
let blocks: Block[] = [];
let lastKey: string;
let gems: Gem[] = [];
let bullets: Bullet[] = [];
let Flag = new GenericObject({ x: 5385, y: 0 }, flag, 0);
let stats = new DisplayElement({ x: 10, y: 10 }, 0, 0);
let keys = {
  right: {
    pressed: false,
  },
  left: {
    pressed: false,
  },
  space: {
    pressed: false,
  },
};
let scrollOffset = 0;

async function init() {
  /*
  Map Abbrebiations
  p-platform 
  g-gap
  s-small
  m-medium
  l-large
  st-smallTall
  lt-largeTall
  */
  const gameMapPlatforms = [
    "pl",
    "gs",
    "pm",
    "gl",
    "pst",
    "gs",
    "plt",
    "gs",
    "pst",
    "gs",
    "pst",
    "gl",
    "plt",
    "gs",
    "pl",
  ];

  let platformWidthCounter = 0;
  platforms = [];
  Flag.position.x = 5385;
  gameMapPlatforms.forEach((Abbrebiation) => {
    switch (Abbrebiation) {
      case "ps": {
        platforms.push(
          new Platform(
            {
              x: platformWidthCounter,
              y: canvas.height - PLATFORM_SMALL_DIMENSION.height,
            },
            platformSmall,
            PLATFORM_SMALL_DIMENSION.width,
            PLATFORM_SMALL_DIMENSION.height,
            platformWidthCounter
          )
        );
        platformWidthCounter += PLATFORM_SMALL_DIMENSION.width;
        break;
      }
      case "pm": {
        platforms.push(
          new Platform(
            {
              x: platformWidthCounter,
              y: canvas.height - PLATFORM_MEDIUM_DIMENSION.height,
            },
            platformMedium,
            PLATFORM_MEDIUM_DIMENSION.width,
            PLATFORM_MEDIUM_DIMENSION.height,
            platformWidthCounter
          )
        );
        platformWidthCounter += PLATFORM_MEDIUM_DIMENSION.width;
        break;
      }
      case "pl": {
        platforms.push(
          new Platform(
            {
              x: platformWidthCounter,
              y: canvas.height - PLATFORM_LARGE_DIMENSION.height,
            },
            platformLarge,
            PLATFORM_LARGE_DIMENSION.width,
            PLATFORM_LARGE_DIMENSION.height,
            platformWidthCounter
          )
        );
        platformWidthCounter += PLATFORM_LARGE_DIMENSION.width;
        break;
      }
      case "pst": {
        platforms.push(
          new Platform(
            {
              x: platformWidthCounter,
              y: canvas.height - PLATFORM_SMALL_TALL_DIMENSION.height,
            },
            platformSmallTall,
            PLATFORM_SMALL_TALL_DIMENSION.width,
            PLATFORM_SMALL_TALL_DIMENSION.height,
            platformWidthCounter
          )
        );
        platformWidthCounter += PLATFORM_SMALL_TALL_DIMENSION.width;
        break;
      }
      case "plt": {
        platforms.push(
          new Platform(
            {
              x: platformWidthCounter,
              y: canvas.height - PLATFORM_LARGE_TALL_DIMENSION.height,
            },
            platformLargeTall,
            PLATFORM_LARGE_TALL_DIMENSION.width,
            PLATFORM_LARGE_TALL_DIMENSION.height,
            platformWidthCounter
          )
        );
        platformWidthCounter += PLATFORM_LARGE_TALL_DIMENSION.width;
        break;
      }
      case "gs": {
        platformWidthCounter += SMALL_GAP;
        break;
      }
      case "gl": {
        platformWidthCounter += LARGE_GAP;
        break;
      }
    }
  });

  genericObjects = [
    new GenericObject({ x: 0, y: 0 }, background, BACKGROUND_PARALLAX_RATIO),
    new GenericObject({ x: -100, y: 0 }, clouds1, CLOUDS_PARALLAX_RATIO),
    new GenericObject(
      { x: 0, y: canvas.height - HILLS_HEIGHT },
      hills,
      BACKGROUND_PARALLAX_RATIO
    ),
  ];

  player = new Player();

  ememies = [
    new Enemy({ position: { x: 400, y: 50 }, velocity: { x: -1, y: 0 } }),
    new Enemy({ position: { x: 1350, y: 50 }, velocity: { x: -1, y: 0 } }),
    new Enemy({ position: { x: 2400, y: 50 }, velocity: { x: -1, y: 0 } }),
    new Enemy({ position: { x: 3374, y: 50 }, velocity: { x: -1, y: 0 } }),
    new Enemy({ position: { x: 5300, y: 50 }, velocity: { x: -1, y: 0 } }),
  ];
  enemyBursts = [];

  blocks = [
    new Block({ x: 200, y: 255 }, block, 80, 80),
    new Block({ x: 400, y: 255 }, block3, 80 * 3, 80),
    new Block({ x: 4300, y: 355 }, block3, 80 * 3, 80),
    new Block({ x: 3474, y: 355 }, block, 80, 80),
    new Block({ x: 1700, y: 355 }, block, 80, 80),
    new Block({ x: 200, y: 255 }, block, 80, 80),
  ];

  gems = [
    new Gem({ x: 1200, y: 0 }, { x: 0, y: 0 }, gem),
    new Gem({ x: 2747, y: 0 }, { x: 0, y: 0 }, gem),
    new Gem({ x: 3374, y: 0 }, { x: 0, y: 0 }, gem),
  ];

  scrollOffset = 0;
}

function animate() {
  c.clearRect(0, 0, canvas.width, canvas.height);

  genericObjects.forEach((object) => object.draw(c));
  Flag.draw(c);

  stats.draw(c);
  stats.lives = player.life;

  platforms.forEach((platform) => platform.draw(c));

  player.update(c, canvas);
  enemyBursts.forEach((burst) => {
    burst.update(c);
  });
  ememies.forEach((enemy, index) => {
    //killing enemy with the bullet
    bullets.forEach((bullet) => {
      console.log(enemy.bulletLimit);
      if (bulletEnemyCollision(bullet, enemy)) {
        enemy.bulletLimit -= 1;
      }
    });

    //if more than the limit of bullets enemy can handle kill enemy

    if (enemy.bulletLimit <= 0) {
      ememies.splice(index, 1);
    }

    //killing enemy when player is on top
    if (playerOnTopEnemy(player, enemy)) {
      player.velocity.y = -15;
      for (let i = 0; i < 100; i++) {
        enemyBursts.push(
          new Burst(
            // { x: enemy.position.x, y: enemy.position.y },
            {
              x: enemy.position.x + enemy.width / 2,
              y: enemy.position.y + enemy.height / 2,
            },
            { x: Math.random() - 0.5, y: (Math.random() - 0.5) * 5 },
            Math.random() * 5
          )
        );
      }
      //this will add some transition animation
      setTimeout(() => {
        ememies.splice(index, 1);
      }, 100);
    }
    //killing player when player touches enemy from side
    if (playerOnSideEnemy(player, enemy)) {
      if (player.life <= 0) {
        init();
      } else {
        if (!player.respawningPeriod) {
          player.life -= 1;
          player.respawningPeriod = true;
          setTimeout(() => {
            player.respawningPeriod = false;
          }, 1000);
        }
      }
    }

    enemy.update(c);
  });

  //to draw the gem flower and also to check the player collision with the gem
  gems.forEach((gem, index) => {
    gem.update(c);
    if (rectangularCollisionDetection(player, gem)) {
      console.log("gem collected");
      player.life += 1;
      gems.splice(index, 1);
      player.velocity.y = -5;
      player.width *= 1.2;
      player.height *= 1.2;
    }
  });

  //for shooting bullet
  if (keys.space.pressed) {
    if (lastKey === "right") {
      bullets.push(
        new Bullet(
          {
            x: player.position.x + player.width,
            y: player.position.y + player.height / 2 + 10,
          },
          { x: 10, y: 0 },
          3
        )
      );
    }
    if (lastKey === "left") {
      bullets.push(
        new Bullet(
          {
            x: player.position.x,
            y: player.position.y + player.height + 10,
          },
          { x: -10, y: 0 },
          3
        )
      );
    }
  }

  //for displaying bullets
  bullets.forEach((bullet) => {
    bullet.update(c);
    if (bullet.distanceTravelled > bullet.range) {
      bullets.splice(bullets.indexOf(bullet), 1);
    }
  });

  //player moving right
  if (keys.right.pressed && player.position.x < 400) {
    player.velocity.x = player.speed;
  } else if (
    (keys.left.pressed && player.position.x > 100) ||
    (keys.left.pressed && scrollOffset === 0 && player.position.x > 0)
  ) {
    player.velocity.x = -player.speed;
  } else {
    player.velocity.x = 0;
    if (keys.right.pressed) {
      platforms.forEach((platform) => (platform.position.x -= player.speed));
      //to move blocks along with the platform when the player moves right
      blocks.forEach((block) => (block.position.x -= player.speed));
      //to move ememies along with the platform when the player moves right
      ememies.forEach((enemy) => (enemy.position.x -= player.speed));

      enemyBursts.forEach((burst) => (burst.position.x -= player.speed));
      genericObjects.forEach(
        (object) => (object.position.x -= player.speed * object.parallaxRatio)
      );

      gems.forEach((gem) => (gem.position.x -= player.speed));
      Flag.position.x -= player.speed;
      scrollOffset += player.speed;
    } else if (keys.left.pressed && scrollOffset > 0) {
      platforms.forEach((platform) => (platform.position.x += player.speed));
      blocks.forEach((block) => (block.position.x += player.speed));

      ememies.forEach((enemy) => (enemy.position.x += player.speed));
      enemyBursts.forEach((burst) => (burst.position.x += player.speed));
      genericObjects.forEach(
        (object) => (object.position.x += player.speed * object.parallaxRatio)
      );

      gems.forEach((gem) => (gem.position.x += player.speed));
      Flag.position.x += player.speed;
      scrollOffset -= player.speed;
    }
  }

  //to check the collision of the player with the platform
  platforms.forEach((platform) => {
    if (isObjectAbovePlatform(player, platform)) {
      player.position.y = platform.position.y - player.height;
      player.velocity.y = 0;
    }

    //check collision of gems with the platform

    gems.forEach((gem) => {
      if (isObjectAbovePlatform(gem, platform)) {
        gem.position.y = platform.position.y - gem.height;
        gem.velocity.y = 0;
      }
    });

    //to check the collision of enemy with the platform
    ememies.forEach((enemy) => {
      if (isObjectAbovePlatform(enemy, platform)) {
        enemy.position.y = platform.position.y - enemy.height;
        enemy.velocity.y = 0;
      }
    });

    //to check the collision of enemy burst with the platform
    enemyBursts.forEach((burst) => {
      if (isCircleAbovePlatform(burst, platform)) {
        burst.position.y = platform.position.y - burst.radius;
        burst.velocity.y = -burst.velocity.y * burst.radius * 0.15;
        burst.radius *= 0.5;
        // if (burst.radius < 2) {
        //   enemyBursts.splice(index, 1);
        // }
      }
    });
    // Previously considered removing small bursts within the collision loop, but this approach led to skipping elements due to array reindexing.
    // Instead, iterate backwards through the enemyBursts array to safely remove bursts below a certain size without skipping elements.
    for (let index = enemyBursts.length - 1; index >= 0; index--) {
      const burst = enemyBursts[index];
      if (burst.radius < 2) {
        enemyBursts.splice(index, 1);
      }
    }
  });

  //to check the collision of the player with the blocks
  blocks.forEach((block) => {
    block.draw(c);
    if (hittintBlockBottom(player, block)) {
      player.velocity.y = 5;
    }

    if (isObjectAbovePlatform(player, block)) {
      player.position.y = block.position.y - player.height;
      player.velocity.y = 0;
    }

    if (hittingBlockSides(player, block)) {
      player.velocity.x = 0;
    }
  });

  //to check the collision of the player with the gems

  if (
    lastKey === "right" &&
    keys.right.pressed &&
    player.currentSprite !== player.sprites.run.right
  ) {
    player.frames = 1;
    player.currentSprite = player.sprites.run.right;
    player.currentCropWidth = player.sprites.run.cropWidth;
    player.width = player.sprites.run.width;
  } else if (
    lastKey === "right" &&
    !keys.right.pressed &&
    player.currentSprite !== player.sprites.stand.right
  ) {
    player.frames = 1;
    player.currentSprite = player.sprites.stand.right;
    player.currentCropWidth = player.sprites.stand.cropWidth;
    player.width = player.sprites.stand.width;
  } else if (
    lastKey === "left" &&
    keys.left.pressed &&
    player.currentSprite !== player.sprites.run.left
  ) {
    player.frames = 1;
    player.currentSprite = player.sprites.run.left;
    player.currentCropWidth = player.sprites.run.cropWidth;
    player.width = player.sprites.run.width;
  } else if (
    lastKey === "left" &&
    !keys.left.pressed &&
    player.currentSprite !== player.sprites.stand.left
  ) {
    player.frames = 1;
    player.currentSprite = player.sprites.stand.left;
    player.currentCropWidth = player.sprites.stand.cropWidth;
    player.width = player.sprites.stand.width;
  }

  if (scrollOffset > getImage(platform).width * 5 + 800) {
    console.log("you won");
  }

  if (player.position.y + player.height >= canvas.height) {
    init();
  }
  requestAnimationFrame(animate);
}

init();
animate();

addEventListener("keydown", ({ code }) => {
  switch (code) {
    case "ArrowUp":
    case "KeyW":
      player.velocity.y = -15;
      break;
    case "ArrowDown":
    case "KeyS":
      break;
    case "ArrowLeft":
    case "KeyA":
      keys.left.pressed = true;
      lastKey = "left";
      break;
    case "ArrowRight":
    case "KeyD":
      keys.right.pressed = true;
      lastKey = "right";
      break;
    case "Space":
      keys.space.pressed = true;
      break;
  }
});

addEventListener("keyup", ({ code }) => {
  switch (code) {
    case "ArrowUp":
    case "KeyW":
      break;
    case "ArrowDown":
    case "KeyS":
      break;
    case "ArrowLeft":
    case "KeyA":
      keys.left.pressed = false;
      lastKey = "left";
      break;
    case "ArrowRight":
    case "KeyD":
      keys.right.pressed = false;
      lastKey = "right";
      break;
    case "Space":
      keys.space.pressed = false;
  }
});
