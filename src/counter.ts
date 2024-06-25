

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const c = canvas.getContext("2d") as CanvasRenderingContext2D;
const startScreen = document.getElementById("start-screen") as HTMLDivElement;
const endScreen = document.getElementById("end-screen") as HTMLDivElement;
const startButton = document.getElementById(
  "start-button"
) as HTMLButtonElement;
const restartButton = document.getElementById(
  "restart-button"
) as HTMLButtonElement;

function selectLevel(level: number) {
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

  startScreen.style.display = "none";
  endScreen.style.display = "none";
  canvas.style.display = "block";
  
}

async function level2init() {
 
  startScreen.style.display = "none";
  endScreen.style.display = "none";
  canvas.style.display = "block";
  
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
  Flag.draw(c);

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
      player.velocity.y = -15;
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
        //gameover due to strike with enemy
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
        //game over due to strike with water
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

  //switch to level 2
  if (scrollOffset >= 5285) {
    currentLevel += 1;
    audio.level1CompleteSound.play();
    //go to next level
    selectLevel(currentLevel);
  }

  //game over due to falling
  if (player.position.y + player.height >= canvas.height) {
    selectLevel(currentLevel);
  }

}

selectLevel(currentLevel);
animate();




startButton.addEventListener("click", () => {
  selectLevel(1);
});

restartButton.addEventListener("click", () => {
  selectLevel(1);
});
