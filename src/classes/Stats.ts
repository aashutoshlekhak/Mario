import { getImage } from "../utils/utils";
import coinImage from "../../public/mySprites/coins.png";
import heartImage from "../../public/mySprites/heart.png";

export class DisplayElement {
  position: {
    x: number;
    y: number;
  };
  width: number;
  height: number;
  coinImg: HTMLImageElement;
  heartImg: HTMLImageElement;
  coins: number;
  lives: number;
  isPaused: boolean;

  constructor(
    { x, y }: { x: number; y: number },
    coins: number,
    lives: number,
    isPaused: boolean
  ) {
    this.width = 230; // Increased width
    this.height = 120; // Adjusted height
    this.position = {
      x: x,
      y: y,
    };

    this.coinImg = getImage(coinImage);
    this.heartImg = getImage(heartImage);
    this.coins = coins;
    this.lives = lives;
    this.isPaused = isPaused;
  }

  draw(c: CanvasRenderingContext2D) {
    c.fillStyle = "rgba(0, 0, 0, 0.5)";
    c.strokeStyle = "rgba(255, 255, 255, 0.8)";
    c.lineWidth = 2;

  
    c.beginPath();
    c.moveTo(this.position.x , this.position.y);
    c.lineTo(this.position.x + this.width , this.position.y);
    c.lineTo(this.position.x + this.width, this.position.y + this.height );
    c.lineTo(this.position.x , this.position.y + this.height);
    c.lineTo(this.position.x, this.position.y );
    c.closePath();

    
    c.fill();
    c.stroke();

  
    c.fillStyle = "yellow";
    c.font = "bold 24px Arial"; // Game theme bold font

    // Draw coins text and icon
    c.fillText("Coins:", this.position.x + 20, this.position.y + 40);
    c.drawImage(
      this.coinImg,
      this.position.x + 120,
      this.position.y + 20,
      30,
      30
    );
    c.fillText(
      this.coins.toString(),
      this.position.x + 160,
      this.position.y + 40
    );

    // Set text style for lives
    c.fillStyle = "#00FF47"; // Lime green
    c.font = "bold 24px Arial"; // Game theme bold font

    // Draw lives text and icon
    c.fillText("Life:", this.position.x + 20, this.position.y + 90);
    c.drawImage(
      this.heartImg,
      this.position.x + 120,
      this.position.y + 70,
      30,
      30
    );
    c.fillText(
      this.lives.toString(),
      this.position.x + 160,
      this.position.y + 90
    );
  }
}
