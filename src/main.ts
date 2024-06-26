import {
  BACKGROUND_PARALLAX_RATIO,
  CANVAS_DIMENSIONS,
  CLOUDS_PARALLAX_RATIO,
  HILLS_HEIGHT,
  LARGE_GAP,
  MEDIUM_GAP,
  PLATFORM_LARGE_DIMENSION,
  PLATFORM_LARGE_TALL_DIMENSION,
  PLATFORM_MEDIUM_DIMENSION,
  PLATFORM_SMALL_DIMENSION,
  PLATFORM_SMALL_TALL_DIMENSION,
  SMALL_GAP,
} from "./constants/constants";
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
import coin from "../public/mySprites/coins.png";
import flag from "../public/mySprites/flag.png";
import { images } from "./utils/images";

import {
  bulletEnemyCollision,
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
import { audio } from "./utils/audio";
import { WaterEnemy } from "./classes/WaterEnemy";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const c = canvas.getContext("2d") as CanvasRenderingContext2D;
canvas.width = CANVAS_DIMENSIONS.WIDTH;
canvas.height = CANVAS_DIMENSIONS.HEIGHT;

const startScreen = document.getElementById("start-screen") as HTMLDivElement;
const endScreen = document.getElementById("end-screen") as HTMLDivElement;
const startButton = document.getElementById(
  "start-button"
) as HTMLButtonElement;
const restartButton = document.getElementById(
  "restart-button"
) as HTMLButtonElement;

let isPaused: boolean = false;
let genericObjects: GenericObject[] = [];
let player = new Player();
let platforms: Platform[] = [];
let ememies: Enemy[] = [];
let enemyBursts: Burst[] = [];
let blocks: Block[] = [];
let lastKey: string;
let gems: Gem[] = [];
let coins: Gem[] = [];
let coinCount = 0;
let bullets: Bullet[] = [];
let waterEnemies: WaterEnemy[] = [];
let Flag = new GenericObject({ x: 5000, y: 0 }, flag, 0);
let stats = new DisplayElement({ x: 10, y: 10 }, 0, 0, isPaused);
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
let currentLevel = 1;

function selectLevel(level: number) {
  startScreen.style.display = "none";
  endScreen.style.display = "none";
  canvas.style.display = "block";
  switch (level) {
    case 1: {
      init();
      break;
    }
    case 2: {
      level2init();
      break;
    }
  }
}

async function init() {
  startScreen.style.display = "none";
  endScreen.style.display = "none";
  canvas.style.display = "block";
  const gameMapPlatforms = [
    "pl", // Platform Large - length: 852, start: 0
    "gs", // Gap Small - length: 300, start: 852
    "pm", // Platform Medium - length: 453, start: 1152
    "gm", // Gap Medium - length: 500, start: 1605
    "pst", // Platform Small Tall - length: 242, start: 2105
    "gs", // Gap Small - length: 300, start: 2347
    "plt", // Platform Large Tall - length: 227, start: 2647
    "gs", // Gap Small - length: 300, start: 2874
    "pst", // Platform Small Tall - length: 242, start: 3174
    "gs", // Gap Small - length: 300, start: 3416
    "pst", // Platform Small Tall - length: 242, start: 3716
    "gl", // Gap Large - length: 800, start: 3958
    "plt", // Platform Large Tall - length: 227, start: 4758
    "gs", // Gap Small - length: 300, start: 4985
    "pl", // Platform Large - length: 852, start: 5285
    "gm", // Gap Medium - length: 500, start: 6137
    "pm", // Platform Medium - length: 453, start: 6637
    "gl", // Gap Large - length: 800, start: 7090
    "pl", // Platform Large - length: 852, start: 7890
    "gl", // Gap Large - length: 800, start: 8742
    "pst", // Platform Small Tall - length: 242, start: 9542
    "gs", // Gap Small - length: 300, start: 9784
    "pl", // Platform Large - length: 852, start: 10084
    "gl", // Gap Large - length: 800, start: 10936
    "plt", // Platform Large Tall - length: 227, start: 11736
    "gs", // Gap Small - length: 300, start: 11963
    "pl", // Platform Medium - length: 453, start: 12263
    "pl",
  ];

  player = new Player();
  keys = {
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
  scrollOffset = 0;
  let platformWidthCounter = 0;
  platforms = [];
  /* The above code is attempting to set the x-coordinate of the position of a flag to 5385 in a
  TypeScript program. However, the code seems to be incorrect as it is using a mix of different
  syntax elements from different programming languages. The correct way to set the x-coordinate of a
  position in TypeScript would be something like: */
  // Flag.position.x = 5385;
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
      case "gm": {
        platformWidthCounter += MEDIUM_GAP;
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
    new Enemy({ position: { x: 400, y: 315 }, velocity: { x: -1, y: 0 } }),
    new Enemy({ position: { x: 1252, y: 315 }, velocity: { x: -1, y: 0 } }),
    new Enemy({ position: { x: 2780, y: 315 }, velocity: { x: -1, y: 0 } }),
    new Enemy({ position: { x: 3274, y: 315 }, velocity: { x: -1, y: 0 } }),
    new Enemy({ position: { x: 3916, y: 315 }, velocity: { x: -1, y: 0 } }),
    new Enemy({ position: { x: 4858, y: 315 }, velocity: { x: -1, y: 0 } }),
    new Enemy({ position: { x: 5385, y: 315 }, velocity: { x: -1, y: 0 } }),
    new Enemy({ position: { x: 5585, y: 315 }, velocity: { x: -1, y: 0 } }),
    new Enemy({ position: { x: 6750, y: 315 }, velocity: { x: -1, y: 0 } }),
    new Enemy({ position: { x: 8000, y: 315 }, velocity: { x: -1, y: 0 } }),
    new Enemy({ position: { x: 9750, y: 315 }, velocity: { x: -1, y: 0 } }),
    new Enemy({ position: { x: 10384, y: 315 }, velocity: { x: -1, y: 0 } }),
    new Enemy({ position: { x: 11936, y: 315 }, velocity: { x: -1, y: 0 } }),
    new Enemy({ position: { x: 12563, y: 315 }, velocity: { x: -1, y: 0 } }),

    //for blocks
    new Enemy({ position: { x: 4360, y: 315 }, velocity: { x: -1, y: 0 } }),
    new Enemy({ position: { x: 6400, y: 315 }, velocity: { x: -1, y: 0 } }),
    new Enemy({ position: { x: 7350, y: 315 }, velocity: { x: -1, y: 0 } }),
    new Enemy({ position: { x: 1150, y: 315 }, velocity: { x: -1, y: 0 } }),
    new Enemy({ position: { x: 11500, y: 315 }, velocity: { x: -1, y: 0 } }),
  ];

  enemyBursts = [];

  waterEnemies = [
    // Gap at start: 852 (gs)
    new WaterEnemy(
      {
        position: { x: 1000, y: 780 },
        velocity: { x: 0, y: 0 },
      },
      -15,
      400
    ),

    // Gap at start: 1605 (gm)
    new WaterEnemy(
      {
        position: { x: 1800, y: 660 },
        velocity: { x: 0, y: 0 },
      },
      -15,
      420
    ),

    // Gap at start: 2347 (gs)
    new WaterEnemy(
      {
        position: { x: 2500, y: 540 },
        velocity: { x: 0, y: 0 },
      },
      -15,
      440
    ),
    new WaterEnemy(
      {
        position: { x: 2600, y: 780 },
        velocity: { x: 0, y: 0 },
      },
      -15,
      400
    ),

    // Gap at start: 2874 (gs)
    new WaterEnemy(
      {
        position: { x: 3000, y: 660 },
        velocity: { x: 0, y: 0 },
      },
      -15,
      420
    ),

    // Gap at start: 3416 (gs)
    new WaterEnemy(
      {
        position: { x: 3600, y: 540 },
        velocity: { x: 0, y: 0 },
      },
      -15,
      440
    ),

    // Gap at start: 3958 (gl)
    new WaterEnemy(
      {
        position: { x: 4200, y: 780 },
        velocity: { x: 0, y: 0 },
      },
      -15,
      400
    ),
    new WaterEnemy(
      {
        position: { x: 4400, y: 660 },
        velocity: { x: 0, y: 0 },
      },
      -15,
      420
    ),

    // Gap at start: 4985 (gs)
    new WaterEnemy(
      {
        position: { x: 5100, y: 540 },
        velocity: { x: 0, y: 0 },
      },
      -15,
      440
    ),

    // Gap at start: 6137 (gm)

    new WaterEnemy(
      {
        position: { x: 6237, y: 780 },
        velocity: { x: 1000, y: 0 },
      },
      -15,
      400
    ),
    new WaterEnemy(
      {
        position: { x: 6337, y: 660 },
        velocity: { x: 0, y: 0 },
      },
      -15,
      420
    ),
    new WaterEnemy(
      {
        position: { x: 6437, y: 540 },
        velocity: { x: 0, y: 0 },
      },
      -15,
      440
    ),

    // Gap at start: 7090 (gl)
    new WaterEnemy(
      {
        position: { x: 7300, y: 660 },
        velocity: { x: 0, y: 0 },
      },
      -15,
      420
    ),
    new WaterEnemy(
      {
        position: { x: 7500, y: 540 },
        velocity: { x: 0, y: 0 },
      },
      -15,
      440
    ),

    // Gap at start: 8742 (gl)
    new WaterEnemy(
      {
        position: { x: 9000, y: 780 },
        velocity: { x: 0, y: 0 },
      },
      -15,
      400
    ),

    // Gap at start: 9784 (gs)
    new WaterEnemy(
      {
        position: { x: 9900, y: 660 },
        velocity: { x: 0, y: 0 },
      },
      -15,
      420
    ),

    // Gap at start: 10936 (gl)
    new WaterEnemy(
      {
        position: { x: 11100, y: 540 },
        velocity: { x: 0, y: 0 },
      },
      -15,
      440
    ),

    // Gap at start: 11963 (gs)
    new WaterEnemy(
      {
        position: { x: 12100, y: 780 },
        velocity: { x: 0, y: 0 },
      },
      -15,
      400
    ),
  ];

  blocks = [
    new Block({ x: 100, y: 255 }, block3, 80 * 3, 80),
    new Block({ x: 1750, y: 395 }, block, 80, 80),

    new Block({ x: 4100, y: 295 }, block, 80, 80),
    new Block({ x: 4350, y: 295 }, block3, 80 * 3, 80),

    new Block({ x: 6230, y: 395 }, block3, 240, 80),

    new Block({ x: 7200, y: 350 }, block3, 240, 80),
    new Block({ x: 7700, y: 395 }, block, 80, 80),

    new Block({ x: 9000, y: 395 }, block3, 240, 80),

    new Block({ x: 11100, y: 395 }, block, 80, 80),
    new Block({ x: 11300, y: 395 }, block3, 80 * 3, 80),
  ];

  gems = [
    new Gem({ x: 1200, y: 0 }, { x: 0, y: 0 }, gem),
    new Gem({ x: 6330, y: 0 }, { x: 0, y: 0 }, gem),
    new Gem({ x: 6237, y: 0 }, { x: 0, y: 0 }, gem),
    new Gem({ x: 3374, y: 0 }, { x: 0, y: 0 }, gem),
    new Gem({ x: 11000, y: 0 }, { x: 0, y: 0 }, gem),
  ];

  coins = [
    new Gem({ x: 500, y: 355 }, { x: 0, y: 0 }, coin),
    new Gem({ x: 1747, y: 355 }, { x: 0, y: 0 }, coin),
    new Gem({ x: 2747, y: 355 }, { x: 0, y: 0 }, coin),
    new Gem({ x: 3374, y: 395 }, { x: 0, y: 0 }, coin),
    new Gem({ x: 4700, y: 355 }, { x: 0, y: 0 }, coin),
    new Gem({ x: 5374, y: 395 }, { x: 0, y: 0 }, coin),
    new Gem({ x: 6200, y: 355 }, { x: 0, y: 0 }, coin),
    new Gem({ x: 7200, y: 355 }, { x: 0, y: 0 }, coin),
    new Gem({ x: 8200, y: 355 }, { x: 0, y: 0 }, coin),
    new Gem({ x: 9200, y: 355 }, { x: 0, y: 0 }, coin),
    new Gem({ x: 9742, y: 355 }, { x: 0, y: 0 }, coin),
    new Gem({ x: 11736, y: 395 }, { x: 0, y: 0 }, coin),
    new Gem({ x: 12263, y: 355 }, { x: 0, y: 0 }, coin),
    new Gem({ x: 13500, y: 355 }, { x: 0, y: 0 }, coin),
    new Gem({ x: 13850, y: 355 }, { x: 0, y: 0 }, coin),
    new Gem({ x: 15850, y: 355 }, { x: 0, y: 0 }, coin),

    new Gem({ x: 400, y: 355 }, { x: 0, y: 0 }, coin),
    new Gem({ x: 1252, y: 355 }, { x: 0, y: 0 }, coin),
    new Gem({ x: 2780, y: 355 }, { x: 0, y: 0 }, coin),
    new Gem({ x: 3274, y: 355 }, { x: 0, y: 0 }, coin),
    new Gem({ x: 3916, y: 355 }, { x: 0, y: 0 }, coin),
    new Gem({ x: 4858, y: 355 }, { x: 0, y: 0 }, coin),
    new Gem({ x: 5385, y: 355 }, { x: 0, y: 0 }, coin),
    new Gem({ x: 5585, y: 355 }, { x: 0, y: 0 }, coin),
    new Gem({ x: 6750, y: 355 }, { x: 0, y: 0 }, coin),
    new Gem({ x: 8000, y: 355 }, { x: 0, y: 0 }, coin),
    new Gem({ x: 9750, y: 355 }, { x: 0, y: 0 }, coin),
    new Gem({ x: 10384, y: 355 }, { x: 0, y: 0 }, coin),
    new Gem({ x: 11936, y: 355 }, { x: 0, y: 0 }, coin),
    new Gem({ x: 12563, y: 355 }, { x: 0, y: 0 }, coin),

    new Gem({ x: 4360, y: 355 }, { x: 0, y: 0 }, coin),
    new Gem({ x: 6400, y: 355 }, { x: 0, y: 0 }, coin),
    new Gem({ x: 7350, y: 355 }, { x: 0, y: 0 }, coin),
    new Gem({ x: 1150, y: 355 }, { x: 0, y: 0 }, coin),
    new Gem({ x: 11500, y: 355 }, { x: 0, y: 0 }, coin),
  ];

  scrollOffset = 0;
}

async function level2init() {
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
    "pl", // Platform Large - length: 852, start: 0
    "gs", // Gap Small - length: 300, start: 852
    "pm", // Platform Medium - length: 453, start: 1152
    "gm", // Gap Medium - length: 500, start: 1605
    "pst", // Platform Small Tall - length: 242, start: 2105
    "gs", // Gap Small - length: 300, start: 2347
    "plt", // Platform Large Tall - length: 227, start: 2647
    "gs", // Gap Small - length: 300, start: 2874
    "pst", // Platform Small Tall - length: 242, start: 3174
    "gs", // Gap Small - length: 300, start: 3416
    "pst", // Platform Small Tall - length: 242, start: 3716
    "gl", // Gap Large - length: 800, start: 3958
    "plt", // Platform Large Tall - length: 227, start: 4758
    "gs", // Gap Small - length: 300, start: 4985
    "pl", // Platform Large - length: 852, start: 5285
    "pl",
    "pl",
  ];

  player = new Player();
  keys = {
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
  scrollOffset = 0;
  let platformWidthCounter = 0;
  platforms = [];
  Flag.position.x = 5500;
  gameMapPlatforms.forEach((Abbrebiation) => {
    switch (Abbrebiation) {
      case "ps": {
        platforms.push(
          new Platform(
            {
              x: platformWidthCounter,
              y: canvas.height - PLATFORM_SMALL_DIMENSION.height,
            },
            images.levels[2].platformSmallDark,
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
            images.levels[2].platformMediumDark,

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
            images.levels[2].platformLargeDark,
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
            images.levels[2].platformSmallTallDark,

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
            images.levels[2].platformLargeTallDark,
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
      case "gm": {
        platformWidthCounter += MEDIUM_GAP;
        break;
      }
      case "gl": {
        platformWidthCounter += LARGE_GAP;
        break;
      }
    }
  });

  genericObjects = [
    new GenericObject(
      { x: 0, y: 0 },
      images.levels[2].background,
      BACKGROUND_PARALLAX_RATIO
    ),
  ];

  player = new Player();

  ememies = [
    new Enemy({ position: { x: 400, y: 315 }, velocity: { x: -1, y: 0 } }),
    new Enemy({ position: { x: 1252, y: 315 }, velocity: { x: -1, y: 0 } }),
    new Enemy({ position: { x: 2780, y: 315 }, velocity: { x: -1, y: 0 } }),
    new Enemy({ position: { x: 3274, y: 315 }, velocity: { x: -1, y: 0 } }),
    new Enemy({ position: { x: 3916, y: 315 }, velocity: { x: -1, y: 0 } }),
    new Enemy({ position: { x: 4858, y: 315 }, velocity: { x: -1, y: 0 } }),
    new Enemy({ position: { x: 5385, y: 315 }, velocity: { x: -1, y: 0 } }),
  ];
  enemyBursts = [];

  waterEnemies = [
    // Gap at start: 852 (gs)
    new WaterEnemy(
      {
        position: { x: 1000, y: 780 },
        velocity: { x: 0, y: 0 },
      },
      -15,
      400
    ),

    // Gap at start: 1605 (gm)
    new WaterEnemy(
      {
        position: { x: 1800, y: 660 },
        velocity: { x: 0, y: 0 },
      },
      -15,
      420
    ),

    // Gap at start: 2347 (gs)
    new WaterEnemy(
      {
        position: { x: 2500, y: 540 },
        velocity: { x: 0, y: 0 },
      },
      -15,
      440
    ),
    new WaterEnemy(
      {
        position: { x: 2600, y: 780 },
        velocity: { x: 0, y: 0 },
      },
      -15,
      400
    ),

    // Gap at start: 2874 (gs)
    new WaterEnemy(
      {
        position: { x: 3000, y: 660 },
        velocity: { x: 0, y: 0 },
      },
      -15,
      420
    ),

    // Gap at start: 3416 (gs)
    new WaterEnemy(
      {
        position: { x: 3600, y: 540 },
        velocity: { x: 0, y: 0 },
      },
      -15,
      440
    ),

    // Gap at start: 3958 (gl)
    new WaterEnemy(
      {
        position: { x: 4200, y: 780 },
        velocity: { x: 0, y: 0 },
      },
      -15,
      400
    ),
    new WaterEnemy(
      {
        position: { x: 4400, y: 660 },
        velocity: { x: 0, y: 0 },
      },
      -15,
      420
    ),

    // Gap at start: 4985 (gs)
    new WaterEnemy(
      {
        position: { x: 5100, y: 540 },
        velocity: { x: 0, y: 0 },
      },
      -15,
      440
    ),
  ];

  blocks = [
    new Block({ x: 100, y: 255 }, block3, 80 * 3, 80),
    new Block({ x: 1750, y: 395 }, block, 80, 80),
    new Block({ x: 4100, y: 295 }, block, 80, 80),
    new Block({ x: 4350, y: 295 }, block3, 80 * 3, 80),
  ];

  gems = [
    new Gem({ x: 1200, y: 0 }, { x: 0, y: 0 }, gem),
    new Gem({ x: 2747, y: 0 }, { x: 0, y: 0 }, gem),
    new Gem({ x: 3374, y: 0 }, { x: 0, y: 0 }, gem),
  ];

  coins = [
    new Gem({ x: 500, y: 355 }, { x: 0, y: 0 }, coin),
    new Gem({ x: 1747, y: 355 }, { x: 0, y: 0 }, coin),
    new Gem({ x: 2747, y: 355 }, { x: 0, y: 0 }, coin),
    new Gem({ x: 3374, y: 395 }, { x: 0, y: 0 }, coin),
    new Gem({ x: 4700, y: 355 }, { x: 0, y: 0 }, coin),
    new Gem({ x: 5374, y: 395 }, { x: 0, y: 0 }, coin),
  ];

  scrollOffset = 0;
}

function drawPauseMessage() {
  c.font = "20px Copperplate";
  c.fillStyle = "red";
  c.fillText("PAUSED Press P to continue", canvas.width / 3, 100);
  requestAnimationFrame(drawPauseMessage);
}

function animate() {
  c.clearRect(0, 0, canvas.width, canvas.height);

  genericObjects.forEach((object) => object.draw(c));
  if (currentLevel === 2) {
    Flag.draw(c);
  }

  stats.draw(c);
  stats.lives = player.life;
  stats.coins = coinCount;

  platforms.forEach((platform) => platform.draw(c));

  player.update(c, canvas);
  waterEnemies.forEach((enemy) => {
    enemy.update(c);
  });
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
      audio.enemyKilled.play();
      ememies.splice(index, 1);
    }

    //killing enemy when player is on top
    if (playerOnTopEnemy(player, enemy)) {
      player.velocity.y = -10;
      audio.enemyKilled.play();
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
        selectLevel(currentLevel);
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

  waterEnemies.forEach((enemy) => {
    if (playerOnSideEnemy(player, enemy)) {
      if (player.life <= 0) {
        selectLevel(currentLevel);
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
  });

  //to draw the gem flower and also to check the player collision with the gem
  gems.forEach((gem, index) => {
    gem.update(c);
    if (rectangularCollisionDetection(player, gem)) {
      console.log("gem collected");
      audio.coinSound.play();
      player.life += 1;
      gems.splice(index, 1);
    }
  });

  coins.forEach((coin, index) => {
    coin.update(c);
    if (rectangularCollisionDetection(player, coin)) {
      audio.coinSound.play();
      coinCount += 1;
      coins.splice(index, 1);
    }
  });

  //for shooting bullet
  if (keys.space.pressed) {
    if (lastKey === "right") {
      //to only let the player to fire 1 bullet at once
      if (bullets.length <= 2) {
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
    }
    if (lastKey === "left") {
      if (bullets.length <= 2) {
        bullets.push(
          new Bullet(
            {
              x: player.position.x,
              y: player.position.y + player.height / 2 + 10,
            },
            { x: -10, y: 0 },
            3
          )
        );
      }
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

      waterEnemies.forEach((enemy) => (enemy.position.x -= player.speed));

      enemyBursts.forEach((burst) => (burst.position.x -= player.speed));
      genericObjects.forEach(
        (object) => (object.position.x -= player.speed * object.parallaxRatio)
      );

      gems.forEach((gem) => (gem.position.x -= player.speed));
      coins.forEach((coin) => (coin.position.x -= player.speed));
      Flag.position.x -= player.speed;
      scrollOffset += player.speed;
    } else if (keys.left.pressed && scrollOffset > 0) {
      platforms.forEach((platform) => (platform.position.x += player.speed));
      blocks.forEach((block) => (block.position.x += player.speed));

      ememies.forEach((enemy) => (enemy.position.x += player.speed));
      enemyBursts.forEach((burst) => (burst.position.x += player.speed));
      waterEnemies.forEach((enemy) => (enemy.position.x += player.speed));
      genericObjects.forEach(
        (object) => (object.position.x += player.speed * object.parallaxRatio)
      );

      gems.forEach((gem) => (gem.position.x += player.speed));
      coins.forEach((coin) => (coin.position.x += player.speed));
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

    coins.forEach((coin) => {
      if (isObjectAbovePlatform(coin, platform)) {
        coin.position.y = platform.position.y - coin.height;
        coin.velocity.y = 0;
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

  if (scrollOffset >= 12000) {
    currentLevel += 1;
    audio.level1CompleteSound.play();
    selectLevel(currentLevel);
  }

  if (scrollOffset >= 5500 && currentLevel === 2) {
    audio.level2CompleteSound.play();
    alert("Level 2 Completed");
    selectLevel(currentLevel);
  }

  if (player.position.y + player.height >= canvas.height) {
    selectLevel(currentLevel);
  }

  if (!isPaused) {
    requestAnimationFrame(animate);
  } else {
    drawPauseMessage();
  }
}

selectLevel(currentLevel);
animate();

addEventListener("keydown", ({ code }) => {
  switch (code) {
    case "ArrowUp":
    case "KeyW":
      if (player.velocity.y === 0) {
        player.velocity.y = -15;
        console.log("hello");
      }
      audio.jumpSound.play();
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
      audio.bulletSound.play();
      break;
    case "KeyP":
      isPaused = !isPaused;
      if (!isPaused) {
        animate();
      }
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

startButton.addEventListener("click", () => {
  selectLevel(currentLevel);
});

restartButton.addEventListener("click", () => {
  selectLevel(currentLevel);
});
