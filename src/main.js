import './style.css'
import Phaser from 'phaser'

const sizes = {
  width: 500,
  height: 500,

}

const speedDown = 300

class GameScene extends Phaser.Scene {
  constructor(){
    super("scene-game")
    this.player
    this.cursors
    this.playerSpeed = speedDown + 50
    this.target
    this.points = 0
  }

  preload() {
    this.load.image("bg", 'assets/bg.png')
    this.load.image("basket", 'assets/basket.png')
    this.load.image("apple", 'assets/apple.png')  
  }
  create(){
    this.add.image(0, 0, "bg").setOrigin(0, 0)

    this.player = this.physics.add
    .image(0, sizes.height -100, "basket")
    .setOrigin(0, 0)

    this.player.setCollideWorldBounds(true)
    this.player.setImmovable()
    this.player.body.allowGravity = false
    this.player.body.setSize(100, 15)

    this.target = this.physics.add
    .image(this.getRandomX(), 0, "apple")
    .setOrigin(0, 0)
    this.target.setMaxVelocity(0, speedDown)

    this.physics.add.collider(this.player, this.target, this.targetHit, null, this)

    this.cursors = this.input.keyboard.createCursorKeys()
  }
  update(){

    if(this.target.y > sizes.height){
      this.target.y = 0
      this.target.x = this.getRandomX()
    }


    const { left, right } = this.cursors;
    if(left.isDown){
      this.player.setVelocityX(-this.playerSpeed)
    }
    else if(right.isDown){
      this.player.setVelocityX(this.playerSpeed)
    } else
      this.player.setVelocityX(0)
  }

  getRandomX(){
    return Math.floor(Math.random() * sizes.width)
  }

  targetHit(){
    this.points++
    this.target.setY(0)
    this.target.setX(this.getRandomX())
  }
}


const config = {
  type: Phaser.WEBGL,
  width: sizes.width,
  height: sizes.height,
  canvas: gameCanvas,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: speedDown },
      debug: true
    } 
  },
  scene: [GameScene]  
}

const game = new Phaser.Game(config);
