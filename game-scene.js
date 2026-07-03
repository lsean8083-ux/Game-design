import Phaser from '../lib/phaser.js';
import { SCENE_KEYS } from '../common/scene-keys.js';
import { ASSET_KEYS } from '../common/assets.js';

export class GameScene extends Phaser.Scene {
  constructor() {
    super({
      key: SCENE_KEYS.GAME_SCENE,
    });

    this.jar = null;
    this.jarY = 0;
    this.jarSpeed = 600;
    this.controls = null;
    this.fallingObjects = [];
    this.fallingObjectMinSpeed = 320;
    this.fallingObjectMaxSpeed = 480;
    this.fallingObjectScale = 0.75;
    this.caughtObjectHoldDurationMs = 500;
    this.fallingDurationMs = 5 * 60 * 1000;
    this.elapsedFallingTimeMs = 0;
    this.isFallingActive = true;
  }

  /**
   * @public
   * Tied to the Phaser Scene lifecycle. Will run one time after the PRELOAD
   * logic is finished. Runs each time the Phaser Scene restarts.
   * @returns {void}
   */
  create() {
    // get scene width and height
    const { width, height } = this.scale;

    this.elapsedFallingTimeMs = 0;
    this.isFallingActive = true;

    // add game background
    this.add.image(width / 2, height / 2, ASSET_KEYS.BACKGROUND);
    // add player
    this.jarY = height - 100;
    this.jar = this.add.image(width / 2, this.jarY, ASSET_KEYS.JAR).setInteractive({
      useHandCursor: true,
    });
    this.jar.setDepth(2);
    this.input.setDraggable(this.jar);
    this.input.on('drag', (_pointer, gameObject, dragX) => {
      if (gameObject !== this.jar) {
        return;
      }

      gameObject.x = this.getClampedJarX(dragX);
      gameObject.y = this.jarY;
    });

    this.controls = this.input.keyboard?.addKeys({
      left: Phaser.Input.Keyboard.KeyCodes.LEFT,
      right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
      a: Phaser.Input.Keyboard.KeyCodes.A,
      d: Phaser.Input.Keyboard.KeyCodes.D,
    });

    const frameNames = this.textures.get(ASSET_KEYS.OBJECTS).getFrameNames();

    this.fallingObjects = frameNames.map((frameName, index) => {
      const gameObject = this.add.image(0, 0, ASSET_KEYS.OBJECTS, frameName)
        .setScale(this.fallingObjectScale)
        .setDepth(1);

      gameObject.setPosition(
        this.getInitialFallingObjectX(gameObject, index, frameNames.length),
        -100 - index * 120
      );

      return {
        gameObject,
        speed: Phaser.Math.FloatBetween(this.fallingObjectMinSpeed, this.fallingObjectMaxSpeed),
        isCaught: false,
        catchOffsetX: 0,
        catchOffsetY: 0,
        caughtTimeMs: 0,
      };
    });
  }

  update(_time, delta) {
    const deltaSeconds = delta / 1000;

    this.updateJar(deltaSeconds);
    this.updateFallingTimer(delta);

    if (!this.isFallingActive) {
      return;
    }

    this.updateFallingObjects(deltaSeconds, delta);
  }

  getClampedJarX(x) {
    const halfJarWidth = this.jar.displayWidth / 2;

    return Phaser.Math.Clamp(x, halfJarWidth, this.scale.width - halfJarWidth);
  }

  updateJar(deltaSeconds) {
    if (!this.jar) {
      return;
    }

    this.jar.y = this.jarY;

    if (!this.controls) {
      return;
    }

    let direction = 0;

    if (this.controls.left.isDown || this.controls.a.isDown) {
      direction -= 1;
    }

    if (this.controls.right.isDown || this.controls.d.isDown) {
      direction += 1;
    }

    if (direction === 0) {
      return;
    }

    this.jar.x = this.getClampedJarX(this.jar.x + direction * this.jarSpeed * deltaSeconds);
  }

