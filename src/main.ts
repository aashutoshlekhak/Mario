import platform from "../public/Sprites/platform.png";
import hills from "../public/Sprites/hills.png";
import background from "../public/Sprites/background4.jpg";
import GenericObject from "./Models/GenericObject";
import Platform from "./Models/Platform";
import Player from "./Models/Player";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const c = canvas.getContext("2d") as CanvasRenderingContext2D;
canvas.width = 1024;
canvas.height = 576;

let scrollOffset = 0;

const genericObjects = [
  new GenericObject({ x: 0, y: 0 }, background),
  new GenericObject({ x: 0, y: 0 }, hills),
];

const player = new Player();

const platforms = [
  new Platform({ x: 0, y: 455 }, platform),
  new Platform({ x: 700, y: 455 }, platform),
  new Platform({ x: 800, y: 250 }, platform),
];

const keys = {
  right: {
    pressed: false,
  },
  left: {
    pressed: false,
  },
};

function animate() {
  requestAnimationFrame(animate);
  c.clearRect(0, 0, canvas.width, canvas.height);

  genericObjects.forEach((object) => object.draw(c));
  platforms.forEach((platform) => platform.draw(c));
  player.update(c, canvas);

  if (keys.right.pressed && player.position.x < 400) player.velocity.x = 5;
  else if (keys.left.pressed && player.position.x > 100) player.velocity.x = -5;
  else {
    player.velocity.x = 0;
    if (keys.right.pressed) {
      platforms.forEach((platform) => (platform.position.x -= 5));
      genericObjects.forEach((object) => (object.position.x -= 2));
      scrollOffset += 5;
    } else if (keys.left.pressed) {
      platforms.forEach((platform) => (platform.position.x += 5));
      genericObjects.forEach((object) => (object.position.x += 2));
      scrollOffset -= 5;
    }
  }
  console.log(scrollOffset);

  platforms.forEach((platform) => {
    if (
      player.position.y + player.height <= platform.position.y &&
      player.position.y + player.height + player.velocity.y >=
        platform.position.y &&
      player.position.x + player.width >= platform.position.x &&
      player.position.x <= platform.position.x + platform.width
    ) {
      player.position.y = platform.position.y - player.height;
      player.velocity.y = 0;
    }
  });

  if (scrollOffset > 2000) {
    console.log("you won");
  }
}

animate();

addEventListener("keydown", ({ code }) => {
  console.log(code);
  switch (code) {
    case "ArrowUp":
    case "KeyW":
    case "Space":
      player.velocity.y = -15;
      break;
    case "ArrowDown":
    case "KeyS":
      console.log("down");
      break;
    case "ArrowLeft":
    case "KeyA":
      console.log("left");
      keys.left.pressed = true;
      break;
    case "ArrowRight":
    case "KeyD":
      keys.right.pressed = true;
      break;
  }
});

addEventListener("keyup", ({ code }) => {
  console.log(code);
  switch (code) {
    case "ArrowUp":
    case "KeyW":
    case "Space":
      break;
    case "ArrowDown":
    case "KeyS":
      console.log("down");
      break;
    case "ArrowLeft":
    case "KeyA":
      keys.left.pressed = false;
      break;
    case "ArrowRight":
    case "KeyD":
      keys.right.pressed = false;
      break;
  }
  console.log(keys.right.pressed);
});
