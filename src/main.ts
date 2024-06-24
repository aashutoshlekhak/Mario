import { BACKGROUND_PARALLAX_RATIO } from "./constants/constants";
import platform from "../public/Sprites/platform.png";
import platformSmallTall from "../public/Sprites/platformSmallTall.png";
import hills from "../public/Sprites/hills1.webp";
import background from "../public/Sprites/backgroundYellow.png";
import block from "../public/mySprites/singleBlock.png";
import block3 from "../public/mySprites/trioBlock.png";
import gem from "../public/mySprites/gemFlower.png";

import {
  bulletEnemyCollision,
  getImage,
  getImageAsync,
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
  const platformImg: HTMLImageElement = await getImageAsync(platform);
  const platformSmallTallImg = await getImageAsync(platformSmallTall);

  genericObjects = [
    new GenericObject({ x: 0, y: 0 }, background),
    new GenericObject({ x: 0, y: 0 }, hills),
  ];

  player = new Player();

  ememies = [
    new Enemy({ position: { x: 1000, y: 50 }, velocity: { x: -1, y: 0 } }),
  ];
  enemyBursts = [];
  platforms = [
    new Platform(
      {
        x: platformImg.width * 4 + 980 - platformSmallTallImg.width,
        y: 255,
      },
      platformSmallTall
    ),
    new Platform({ x: 0, y: 455 }, platform),
    new Platform({ x: platformImg.width * 1, y: 455 }, platform),
    new Platform({ x: platformImg.width * 2 + 200, y: 455 }, platform),
    new Platform({ x: platformImg.width * 3 + 400, y: 455 }, platform),
    new Platform({ x: platformImg.width * 4 + 400, y: 455 }, platform),
    new Platform({ x: platformImg.width * 5 + 800, y: 455 }, platform),
  ];

  blocks = [
    new Block({ x: 200, y: 255 }, block, 80, 80),
    new Block({ x: 400, y: 255 }, block3, 80 * 3, 80),
  ];

  gems = [new Gem({ x: 1000, y: 0 }, { x: 0, y: 0 }, gem)];

  scrollOffset = 0;
}

function animate() {
  c.clearRect(0, 0, canvas.width, canvas.height);

  genericObjects.forEach((object) => object.draw(c));
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
            y: player.position.y + player.height/2 +10,
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
            y: player.position.y + player.height +10,
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
        (object) =>
          (object.position.x -= player.speed * BACKGROUND_PARALLAX_RATIO)
      );

      gems.forEach((gem) => (gem.position.x -= player.speed));
      scrollOffset += player.speed;
    } else if (keys.left.pressed && scrollOffset > 0) {
      platforms.forEach((platform) => (platform.position.x += player.speed));
      blocks.forEach((block) => (block.position.x += player.speed));

      ememies.forEach((enemy) => (enemy.position.x += player.speed));
      enemyBursts.forEach((burst) => (burst.position.x += player.speed));
      genericObjects.forEach(
        (object) =>
          (object.position.x += player.speed * BACKGROUND_PARALLAX_RATIO)
      );

      gems.forEach((gem) => (gem.position.x += player.speed));
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
    enemyBursts.forEach((burst, index) => {
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
