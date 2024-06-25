import coinSound from "../../public/sounds/coinCollect.mp3";
import jumpSound from "../../public/sounds/playerJump.wav";
import bulletSound from "../../public/sounds/laserGun.mp3";
import level1CompleteSound from "../../public/sounds/level1complete.wav";
import level2CompleteSound from "../../public/sounds/level2complete.wav";
import mouseClickSound from "../../public/sounds/mouseClick.mp3";
import enemyKilled from "../../public/sounds/enemyHit.wav";


export const audio ={
    coinSound: new Audio(coinSound),
    jumpSound: new Audio(jumpSound),
    bulletSound: new Audio(bulletSound),
    level1CompleteSound: new Audio(level1CompleteSound),
    level2CompleteSound: new Audio(level2CompleteSound),
    mouseClickSound: new Audio(mouseClickSound), 
    enemyKilled: new Audio(enemyKilled),
}