  updateFallingTimer(delta) {
    if (!this.isFallingActive) {
      return;
    }

    this.elapsedFallingTimeMs += delta;

    if (this.elapsedFallingTimeMs >= this.fallingDurationMs) {
      this.elapsedFallingTimeMs = this.fallingDurationMs;
      this.isFallingActive = false;
    }
  }

  updateFallingObjects(deltaSeconds, delta) {
    this.fallingObjects.forEach((fallingObject) => {
      if (fallingObject.isCaught) {
        this.positionCaughtObject(fallingObject);

        fallingObject.caughtTimeMs += delta;

        if (fallingObject.caughtTimeMs >= this.caughtObjectHoldDurationMs) {
          this.resetFallingObject(fallingObject);
        }

        return;
      }

      fallingObject.gameObject.y += fallingObject.speed * deltaSeconds;

      if (this.isObjectCaughtByJar(fallingObject.gameObject)) {
        this.catchObject(fallingObject);
        return;
      }

      if (fallingObject.gameObject.y - fallingObject.gameObject.displayHeight / 2 > this.scale.height) {
        this.resetFallingObject(fallingObject);
      }
    });
  }

  resetFallingObject(fallingObject) {
    fallingObject.isCaught = false;
    fallingObject.catchOffsetX = 0;
    fallingObject.catchOffsetY = 0;
    fallingObject.caughtTimeMs = 0;
    fallingObject.speed = Phaser.Math.FloatBetween(this.fallingObjectMinSpeed, this.fallingObjectMaxSpeed);
    fallingObject.gameObject.x = this.getRandomFallingObjectX(fallingObject.gameObject);
    fallingObject.gameObject.y = -fallingObject.gameObject.displayHeight / 2 - Phaser.Math.Between(20, 180);
  }

  catchObject(fallingObject) {
    const maxCatchOffsetX = this.jar.displayWidth * 0.2;

    fallingObject.isCaught = true;
    fallingObject.speed = 0;
    fallingObject.caughtTimeMs = 0;
    fallingObject.catchOffsetX = Phaser.Math.Clamp(
      fallingObject.gameObject.x - this.jar.x,
      -maxCatchOffsetX,
      maxCatchOffsetX
    );
    fallingObject.catchOffsetY = -this.jar.displayHeight * 0.2;

    this.positionCaughtObject(fallingObject);
  }

  positionCaughtObject(fallingObject) {
    const minX = fallingObject.gameObject.displayWidth / 2;
    const maxX = this.scale.width - fallingObject.gameObject.displayWidth / 2;

    fallingObject.gameObject.x = Phaser.Math.Clamp(this.jar.x + fallingObject.catchOffsetX, minX, maxX);
    fallingObject.gameObject.y = this.jar.y + fallingObject.catchOffsetY;
  }

  isObjectCaughtByJar(gameObject) {
    if (!this.jar) {
      return false;
    }

    return Phaser.Geom.Intersects.RectangleToRectangle(gameObject.getBounds(), this.getJarCatchBounds());
  }

  getJarCatchBounds() {
    const catchWidth = this.jar.displayWidth * 0.55;
    const catchHeight = this.jar.displayHeight * 0.28;

    return new Phaser.Geom.Rectangle(
      this.jar.x - catchWidth / 2,
      this.jar.y - this.jar.displayHeight * 0.35,
      catchWidth,
      catchHeight
    );
  }

  getInitialFallingObjectX(gameObject, index, totalObjects) {
    if (totalObjects === 1) {
      return this.scale.width / 2;
    }

    const progress = index / (totalObjects - 1);
    const minX = gameObject.displayWidth / 2;
    const maxX = this.scale.width - gameObject.displayWidth / 2;

    return Phaser.Math.Linear(minX, maxX, progress);
  }

  getRandomFallingObjectX(gameObject) {
    const minX = gameObject.displayWidth / 2;
    const maxX = this.scale.width - gameObject.displayWidth / 2;

    return Phaser.Math.FloatBetween(minX, maxX);
  }
}
