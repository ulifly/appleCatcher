import './style.css'
import Phaser, { Display } from 'phaser'

const sizes = {
  width: 500,
  height: 500,

}

const speedDown = 300

const gameStartDiv = document.querySelector("#gameStartDiv")
const gameStartButton = document.querySelector("#gameStartButton")
const gameEndDiv = document.querySelector("#gameEndDiv")
const gameWinLoseSpan = document.querySelector("#gameWinLoseSpan")
const gameEndScoreSpan = document.querySelector("#gameEndScoreSpan")

class GameScene extends Phaser.Scene {
  constructor(){
    super("scene-game")
    this.player
    this.cursors
    this.playerSpeed = speedDown + 50
    this.target
    this.points = 0
    this.textScore
    this.texTime
    this.tineEvent
    this.remaningTime 
    this.bgMusic
    this.coinSound
    this.emmiter
  }

  preload() {
    this.load.image("bg", 'assets/bg.png')
    this.load.image("basket", 'assets/basket.png')
    this.load.image("apple", 'assets/apple.png')
    this.load.image("money", 'assets/money.png')

    this.load.audio("bgMusic", 'assets/bgMusic.mp3')
    this.load.audio("coin", 'assets/coin.mp3')
  }
  create(){
    this.scene.pause()

    this.bgMusic = this.sound.add("bgMusic")
    this.coinSound = this.sound.add("coin")
    this.bgMusic.play()

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

    this.textScore = this.add.text(sizes.width - 120, 10, "Score: 0", {
      fontSize: '25px Arial',
      fill: '#000000'
    })

    this.textTime = this.add.text(10, 10, "Time: 0", {
      fontSize: '25px Arial',
      fill: '#000000'
    })

    this.timeEvent = this.time.delayedCall(30000, this.gameOver, [], this)

    this.emmiter = this.add.particles(0,0, 'money', {
      speed: 100,
      gravityY: speedDown -200,
      scale: 0.04,
      duration: 100,
      emmiting: false
    })

    this.emmiter.startFollow(this.player, this.player.width / 2, this.player.height / 2)
  }



  update(){
    this.remaningTime = this.timeEvent.getRemainingSeconds()
    this.textTime.setText(`Time: ${Math.round(this.remaningTime).toString()}`)

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
    this.emmiter.start()
    this.coinSound.play()
    this.points++
    this.target.setY(0)
    this.target.setX(this.getRandomX())
    this.textScore.setText(`Score: ${this.points}`)
  }

  gameOver(){
    this.sys.game.destroy(true)
    this.bgMusic.stop()
    if (this.points >= 10){
      gameEndScoreSpan.textContent = this.points
      gameWinLoseSpan.textContent = " Win! 😃 "
    } else {
      gameEndScoreSpan.textContent = this.points
      gameWinLoseSpan.textContent = "You Lose! 😢"
    }
    gameEndDiv.style.display = "flex"
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

gameStartButton.addEventListener("click", () => {
  gameStartDiv.style.display = "none"
  game.scene.resume("scene-game")
})