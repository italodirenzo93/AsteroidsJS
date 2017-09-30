/*
	Title: GS_InGame.js
	Author: Italo Di Renzo
	Description: Playing game state.
	Last Edit: 09/29/2017
*/
(function (Asteroids) {
	'use strict';

	Asteroids.score = 0;

	// Variables
	var fontStyle = { font: '18pt Audiowide', fill: '#fff', align: 'center' };
	var shotTimer = 0, shotDelay = 190, shotSpeed = 550;

	// Define game state
	Asteroids.InGameState = {
		create: function () {
			// Start physics system
			this.physics.startSystem(Phaser.Physics.ARCADE);
		
			// Insert and initialize assets
			this.bg = this.game.add.tileSprite(0, 0, this.game.width, this.game.height, 'space');
		
			// create ship
			this.ship = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'ship', 0);
			this.ship.anchor.setTo(0.5, 0.5);
			this.physics.arcade.enable(this.ship);
			this.ship.animations.add('fly', [0, 1], 10, true);
			this.ship.animations.play('fly');
			
			// create laser group
			this.lasers = this.game.add.group();
			this.lasers.enableBody = true;
			this.lasers.physicsBodyType = Phaser.Physics.ARCADE;
			this.lasers.createMultiple(10, 'lasers');
			this.lasers.setAll('checkWorldBounds', true);
			this.lasers.setAll('outOfBoundsKill', true);
		
			this.sfx_laser1 = this.add.audio('sfx_laser1', 0.5);
		
			// create asteroid group
			this.asteroidGroup = this.add.group();
			this.asteroidGroup.enableBody = true;
			this.asteroidGroup.physicsBodyType = Phaser.Physics.ARCADE;
			this.asteroidGroup.createMultiple(20, 'asteroid');
			this.asteroidGroup.setAll('checkWorldBounds', true);
			this.asteroidGroup.setAll('outOfBoundsKill', true);
		
			// create explosion group
			this.explosionGroup = this.add.group();
			this.explosionGroup.createMultiple(20, 'explosion');
		
			var animationFrames = [];
			for (var i = 1; i != 15; i++) animationFrames.push(i);
		
			this.explosionGroup.forEach(function (explosion) {
				explosion.animations.add('explode', animationFrames, 30, false);
			}, this);
		
			this.sfx_explosion1 = this.add.audio('sfx_explosion1');
			
			this.scoreText = this.game.add.text(this.game.world.centerX, 30, 'SCORE: ' + Asteroids.score, Asteroids.fontStyle);
			this.scoreText.anchor.setTo(0.5, 0.5);
		},

		update: function () {
			// Scroll the background
			this.bg.tilePosition.x -= 0.5;
		
			if(this.asteroidGroup.countLiving() === 0) {
				var spawnTimer = this.time.create(true);
				spawnTimer.add(5000, this.spawnAsteroids, this);
				spawnTimer.start();
			}
		
			// Adjust ship's speed relative to its distance from the mouse cursor
			var shipSpeed = Phaser.Point.distance(this.ship, this.input.activePointer, true);
			this.physics.arcade.moveToPointer(this.ship, shipSpeed);
		
			// Rotate the ship toward the mouse cursor
			var targetAngle = (360 / (2 * Math.PI)) * this.game.math.angleBetween(
					this.ship.x, this.ship.y,
					this.game.input.x,
					this.game.input.y) + 90;
				this.ship.body.rotation = targetAngle;
		
			// If the ship reaches the mouse cursor, stop moving
			if(Phaser.Rectangle.contains(this.ship.body, this.game.input.x, this.game.input.y)) {
				this.ship.body.velocity.setTo(0, 0);
			}
		
			// On left-mouse button down, activate the the "lasers". Muahahahaha!!!
			if(this.input.activePointer.isDown) {
				if(shotTimer < this.time.now) {
					shotTimer = this.time.now + shotDelay;
		
					var shot = this.lasers.getFirstDead();
					shot.reset(this.ship.x, this.ship.y);
					shot.rotation = this.ship.rotation;	// this is a problem
					shot.anchor.setTo(0.5, 2); 
					this.physics.arcade.moveToPointer(shot, shotSpeed);
					this.sfx_laser1.play();
				}
			}
		
			// Collision masks
			this.physics.arcade.collide(this.asteroidGroup);
			this.physics.arcade.overlap(this.ship, this.asteroidGroup, function (asteroid, ship) { this.state.start('EndGame') }, null, this);
			this.physics.arcade.overlap(this.asteroidGroup, this.lasers, this.destroyAsteroid, null, this);
		},

		spawnAsteroids: function () {
			var ship = this.ship;
			var shipX = ship.centerX;
			var shipY = ship.centerY;
			var minDistance = 75;
		
			var screenPadding = 50;
			var screenWidth = this.game.width - screenPadding;
			var screenHeight = this.game.height - screenPadding;
		
			while(this.asteroidGroup.countDead() !== 0) {
				var asteroid = this.asteroidGroup.getFirstDead();
				asteroid.body.setSize(30, 30);
		
				// Find a location to spawn that isn't directly on top of the player
				var x, y;
				do {
					x = this.rnd.between(screenPadding, screenWidth);
					y = this.rnd.between(screenPadding, screenHeight);
				}
				while (this.math.distance(x, y, shipX, shipY) < minDistance);
		
				asteroid.reset(x, y);
			}
		},

		destroyAsteroid: function (asteroid, shot) {
			var explosion = this.explosionGroup.getFirstDead();
			explosion.reset(asteroid.x, asteroid.y);
			explosion.animations.play('explode', null, false, true);
			this.sfx_explosion1.play();
		
			asteroid.kill();
			shot.kill();
		
			Asteroids.score += 10;
			this.scoreText.setText('SCORE: ' + Asteroids.score);
		},

		render: function () {
			// debug stuff
			this.game.debug.text('Asteroids Living: ' + this.asteroidGroup.countLiving(), 30, 40);
			this.game.debug.text('Asteroids Dead: ' + this.asteroidGroup.countDead(), 30, 60);
			this.game.debug.text('Explosions Living: ' + this.explosionGroup.countLiving(), 30, 80);
			this.game.debug.text('Explosions Dead: ' + this.explosionGroup.countDead(), 30, 100);
		}
	};

}(Asteroids = Asteroids || {}));