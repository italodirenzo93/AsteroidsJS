/*
	Title: state_play.js
	Author: Italo Di Renzo
	Description: Playing game state.
	Last Edit: 09/29/2017
*/
(function (Asteroids) {
	'use strict';

	Asteroids.score = 0;

	// Variables
	var game;
	var fontStyle = { font: '18pt Audiowide', fill: '#fff', align: 'center' };
	var shotTimer = 0, shotDelay = 190, shotSpeed = 550;
	var waveIncoming = false;

	// Game objects
	var ship, background, scoreText;

	// Groups
	var asteroids, explosions, lasers;

	// Sounds
	var sfx_laser1, sfx_explosion1;

	// Define game state
	Asteroids.InGameState = {
		init: function () {
			game = this.game;
			game.input.maxPointers = 1;
		},

		create: function () {
			// Start physics system
			game.physics.startSystem(Phaser.Physics.ARCADE);
		
			// Insert and initialize assets
			background = game.add.tileSprite(0, 0, game.width, game.height, 'space');
		
			// create ship
			ship = game.add.sprite(game.world.centerX, game.world.centerY, 'ship', 0);
			ship.anchor.setTo(0.5, 0.5);
			game.physics.arcade.enable(ship);
			ship.animations.add('fly', [0, 1], 10, true);
			ship.animations.play('fly');
			
			// create laser group
			lasers = game.add.group();
			lasers.enableBody = true;
			lasers.physicsBodyType = Phaser.Physics.ARCADE;
			lasers.createMultiple(10, 'lasers');
			lasers.setAll('checkWorldBounds', true);
			lasers.setAll('outOfBoundsKill', true);
		
			sfx_laser1 = game.add.audio('sfx_laser1', 0.5);
		
			// create asteroid group
			asteroids = game.add.group();
			asteroids.enableBody = true;
			asteroids.physicsBodyType = Phaser.Physics.ARCADE;
			asteroids.createMultiple(20, 'asteroid');
			asteroids.setAll('checkWorldBounds', true);
			asteroids.setAll('outOfBoundsKill', true);
		
			// create explosion group
			explosions = game.add.group();
			explosions.createMultiple(20, 'explosion');
		
			var animationFrames = [];
			for (var i = 1; i != 15; i++) animationFrames.push(i);
		
			explosions.forEach(function (explosion) {
				explosion.animations.add('explode', animationFrames, 30, false);
			}, this);
		
			sfx_explosion1 = game.add.audio('sfx_explosion1');
			
			scoreText = game.add.text(game.world.centerX, 30, 'SCORE: ' + Asteroids.score, Asteroids.fontStyle);
			scoreText.anchor.setTo(0.5, 0.5);
		},

		update: function () {
			// Scroll the background
			background.tilePosition.x -= 0.5;
		
			if(!waveIncoming && asteroids.countLiving() == 0) {
				game.time.events.add(Phaser.Timer.SECOND * 5, spawnAsteroids, this);
				waveIncoming = true;
			}
		
			// Adjust ship's speed relative to its distance from the mouse cursor
			var shipSpeed = Phaser.Point.distance(ship, game.input.activePointer, true);
			game.physics.arcade.moveToPointer(ship, shipSpeed);
		
			// Rotate the ship toward the mouse cursor
			var targetAngle = (360 / (2 * Math.PI)) * game.math.angleBetween(
					ship.x, ship.y,
					game.input.x,
					game.input.y) + 90;
				ship.body.rotation = targetAngle;
		
			// If the ship reaches the mouse cursor, stop moving
			if(Phaser.Rectangle.contains(ship.body, game.input.x, game.input.y)) {
				ship.body.velocity.setTo(0, 0);
			}
		
			// On left-mouse button down, activate the the "lasers". Muahahahaha!!!
			if(game.input.activePointer.isDown) {
				if(shotTimer < game.time.now) {
					shotTimer = game.time.now + shotDelay;
		
					var shot = lasers.getFirstDead();
					shot.reset(ship.x, ship.y);
					shot.rotation = ship.rotation;	// this is a problem
					shot.anchor.setTo(0.5, 2); 
					game.physics.arcade.moveToPointer(shot, shotSpeed);
					sfx_laser1.play();
				}
			}
		
			// Collision masks
			game.physics.arcade.collide(asteroids);
			game.physics.arcade.overlap(ship, asteroids, function (asteroid, ship) { game.state.start('EndGame') }, null, this);
			game.physics.arcade.overlap(asteroids, lasers, destroyAsteroid, null, this);
		},

		render: function () {
			// debug stuff
			game.debug.text('Asteroids Living: ' + asteroids.countLiving(), 30, 40);
			game.debug.text('Asteroids Dead: ' + asteroids.countDead(), 30, 60);
			game.debug.text('Explosions Living: ' + asteroids.countLiving(), 30, 80);
			game.debug.text('Explosions Dead: ' + asteroids.countDead(), 30, 100);
		}
	};

	function spawnAsteroids() {
		var shipX = ship.centerX;
		var shipY = ship.centerY;
		var minDistance = 75;
	
		var screenPadding = 50;
		var screenWidth = this.game.width - screenPadding;
		var screenHeight = this.game.height - screenPadding;
	
		while(asteroids.countDead() != 0) {
			var asteroid = asteroids.getFirstDead();
			asteroid.body.setSize(30, 30);
	
			// Find a location to spawn that isn't directly on top of the player
			var x, y;
			do {
				x = game.rnd.between(screenPadding, screenWidth);
				y = game.rnd.between(screenPadding, screenHeight);
			}
			while (game.math.distance(x, y, shipX, shipY) < minDistance);
	
			asteroid.reset(x, y);
		}

		waveIncoming = false;
	}

	function destroyAsteroid(asteroid, shot) {
		var explosion = explosions.getFirstDead();
		explosion.reset(asteroid.x, asteroid.y);
		explosion.animations.play('explode', null, false, true);
		sfx_explosion1.play();
	
		asteroid.kill();
		shot.kill();
	
		Asteroids.score += 10;
		scoreText.setText('SCORE: ' + Asteroids.score);
	}

}(window.Asteroids = window.Asteroids || {}));